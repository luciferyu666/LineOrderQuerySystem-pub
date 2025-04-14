// backend/services/richMenuService.js

import { linkRichMenuToUser } from "../../lib/line/richMenu.js";

const RICH_MENU_BOUND_ID = process.env.RICH_MENU_BOUND_ID; // 已綁定用戶版
const RICH_MENU_UNBOUND_ID = process.env.RICH_MENU_UNBOUND_ID; // 未綁定用戶版

/**
 * 根據 isBound 參數，切換對應的 Rich Menu
 * @param {Object} lineClient - LINE Bot SDK 的 client 實例
 * @param {string} lineId - 用戶的 LINE ID
 * @param {boolean} isBound - 是否已綁定 (true=已綁定, false=未綁定)
 * @returns {Promise<string>} 被設定的 Rich Menu ID
 */
export async function switchRichMenuByUserState(lineClient, lineId, isBound) {
  try {
    // 根據 isBound 決定要切換哪個 Rich Menu
    const targetRichMenuId = isBound
      ? RICH_MENU_BOUND_ID
      : RICH_MENU_UNBOUND_ID;

    // 實際執行綁定
    await linkRichMenuToUser(lineClient, lineId, targetRichMenuId);

    console.log(`✅ 已為用戶 ${lineId} 套用 Rich Menu: ${targetRichMenuId} `);
    return targetRichMenuId;
  } catch (error) {
    console.error("❌ 切換 Rich Menu 失敗:", error);
    throw error;
  }
}

/**
 * 若仍想保留舊方法：檢查 DB 狀態後再決定綁定哪個 Rich Menu，也可沿用：
 * ---------------------------------------------------------------------
 * import { getUserBinding } from "./userBindingService.js";
 *
 * export async function switchRichMenuByDB(lineClient, lineId) {
 *   try {
 *     const binding = await getUserBinding(lineId);
 *     const isBound = (binding && binding.phone && binding.email);
 *     return switchRichMenuByUserState(lineClient, lineId, isBound);
 *   } catch (error) {
 *     throw error;
 *   }
 * }
 */
