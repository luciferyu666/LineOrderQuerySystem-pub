// lib/line/richMenu.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * 將 Rich Menu 套用至特定使用者
 * @param {object} client - LINE Bot SDK 的 client 實例
 * @param {string} userId - LINE 使用者 ID
 * @param {string} richMenuId - Rich Menu ID
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
 * 從使用者解除綁定 Rich Menu
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
 * 並設定為預設 Rich Menu
 * @param {object} client - LINE Bot SDK 的 client 實例
 * @returns {string} 新建立的 richMenuId
 */
export async function createOrUpdateRichMenu(client) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const jsonPath = path.resolve(
      __dirname,
      "../../../richmenu/rich_menu.json"
    );
    const imagePath = path.resolve(
      __dirname,
      "../../../richmenu/menu_image.jpg"
    );

    const richMenuData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    const imageBuffer = fs.readFileSync(imagePath);

    const richMenuId = await client.createRichMenu(richMenuData);
    await client.setRichMenuImage(richMenuId, imageBuffer, "image/jpeg");
    await client.setDefaultRichMenu(richMenuId);

    console.log(`✅ 成功建立並設定預設 Rich Menu：${richMenuId}`);
    return richMenuId;
  } catch (error) {
    console.error("❌ 建立或上傳 Rich Menu 失敗:", error);
    throw error;
  }
}

/**
 * 刪除 Rich Menu（透過 ID）
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
 * 列出所有現有的 Rich Menu ID（供手動管理）
 * @param {object} client - LINE Bot SDK 的 client 實例
 * @returns {Array} Rich Menu 列表
 */
export async function listRichMenus(client) {
  try {
    const response = await client.getRichMenuList();
    return response;
  } catch (error) {
    console.error("❌ 取得 Rich Menu 清單失敗:", error);
    throw error;
  }
}
