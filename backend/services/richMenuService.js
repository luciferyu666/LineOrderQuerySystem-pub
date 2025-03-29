// backend/services/richMenuService.js

import { getBindingByLineId } from "./userBindingService.js";
import { linkRichMenuToUser } from "../../lib/line/richMenu.js";

const RICH_MENU_BOUND_ID = process.env.RICH_MENU_BOUND_ID; // 已綁定用戶專用
const RICH_MENU_UNBOUND_ID = process.env.RICH_MENU_UNBOUND_ID; // 未綁定用戶專用

/**
 * 根據使用者綁定狀態，切換適當的 Rich Menu
 * @param {Object} lineClient - LINE Bot SDK 的 client 實例
 * @param {string} lineId - 使用者的 LINE ID
 * @returns {string} 被設定的 Rich Menu ID
 */
export async function switchRichMenuByUserState(lineClient, lineId) {
  try {
    // 查詢該用戶是否已有綁定
    const contact = await getBindingByLineId(lineId);

    // 根據綁定狀態決定要切換的 Rich Menu ID
    const targetRichMenuId = contact
      ? RICH_MENU_BOUND_ID
      : RICH_MENU_UNBOUND_ID;

    // 執行綁定
    await linkRichMenuToUser(lineClient, lineId, targetRichMenuId);

    console.log(
      `✅ 成功套用 Rich Menu: ${targetRichMenuId} 給使用者: ${lineId}`
    );
    return targetRichMenuId;
  } catch (error) {
    console.error("❌ 切換 Rich Menu 失敗:", error);
    throw error;
  }
}
