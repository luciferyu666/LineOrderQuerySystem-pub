// lib/line/richMenu.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * 將 Rich Menu 套用至特定使用者
 * @param {object} client - LINE Bot SDK 的 client 實例
 * @param {string} userId - LINE 使用者 ID
 * @param {string} richMenuId - 要連結的 Rich Menu ID
 */
export async function linkRichMenuToUser(client, userId, richMenuId) {
  try {
    await client.linkRichMenuToUser(userId, richMenuId);
    console.log(`✅ 已將 Rich Menu(${richMenuId}) 套用至使用者 ${userId}`);
  } catch (error) {
    console.error("❌ 套用 Rich Menu 失敗:", error);
    throw error;
  }
}

/**
 * 從使用者解除 Rich Menu 綁定
 * @param {object} client - LINE Bot SDK 的 client 實例
 * @param {string} userId - LINE 使用者 ID
 */
export async function unlinkRichMenuFromUser(client, userId) {
  try {
    await client.unlinkRichMenuFromUser(userId);
    console.log(`✅ 已解除使用者 ${userId} 的 Rich Menu 綁定`);
  } catch (error) {
    console.error("❌ 解除 Rich Menu 綁定失敗:", error);
    throw error;
  }
}

/**
 * 建立並上傳 Rich Menu（含 JSON + 圖片）
 * 若需要自動設為預設 Rich Menu，可在結尾調用 setDefaultRichMenu
 * @param {object} client - LINE Bot SDK 的 client 實例
 * @returns {Promise<string>} 建立後的 Rich Menu ID
 */
export async function createOrUpdateRichMenu(client) {
  try {
    // 取得當前檔案位置 (Node.js ESM)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // 讀取 JSON 與背景圖路徑
    const jsonPath = path.resolve(
      __dirname,
      "../../../richmenu/rich_menu.json"
    );
    const imagePath = path.resolve(
      __dirname,
      "../../../richmenu/menu_image.jpg"
    );

    // 讀取 Rich Menu 設定檔與圖片
    const richMenuData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    const imageBuffer = fs.readFileSync(imagePath);

    // 建立 Rich Menu
    const richMenuId = await client.createRichMenu(richMenuData);
    console.log(`✅ createRichMenu: 建立成功，ID=${richMenuId}`);

    // 上傳背景圖
    await client.setRichMenuImage(richMenuId, imageBuffer, "image/jpeg");
    console.log(`✅ setRichMenuImage: 已為 RichMenu(${richMenuId}) 上傳圖片`);

    // (可選) 若要自動設為全體預設：
    // await client.setDefaultRichMenu(richMenuId);
    // console.log(`✅ setDefaultRichMenu: 已設為系統預設 RichMenu(${richMenuId})`);

    return richMenuId;
  } catch (error) {
    console.error("❌ 建立或上傳 Rich Menu 失敗:", error);
    throw error;
  }
}

/**
 * 刪除指定 Rich Menu ID
 * @param {object} client - LINE Bot SDK 的 client 實例
 * @param {string} richMenuId - 要刪除的 Rich Menu ID
 */
export async function deleteRichMenu(client, richMenuId) {
  try {
    await client.deleteRichMenu(richMenuId);
    console.log(`✅ Rich Menu(${richMenuId}) 已刪除`);
  } catch (error) {
    console.error("❌ 刪除 Rich Menu 失敗:", error);
    throw error;
  }
}

/**
 * 列出所有已有的 Rich Menu
 * @param {object} client - LINE Bot SDK 的 client 實例
 * @returns {Promise<Array>} Rich Menu 列表
 */
export async function listRichMenus(client) {
  try {
    const menuList = await client.getRichMenuList();
    return menuList;
  } catch (error) {
    console.error("❌ 取得 Rich Menu 清單失敗:", error);
    throw error;
  }
}
