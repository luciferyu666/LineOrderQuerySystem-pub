// lib/shopify/restClient.js

import axios from "axios";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN; // yourstore.myshopify.com
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN; // Admin API Token

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ACCESS_TOKEN) {
  throw new Error(
    "❌ 請設定 Shopify API 環境變數（SHOPIFY_STORE_DOMAIN / ACCESS_TOKEN）"
  );
}

const API_VERSION = "2023-01";
const BASE_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}`;

/**
 * 執行 GET 請求至 Shopify Admin REST API
 * @param {string} endpoint - API 路徑，例如 "/orders.json"
 * @param {object} params - 查詢參數（可選）
 * @returns {object} 回傳資料
 */
export async function shopifyGet(endpoint, params = {}) {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error(
      `❌ Shopify REST API GET 錯誤: ${endpoint}`,
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * 執行 POST 請求至 Shopify Admin REST API
 * @param {string} endpoint - API 路徑，例如 "/products.json"
 * @param {object} data - 傳送的資料物件
 * @returns {object} 回傳資料
 */
export async function shopifyPost(endpoint, data = {}) {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      `❌ Shopify REST API POST 錯誤: ${endpoint}`,
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * 執行 DELETE 請求至 Shopify Admin REST API
 * @param {string} endpoint - API 路徑，例如 "/products/123456789.json"
 * @returns {boolean} 是否成功
 */
export async function shopifyDelete(endpoint) {
  try {
    await axios.delete(`${BASE_URL}${endpoint}`, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    return true;
  } catch (error) {
    console.error(
      `❌ Shopify REST API DELETE 錯誤: ${endpoint}`,
      error.response?.data || error.message
    );
    throw error;
  }
}
