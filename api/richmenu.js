// api/richmenu.js

import { Client } from "@line/bot-sdk";
import {
  setRichMenuForUser,
  createOrUpdateRichMenu,
} from "../lib/line/richMenu.js";

const lineClient = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
});

// 支援 GET（查詢）、POST（切換）、PUT（更新）等基本操作
export default async function handler(req, res) {
  try {
    const { method } = req;

    // POST：根據使用者切換 Rich Menu
    if (method === "POST") {
      const { lineId, richMenuId } = req.body;

      if (!lineId || !richMenuId) {
        return res
          .status(400)
          .json({ error: "lineId 與 richMenuId 為必填欄位" });
      }

      await setRichMenuForUser(lineClient, lineId, richMenuId);
      return res
        .status(200)
        .json({ message: `Rich Menu 已成功套用至 ${lineId}` });
    }

    // PUT：上傳並更新 Rich Menu（使用預設 JSON 與圖片）
    if (method === "PUT") {
      const result = await createOrUpdateRichMenu(lineClient);
      return res
        .status(200)
        .json({ message: "Rich Menu 已更新", data: result });
    }

    // 其他方法不允許
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("❌ Rich Menu API 錯誤:", error);
    return res.status(500).json({ error: "伺服器錯誤" });
  }
}
