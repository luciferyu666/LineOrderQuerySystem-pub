// tests/integration/webhookFlow.test.js

import messageHandler from "../../../lib/line/messageHandler.js";
import * as userBindingService from "../../../backend/services/userBindingService.js";
import * as orderService from "../../../backend/services/orderService.js";
import * as richMenuService from "../../../backend/services/richMenuService.js";

// 建立假 LINE Client
const mockReplyMessage = jest.fn();
const lineClient = { replyMessage: mockReplyMessage };

describe("🧪 Webhook Flow Integration Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const lineId = "U1234567890";
  const replyToken = "dummy-reply-token";

  it("🟡 使用者未綁定時輸入「查詢訂單」→ 提示輸入聯絡方式", async () => {
    userBindingService.getBindingByLineId = jest.fn().mockResolvedValue(null);

    const event = {
      type: "message",
      message: { type: "text", text: "查詢訂單" },
      source: { userId: lineId },
      replyToken,
    };

    await messageHandler(event, lineClient);

    expect(userBindingService.getBindingByLineId).toHaveBeenCalledWith(lineId);
    expect(mockReplyMessage).toHaveBeenCalledWith(replyToken, {
      type: "text",
      text: "請輸入您當初下單所填寫的 Email 或手機號碼以查詢訂單。",
    });
  });

  it("✅ 輸入 Email 完成綁定後回傳成功訊息與 Rich Menu 切換", async () => {
    userBindingService.getBindingByLineId = jest.fn().mockResolvedValue(null);
    userBindingService.bindUser = jest.fn().mockResolvedValue(true);
    richMenuService.switchRichMenuByUserState = jest
      .fn()
      .mockResolvedValue("richmenu-xxxx");

    const event = {
      type: "message",
      message: { type: "text", text: "test@example.com" },
      source: { userId: lineId },
      replyToken,
    };

    await messageHandler(event, lineClient);

    expect(userBindingService.bindUser).toHaveBeenCalledWith(
      lineId,
      "test@example.com"
    );
    expect(richMenuService.switchRichMenuByUserState).toHaveBeenCalledWith(
      lineClient,
      lineId
    );
    expect(mockReplyMessage).toHaveBeenCalledWith(replyToken, {
      type: "text",
      text: "綁定成功 ✅\n現在您可以輸入「查詢訂單」來查看您的訂單資訊。",
    });
  });

  it("✅ 綁定後輸入「查詢訂單」→ 回傳 Flex Message", async () => {
    const flexMessage = {
      type: "flex",
      altText: "您的訂單查詢結果",
      contents: { type: "carousel", contents: [] },
    };

    userBindingService.getBindingByLineId = jest
      .fn()
      .mockResolvedValue("test@example.com");
    orderService.fetchOrdersAndFormatFlex = jest
      .fn()
      .mockResolvedValue(flexMessage);

    const event = {
      type: "message",
      message: { type: "text", text: "查詢訂單" },
      source: { userId: lineId },
      replyToken,
    };

    await messageHandler(event, lineClient);

    expect(orderService.fetchOrdersAndFormatFlex).toHaveBeenCalledWith({
      contact: "test@example.com",
      type: "email",
    });

    expect(mockReplyMessage).toHaveBeenCalledWith(replyToken, flexMessage);
  });

  it("🟥 查詢失敗時回傳錯誤訊息", async () => {
    userBindingService.getBindingByLineId = jest
      .fn()
      .mockResolvedValue("test@example.com");
    orderService.fetchOrdersAndFormatFlex = jest
      .fn()
      .mockRejectedValue(new Error("Shopify API error"));

    const event = {
      type: "message",
      message: { type: "text", text: "查詢訂單" },
      source: { userId: lineId },
      replyToken,
    };

    await messageHandler(event, lineClient);

    expect(mockReplyMessage).toHaveBeenCalledWith(replyToken, {
      type: "text",
      text: "系統暫時發生錯誤，請稍後再試 🙇‍♂️",
    });
  });
});
