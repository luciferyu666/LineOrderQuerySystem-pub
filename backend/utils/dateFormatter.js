// backend/utils/dateFormatter.js

/**
 * 將 ISO 日期字串轉換為 yyyy-mm-dd 格式
 * @param {string} isoDate - 來自 Shopify 或 DB 的 ISO 時間字串
 * @returns {string} 格式化日期字串，例如 "2025-03-27"
 */
export function formatDate(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0]; // yyyy-mm-dd
}

/**
 * 將 ISO 時間字串格式化為 yyyy/mm/dd hh:mm（台灣常見格式）
 * @param {string} isoDate - ISO 格式的時間字串
 * @returns {string} 格式化字串，例如 "2025/03/27 14:30"
 */
export function formatDateTime(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
}

/**
 * 將日期轉換為指定語系的格式（簡易國際化）
 * @param {Date|string} dateInput - Date 物件或 ISO 字串
 * @param {string} locale - 語系（例如 'en-US', 'zh-TW'）
 * @param {Object} options - Intl.DateTimeFormat 格式選項
 * @returns {string} 本地化日期字串
 */
export function formatLocalized(dateInput, locale = "zh-TW", options = {}) {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...options,
  });
  return formatter.format(date);
}
