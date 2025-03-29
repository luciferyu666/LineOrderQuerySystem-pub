// backend/services/userBindingService.js

import {
  findBindingByLineId,
  findBindingByContact,
  createBinding,
} from "../models/userBindingModel.js";

/**
 * 根據 LINE ID 檢查是否已綁定聯絡資訊
 * @param {string} lineId - LINE 使用者 ID
 * @returns {string|null} 綁定的聯絡資訊，或 null
 */
export async function getBindingByLineId(lineId) {
  try {
    const result = await findBindingByLineId(lineId);
    return result ? result.contact_info : null;
  } catch (error) {
    console.error("❌ 查詢 LINE 綁定失敗:", error);
    throw error;
  }
}

/**
 * 根據 Email/電話 檢查是否已有綁定記錄
 * @param {string} contact - Email 或電話
 * @returns {string|null} 對應的 LINE ID，或 null
 */
export async function getBindingByContact(contact) {
  try {
    const result = await findBindingByContact(contact);
    return result ? result.line_id : null;
  } catch (error) {
    console.error("❌ 查詢聯絡資訊綁定失敗:", error);
    throw error;
  }
}

/**
 * 將 LINE ID 與聯絡資訊建立綁定關係
 * @param {string} lineId - LINE 使用者 ID
 * @param {string} contact - 使用者輸入的聯絡資訊（Email / 電話）
 * @returns {boolean} 是否綁定成功
 */
export async function bindUser(lineId, contact) {
  try {
    await createBinding(lineId, contact);
    console.log(`✅ 成功綁定 LINE ID: ${lineId} → ${contact}`);
    return true;
  } catch (error) {
    console.error("❌ 建立綁定關係失敗:", error);
    throw error;
  }
}
