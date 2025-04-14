// backend/models/userBindingModel.js

import db from "./db.js";

/**
 * 以 line_id 查詢使用者綁定
 * 預期表結構: user_binding(line_id, phone, email, bound_at)
 * @param {string} lineId
 * @returns {object|null} { line_id, phone, email, bound_at }
 */
export async function findBindingByLineIdForDual(lineId) {
  const res = await db.query(
    `
    SELECT line_id, phone, email, bound_at
    FROM user_binding
    WHERE line_id = $1
  `,
    [lineId]
  );

  return res.rows[0] || null;
}

/**
 * 建立或更新 LINE 用戶綁定
 * - 若 line_id 已存在，就更新 phone, email, bound_at
 * - 若 line_id 不存在，就插入新紀錄
 *
 * @param {string} lineId
 * @param {string} phone
 * @param {string} email
 */
export async function createBindingWithPhoneEmail(lineId, phone, email) {
  // ON CONFLICT (line_id) DO UPDATE
  await db.query(
    `
    INSERT INTO user_binding (line_id, phone, email, bound_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (line_id)
    DO UPDATE SET
      phone = EXCLUDED.phone,
      email = EXCLUDED.email,
      bound_at = NOW()
  `,
    [lineId, phone, email]
  );
}

/**
 * 針對 phone+email 查詢是否已有其他人使用 (若需要可擴充使用)
 * @param {string} phone
 * @param {string} email
 * @returns {object|null} { line_id, phone, email, bound_at }
 */
export async function findBindingByPhoneEmail(phone, email) {
  const res = await db.query(
    `
    SELECT line_id, phone, email, bound_at
    FROM user_binding
    WHERE phone = $1 AND email = $2
  `,
    [phone, email]
  );

  return res.rows[0] || null;
}

/**
 * 若仍需單一聯絡資訊存取，可保留或刪除以下舊函式 (示範)
 * ------------------------------------------------------------------
 */

/**
 * 單純以 lineId 取得紀錄 (舊版, 但只能用於單一欄位 scenario)
 * @param {string} lineId
 * @returns {object|null} { line_id, contact_info, bound_at } or null
 */
export async function findBindingByLineId(lineId) {
  const res = await db.query(
    `
    SELECT line_id, contact_info, bound_at
    FROM user_binding
    WHERE line_id = $1
  `,
    [lineId]
  );
  return res.rows[0] || null;
}

/**
 * 若保留舊版 createBinding (單一欄位) 用:
 */
export async function createBinding(lineId, contact) {
  await db.query(
    `
    INSERT INTO user_binding(line_id, contact_info)
    VALUES ($1, $2)
    ON CONFLICT(line_id) DO NOTHING
  `,
    [lineId, contact]
  );
}

/**
 * 其餘 updateBinding, deleteBinding... 可視需求保留或調整
 */
