// lib/line/messageHandler.js

import {
  getBindingByLineId,
  bindUser,
} from "../../../backend/services/userBindingService.js";
import { fetchOrdersAndFormatFlex } from "../../../backend/services/orderService.js";
import { switchRichMenuByUserState } from "../../../backend/services/richMenuService.js";
import {
  cleanString,
  isValidEmail,
  isValidPhone,
  containsKeyword,
} from "../../../backend/utils/stringHelper.js";

/**
 * 處理來自 LINE 的單一事件
 * @param {object} event - LINE Webhook Event
 * @param {object} client - LINE Bot SDK 的 client 實例
 */
export default async function messageHandler(event, client) {
  const { type, source, message } = event;

  if (type !== "message" || !message || message.type !== "text") {
    console.log("非文字訊息，略過");
    return;
  }

  const lineId = source.userId;
  const userInput = cleanString(message.text);

  try {
    // 1️⃣ 若輸入為 "查詢訂單"，判斷是否已綁定
    if (containsKeyword(userInput, "查詢訂單")) {
      const contact = await getBindingByLineId(lineId);

      if (!contact) {
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "請輸入您當初下單所填寫的 Email 或手機號碼以查詢訂單。",
        });
        return;
      }

      // 已綁定，直接查詢
      const flexMessage = await fetchOrdersAndFormatFlex({
        contact,
        type: isValidEmail(contact) ? "email" : "phone",
      });

      if (flexMessage) {
        await client.replyMessage(event.replyToken, flexMessage);
      } else {
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "找不到相關訂單，請確認您的聯絡資訊是否正確。",
        });
      }

      return;
    }

    // 2️⃣ 若使用者輸入的是 Email 或電話，代表在綁定階段
    if (isValidEmail(userInput) || isValidPhone(userInput)) {
      // 檢查是否已有綁定
      const existed = await getBindingByLineId(lineId);
      if (existed) {
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: `您已綁定聯絡資訊：${existed}，無需重複綁定。`,
        });
        return;
      }

      // 建立綁定
      await bindUser(lineId, userInput);

      // 切換 Rich Menu 為「已綁定版」
      await switchRichMenuByUserState(client, lineId);

      await client.replyMessage(event.replyToken, {
        type: "text",
        text: `綁定成功 ✅\n現在您可以輸入「查詢訂單」來查看您的訂單資訊。`,
      });
      return;
    }

    // 3️⃣ 其他情境：給予回應提示
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: "您好，請輸入「查詢訂單」來開始查詢，或提供您的 Email/手機以綁定身份。",
    });
  } catch (err) {
    console.error("❌ 處理 LINE 訊息時發生錯誤:", err);
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: "系統暫時發生錯誤，請稍後再試 🙇‍♂️",
    });
  }
}
