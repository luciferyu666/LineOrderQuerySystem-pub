// richmenu/upload.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "@line/bot-sdk";
import dotenv from "dotenv";

// 載入 .env 環境變數
dotenv.config();

// __dirname 模擬（ESM 模式使用）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 建立 LINE SDK Client
const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
});

// 設定檔案路徑
const richMenuJsonPath = path.join(__dirname, "./rich_menu.json");
const richMenuImagePath = path.join(__dirname, "./menu_image.jpg");

async function uploadRichMenu() {
  try {
    console.log("📥 讀取 rich_menu.json 和 menu_image.jpg...");

    const richMenuData = JSON.parse(fs.readFileSync(richMenuJsonPath, "utf-8"));
    const imageBuffer = fs.readFileSync(richMenuImagePath);

    console.log("📤 建立 Rich Menu 中...");
    const richMenuId = await client.createRichMenu(richMenuData);

    console.log(`✅ Rich Menu 已建立：${richMenuId}`);
    console.log("🖼️ 上傳圖片至 Rich Menu 中...");
    await client.setRichMenuImage(richMenuId, imageBuffer, "image/jpeg");

    console.log("📌 設定為預設 Rich Menu...");
    await client.setDefaultRichMenu(richMenuId);

    console.log(`🎉 Rich Menu 上傳與綁定完成！RichMenu ID: ${richMenuId}`);
  } catch (error) {
    console.error(
      "❌ Rich Menu 上傳失敗:",
      error.response?.data || error.message
    );
  }
}

// 執行主程式
uploadRichMenu();
