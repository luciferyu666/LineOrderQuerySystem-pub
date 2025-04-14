// lib/line/messageHandler.js

import {
  getUserBinding,
  bindUserWithPhoneEmail,
} from "@services/userBindingService.js";
import { fetchOrdersAndFormatFlex } from "@services/orderService.js";
import { switchRichMenuByUserState } from "@services/richMenuService.js";

import {
  cleanString,
  isValidEmail,
  isValidPhone,
  containsKeyword,
} from "@utils/stringHelper.js";

/**
 * 以 Map 模擬儲存使用者目前綁定階段 (僅示範用)
 * 若要在多機環境運作，建議改用 Redis 或 DB 做狀態紀錄
 */
const userStateMap = new Map();

// 定義對話狀態常數
const STATE_NONE = "NONE"; // 無狀態
const STATE_WAIT_PHONE = "WAIT_PHONE";
const STATE_WAIT_EMAIL = "WAIT_EMAIL";

/**
 * 處理來自 LINE 的單一事件 (文字訊息)
 * @param {object} event - LINE Webhook Event
 * @param {object} client - LINE Bot SDK 的 client 實例
 */
export default async function messageHandler(event, client) {
  const { type, source, message } = event;

  // 只處理文字訊息事件
  if (type !== "message" || !message || message.type !== "text") {
    console.log("非文字訊息，略過");
    return;
  }

  const lineId = source.userId;
  const userInput = cleanString(message.text);

  // 取得使用者當前對話狀態，若無則視為 NONE
  let currentState = userStateMap.get(lineId) || STATE_NONE;

  try {
    // 若使用者輸入 "查詢訂單"
    if (containsKeyword(userInput, "查詢訂單")) {
      // 檢查是否已綁定 phone+email
      const userBinding = await getUserBinding(lineId);

      if (!userBinding) {
        // 尚未綁定 → 引導進入「電話號碼輸入」階段
        userStateMap.set(lineId, STATE_WAIT_PHONE);

        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "請先輸入手機號碼，以便綁定查詢。",
        });
        return;
      }

      // 已綁定 → 直接查詢訂單 (假設 userBinding 內含 phone+email)
      const { phone, email } = userBinding;
      if (!phone || !email) {
        // 若舊資料僅有單一資訊可再做兼容，如引導升級雙綁定
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "您目前綁定資訊不完整，請重新綁定（手機+Email）以查詢訂單。",
        });
        userStateMap.set(lineId, STATE_WAIT_PHONE);
        return;
      }

      // 進行訂單查詢
      const flexMessage = await fetchOrdersAndFormatFlex(phone, email);
      if (flexMessage) {
        await client.replyMessage(event.replyToken, flexMessage);
      } else {
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "找不到相關訂單，請確認電話與 Email 是否正確。",
        });
      }
      return;
    }

    // 若目前對話狀態為等待手機 → 檢查 userInput 是否有效電話
    if (currentState === STATE_WAIT_PHONE) {
      if (!isValidPhone(userInput)) {
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "電話格式不正確，請重新輸入手機號碼。",
        });
        return;
      }

      // 暫存 phone
      userStateMap.set(lineId, {
        stage: STATE_WAIT_EMAIL,
        phone: userInput,
      });

      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "好的！請再輸入您的 Email：",
      });
      return;
    }

    // 若目前對話狀態為等待 Email
    if (
      typeof currentState === "object" &&
      currentState.stage === STATE_WAIT_EMAIL
    ) {
      const { phone } = currentState;
      if (!isValidEmail(userInput)) {
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "Email 格式不正確，請重新輸入。",
        });
        return;
      }

      // 嘗試雙綁定 (phone + email)
      const email = userInput;
      const bindResult = await bindUserWithPhoneEmail(lineId, phone, email);
      if (!bindResult) {
        // 綁定失敗（Shopify查無 phone+email 的訂單）
        // 重置狀態 or 回到 STATE_WAIT_PHONE
        userStateMap.set(lineId, STATE_WAIT_PHONE);
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "找不到同時符合此電話和 Email 的訂單，請確認後再輸入手機。",
        });
        return;
      }

      // 綁定成功 → 清除暫存
      userStateMap.delete(lineId);

      // 切換 Rich Menu
      await switchRichMenuByUserState(client, lineId);

      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "恭喜您已完成雙綁定 ✅\n現在可以輸入「查詢訂單」來查看您的訂單資訊。",
      });
      return;
    }

    // 若使用者沒輸入「查詢訂單」、也不在狀態流程中
    // 或輸入的內容不符合電話/Email → 提示
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: "您好，請輸入「查詢訂單」來開始綁定查詢，或依提示輸入手機與 Email 完成雙綁定。",
    });
  } catch (err) {
    console.error("❌ 處理 LINE 訊息時發生錯誤:", err);
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: "系統暫時發生錯誤，請稍後再試 🙇‍♂️",
    });
  }
}
