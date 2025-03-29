// api/index.js

import { middleware, Client } from "@line/bot-sdk";
import validateSignature from "../backend/utils/validateSignature.js";
import messageHandler from "../lib/line/messageHandler.js";

const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// 建立 LINE Bot 用戶端
const lineClient = new Client(lineConfig);

// 處理 POST 請求（LINE Webhook 事件）
export default async function handler(req, res) {
  // 只允許 POST 方法
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // 取得原始請求內容與簽名
  const signature = req.headers["x-line-signature"];
  const body = req.body;

  // 驗證 LINE 簽名，防止偽造請求
  const valid = validateSignature(
    JSON.stringify(body),
    signature,
    lineConfig.channelSecret
  );
  if (!valid) {
    return res.status(403).send("Invalid signature");
  }

  try {
    // 處理所有事件（可能包含多個）
    const events = body.events;

    // 非同步處理所有事件
    await Promise.all(
      events.map(async (event) => {
        await messageHandler(event, lineClient);
      })
    );

    return res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Webhook 處理錯誤:", error);
    return res.status(500).send("Internal Server Error");
  }
}
