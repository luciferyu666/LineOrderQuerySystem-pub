// lib/line/flexTemplates.js

import { formatDateTime } from "../../../backend/utils/dateFormatter.js";

/**
 * 產生單筆訂單的 Flex Bubble 結構
 * @param {object} order - Shopify 訂單資料物件
 * @returns {object} Flex Bubble JSON
 */
function generateOrderBubble(order) {
  return {
    type: "bubble",
    size: "mega",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `訂單編號 #${order.name || order.id}`,
          weight: "bold",
          size: "md",
          color: "#1DB446",
          wrap: true,
        },
        {
          type: "text",
          text: `狀態：${order.financial_status || "未付款"}`,
          size: "sm",
          color: "#555555",
          margin: "md",
        },
      ],
    },
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "金額",
              size: "sm",
              color: "#aaaaaa",
              flex: 2,
            },
            {
              type: "text",
              text: `$${order.total_price || "0.00"}`,
              size: "sm",
              color: "#000000",
              align: "end",
              flex: 3,
            },
          ],
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "下單時間",
              size: "sm",
              color: "#aaaaaa",
              flex: 2,
            },
            {
              type: "text",
              text: formatDateTime(order.created_at),
              size: "sm",
              color: "#000000",
              align: "end",
              flex: 3,
            },
          ],
        },
      ],
    },
    footer: {
      type: "box",
      layout: "horizontal",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "link",
          height: "sm",
          action: {
            type: "uri",
            label: "查看詳情",
            uri: order.order_status_url || "https://example.com",
          },
        },
        {
          type: "button",
          style: "primary",
          color: "#1DB446",
          height: "sm",
          action: {
            type: "uri",
            label: "追蹤物流",
            uri: order.tracking_url || "https://example.com/tracking",
          },
        },
      ],
      flex: 0,
    },
  };
}

/**
 * 將多筆訂單包裝成 Carousel Flex Message
 * @param {Array} orders - 多筆訂單資料
 * @returns {object} Flex Message JSON
 */
export function generateOrderFlexCarousel(orders = []) {
  const bubbles = orders
    .slice(0, 10)
    .map((order) => generateOrderBubble(order));

  return {
    type: "flex",
    altText: "您的訂單查詢結果",
    contents: {
      type: "carousel",
      contents: bubbles,
    },
  };
}
