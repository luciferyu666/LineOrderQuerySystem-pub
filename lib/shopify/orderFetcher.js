// lib/shopify/orderFetcher.js

import { shopifyGet } from "./restClient.js";

/**
 * 將原始 Shopify 訂單物件轉換為標準格式（供 Flex 使用）
 * @param {object} rawOrder
 * @returns {object} 整理後的訂單物件
 */
function normalizeOrder(rawOrder) {
  return {
    id: rawOrder.id,
    name: rawOrder.name,
    email: rawOrder.email,
    phone: rawOrder.phone,
    total_price: rawOrder.total_price,
    created_at: rawOrder.created_at,
    financial_status: rawOrder.financial_status,
    fulfillment_status: rawOrder.fulfillment_status,
    order_status_url: rawOrder.order_status_url,
    tracking_url: extractTrackingUrl(rawOrder),
  };
}

/**
 * 嘗試從 fulfillment 層提取物流追蹤網址（若有）
 * @param {object} order
 * @returns {string|null}
 */
function extractTrackingUrl(order) {
  if (
    order.fulfillments &&
    order.fulfillments.length > 0 &&
    order.fulfillments[0].tracking_url
  ) {
    return order.fulfillments[0].tracking_url;
  }
  return null;
}

/**
 * 透過 Email 查詢 Shopify 訂單
 * @param {string} email
 * @returns {Array<object>} 標準化後的訂單陣列
 */
export async function getOrdersByEmail(email) {
  try {
    const res = await shopifyGet("/orders.json", {
      email,
      status: "any", // 包含所有狀態（open, closed, cancelled）
      limit: 10,
      order: "created_at desc",
    });

    const orders = res.orders || [];
    return orders.map(normalizeOrder);
  } catch (error) {
    console.error("❌ 根據 Email 查詢訂單失敗:", error.message);
    return [];
  }
}

/**
 * 透過電話查詢 Shopify 訂單（需遍歷查詢結果後比對）
 * @param {string} phone
 * @returns {Array<object>} 標準化後的訂單陣列
 */
export async function getOrdersByPhone(phone) {
  try {
    // 無法直接以 phone filter，改查最近訂單後自行比對
    const res = await shopifyGet("/orders.json", {
      status: "any",
      limit: 50, // 可調整查詢量
      order: "created_at desc",
    });

    const matched = (res.orders || []).filter(
      (order) => order.phone && order.phone.includes(phone)
    );

    return matched.map(normalizeOrder);
  } catch (error) {
    console.error("❌ 根據電話查詢訂單失敗:", error.message);
    return [];
  }
}
