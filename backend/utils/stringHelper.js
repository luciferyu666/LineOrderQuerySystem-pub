// backend/utils/stringHelper.js

/**
 * 清除輸入字串的前後空白與不可見字元
 * @param {string} input - 使用者輸入
 * @returns {string} 清理後的字串
 */
export function cleanString(input) {
  if (!input || typeof input !== "string") return "";
  return input.trim().replace(/\u200B/g, ""); // 清除零寬字元
}

/**
 * 將字串標準化為小寫並移除空白（適用於 email 比對）
 * @param {string} str
 * @returns {string}
 */
export function normalizeEmail(str) {
  return cleanString(str).toLowerCase().replace(/\s+/g, "");
}

/**
 * 檢查是否為有效的 Email 格式
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(cleanString(email));
}

/**
 * 檢查是否為有效的台灣手機號碼格式（09 開頭，10 碼）
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  const cleaned = cleanString(phone);
  return /^09\d{8}$/.test(cleaned);
}

/**
 * 判斷使用者輸入是否包含某關鍵字（不區分大小寫）
 * @param {string} input
 * @param {string} keyword
 * @returns {boolean}
 */
export function containsKeyword(input, keyword) {
  if (!input || !keyword) return false;
  return input.toLowerCase().includes(keyword.toLowerCase());
}
