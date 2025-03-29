// lib/shopify/graphqlClient.js

import axios from "axios";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN; // 例如：yourstore.myshopify.com
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN; // Admin API Token

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ACCESS_TOKEN) {
  throw new Error("❌ 缺少 Shopify API 相關環境變數");
}

// 建立 GraphQL Endpoint
const GRAPHQL_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2023-01/graphql.json`;

/**
 * 發送 GraphQL 請求至 Shopify Admin API
 * @param {string} query - GraphQL 查詢語句
 * @param {object} variables - GraphQL 變數物件（可選）
 * @returns {object} Shopify 回傳的資料（data 或 errors）
 */
export async function shopifyGraphQLRequest(query, variables = {}) {
  try {
    const response = await axios.post(
      GRAPHQL_ENDPOINT,
      {
        query,
        variables,
      },
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.errors) {
      console.error("❌ Shopify GraphQL 回傳錯誤:", response.data.errors);
      throw new Error("Shopify GraphQL 查詢失敗");
    }

    return response.data.data;
  } catch (error) {
    console.error(
      "❌ Shopify GraphQL 請求失敗:",
      error.response?.data || error.message
    );
    throw error;
  }
}
