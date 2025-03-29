// tests/unit/orderService.test.js

import { fetchOrdersAndFormatFlex } from "../../../backend/services/orderService.js";
import * as orderFetcher from "../../../lib/shopify/orderFetcher.js";
import * as flexTemplates from "../../../lib/line/flexTemplates.js";

jest.mock("../../../lib/shopify/orderFetcher.js");
jest.mock("../../../lib/line/flexTemplates.js");

describe("🧪 orderService - fetchOrdersAndFormatFlex()", () => {
  const mockOrders = [
    {
      id: 12345,
      name: "#1001",
      email: "test@example.com",
      phone: "0912345678",
      total_price: "1200.00",
      created_at: "2025-03-25T10:00:00Z",
      financial_status: "paid",
      fulfillment_status: "fulfilled",
      order_status_url: "https://shopify.com/orders/123",
      tracking_url: "https://tracking.com/track/abc",
    },
  ];

  const mockFlexMessage = {
    type: "flex",
    altText: "您的訂單查詢結果",
    contents: {
      type: "carousel",
      contents: [], // 簡化測試
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ 根據 email 查詢成功，回傳 Flex Message", async () => {
    orderFetcher.getOrdersByEmail.mockResolvedValue(mockOrders);
    flexTemplates.generateOrderFlexCarousel.mockReturnValue(mockFlexMessage);

    const result = await fetchOrdersAndFormatFlex({
      contact: "test@example.com",
      type: "email",
    });

    expect(orderFetcher.getOrdersByEmail).toHaveBeenCalledWith(
      "test@example.com"
    );
    expect(flexTemplates.generateOrderFlexCarousel).toHaveBeenCalledWith(
      mockOrders
    );
    expect(result).toEqual(mockFlexMessage);
  });

  it("✅ 根據電話查詢成功，回傳 Flex Message", async () => {
    orderFetcher.getOrdersByPhone.mockResolvedValue(mockOrders);
    flexTemplates.generateOrderFlexCarousel.mockReturnValue(mockFlexMessage);

    const result = await fetchOrdersAndFormatFlex({
      contact: "0912345678",
      type: "phone",
    });

    expect(orderFetcher.getOrdersByPhone).toHaveBeenCalledWith("0912345678");
    expect(flexTemplates.generateOrderFlexCarousel).toHaveBeenCalledWith(
      mockOrders
    );
    expect(result).toEqual(mockFlexMessage);
  });

  it("🟡 查無訂單時回傳 null", async () => {
    orderFetcher.getOrdersByEmail.mockResolvedValue([]);

    const result = await fetchOrdersAndFormatFlex({
      contact: "no-order@example.com",
      type: "email",
    });

    expect(result).toBeNull();
  });

  it("❌ 傳入無效類型應拋出錯誤", async () => {
    await expect(
      fetchOrdersAndFormatFlex({
        contact: "invalid",
        type: "facebook",
      })
    ).rejects.toThrow("查詢類型錯誤，應為 email 或 phone");
  });

  it("❌ API 呼叫錯誤應拋出例外", async () => {
    orderFetcher.getOrdersByEmail.mockRejectedValue(
      new Error("Shopify API error")
    );

    await expect(
      fetchOrdersAndFormatFlex({
        contact: "error@example.com",
        type: "email",
      })
    ).rejects.toThrow("Shopify API error");
  });
});
