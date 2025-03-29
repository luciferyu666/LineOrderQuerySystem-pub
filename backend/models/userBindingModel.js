// backend/models/userBindingModel.js

import db from "./db.js";

/**
 * 根據 LINE ID 查詢綁定資料
 * @param {string} lineId - LINE 使用者 ID
 * @returns {Object|null} - 綁定紀錄或 null
 */
export async function findBindingByLineId(lineId) {
  const res = await db.query("SELECT * FROM user_binding WHERE line_id = $1", [
    lineId,
  ]);
  return res.rows[0] || null;
}

/**
 * 根據聯絡資訊（Email 或電話）查詢綁定資料
 * @param {string} contact - Email 或電話
 * @returns {Object|null} - 綁定紀錄或 null
 */
export async function findBindingByContact(contact) {
  const res = await db.query(
    "SELECT * FROM user_binding WHERE contact_info = $1",
    [contact]
  );
  return res.rows[0] || null;
}

/**
 * 建立綁定紀錄（LINE ID 與聯絡資訊）
 * 若 LINE ID 已存在，則不執行任何操作（避免重複綁定）
 * @param {string} lineId - LINE 使用者 ID
 * @param {string} contact - 聯絡資訊（Email 或電話）
 */
export async function createBinding(lineId, contact) {
  await db.query(
    `
    INSERT INTO user_binding (line_id, contact_info)
    VALUES ($1, $2)
    ON CONFLICT (line_id) DO NOTHING
    `,
    [lineId, contact]
  );
}

/**
 * 更新綁定紀錄（若未來允許更換聯絡資訊）
 * @param {string} lineId - LINE 使用者 ID
 * @param {string} newContact - 新聯絡資訊
 */
export async function updateBinding(lineId, newContact) {
  await db.query(
    `
    UPDATE user_binding
    SET contact_info = $1, bound_at = NOW()
    WHERE line_id = $2
    `,
    [newContact, lineId]
  );
}

/**
 * 刪除綁定紀錄（若支援解除綁定）
 * @param {string} lineId - LINE 使用者 ID
 */
export async function deleteBinding(lineId) {
  await db.query("DELETE FROM user_binding WHERE line_id = $1", [lineId]);
}
