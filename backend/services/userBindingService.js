// backend/services/userBindingService.js

import {
  findBindingByLineIdForDual, // 改寫: 同時回傳 phone 與 email 欄位
  createBindingWithPhoneEmail,
} from "../models/userBindingModel.js";
import { getOrdersByPhoneAndEmail } from "../../lib/shopify/orderFetcher.js";

/**
 * 取得使用者綁定紀錄
 * @param {string} lineId - LINE 使用者 ID
 * @returns {object|null} { phone, email } 或 null
 */
export async function getUserBinding(lineId) {
  try {
    const record = await findBindingByLineIdForDual(lineId);
    if (!record) return null;
    // record 內預期 { line_id, phone, email, bound_at, ... }
    return {
      phone: record.phone,
      email: record.email,
    };
  } catch (error) {
    console.error("❌ 查詢 LINE 綁定失敗:", error);
    throw error;
  }
}

/**
 * 以「電話 + Email」雙重綁定使用者身份
 * @param {string} lineId - LINE 使用者 ID
 * @param {string} phone  - 使用者輸入之電話
 * @param {string} email  - 使用者輸入之 Email
 * @returns {boolean} 綁定是否成功（找到符合之 Shopify 訂單才成功）
 */
export async function bindUserWithPhoneEmail(lineId, phone, email) {
  try {
    // 1. 先檢查 Shopify 是否存在同時符合 phone+email 的訂單
    const orders = await getOrdersByPhoneAndEmail(phone, email);
    if (!orders || orders.length === 0) {
      // 若無符合 => return false
      console.log(
        `❌ Shopify 未找到同時符合 phone=${phone} & email=${email} 的訂單`
      );
      return false;
    }

    // 2. 在 DB 建立/更新綁定
    await createBindingWithPhoneEmail(lineId, phone, email);
    console.log(
      `✅ 成功雙綁定 LINE ID: ${lineId} → phone=${phone}, email=${email}`
    );
    return true;
  } catch (error) {
    console.error("❌ 建立(雙重)綁定失敗:", error);
    throw error;
  }
}
