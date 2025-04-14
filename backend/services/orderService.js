// backend/services/orderService.js

import {
  getOrdersByEmail,
  getOrdersByPhone,
  getOrdersByPhoneAndEmail,
} from "../../lib/shopify/orderFetcher.js";
import { generateOrderFlexCarousel } from "../../lib/line/flexTemplates.js";

/**
 * 同時傳入 (phone, email) 查詢訂單、產生 Flex
 * @param {string} phone
 * @param {string} email
 * @returns {Object|null} Flex Message JSON 或 null
 */
export async function fetchOrdersByPhoneEmail(phone, email) {
  try {
    const orders = await getOrdersByPhoneAndEmail(phone, email);
    if (!orders || orders.length === 0) {
      return null; // 查無資料
    }

    return generateOrderFlexCarousel(orders);
  } catch (error) {
    console.error("❌ fetchOrdersByPhoneEmail 失敗:", error);
    throw error;
  }
}

/**
 * 依單一聯絡資訊 (Email/Phone) 查詢訂單並格式化為 Flex
 * @deprecated
 * - 在雙綁定模式下，可視情況移除或保留兼容
 *
 * @param {Object} options - 查詢條件
 * @param {string} options.contact - Email 或電話
 * @param {string} options.type - 'email' or 'phone'
 * @returns {Object|null} Flex Message JSON 或 null
 */
export async function fetchOrdersAndFormatFlex({ contact, type }) {
  try {
    let orders = [];

    // 根據類型查詢 Shopify
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
    return generateOrderFlexCarousel(orders);
  } catch (error) {
    console.error("❌ 訂單查詢與格式化失敗:", error);
    throw error;
  }
}
