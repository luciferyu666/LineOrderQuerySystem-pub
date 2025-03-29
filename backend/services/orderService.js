// backend/services/orderService.js

import {
  getOrdersByEmail,
  getOrdersByPhone,
} from "../../lib/shopify/orderFetcher.js";
import { generateOrderFlexCarousel } from "../../lib/line/flexTemplates.js";

/**
 * 根據聯絡方式查詢訂單並格式化為 Flex Message
 * @param {Object} options - 查詢條件
 * @param {string} options.contact - 使用者輸入的 Email 或電話
 * @param {string} options.type - 查詢類型: 'email' 或 'phone'
 * @returns {Object} - Flex Message JSON 或 null
 */
export async function fetchOrdersAndFormatFlex({ contact, type }) {
  let orders = [];

  try {
    // 根據類型查詢 Shopify 訂單
    if (type === "email") {
      orders = await getOrdersByEmail(contact);
    } else if (type === "phone") {
      orders = await getOrdersByPhone(contact);
    } else {
      throw new Error("查詢類型錯誤，應為 email 或 phone");
    }

    if (!orders || orders.length === 0) {
      return null;
    }

    // 轉換為 Flex Message 結構
    const flexMessage = generateOrderFlexCarousel(orders);

    return flexMessage;
  } catch (error) {
    console.error("❌ 訂單查詢與格式化失敗:", error);
    throw error;
  }
}
