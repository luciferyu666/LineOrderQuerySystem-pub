// backend/utils/validateSignature.js

import crypto from "crypto";

/**
 * 驗證 LINE Webhook 請求的簽名是否正確
 * @param {string} body - 請求原始 body（string 格式）
 * @param {string} signature - 請求標頭中的 X-Line-Signature
 * @param {string} channelSecret - LINE CHANNEL_SECRET
 * @returns {boolean} 是否驗證通過
 */
export default function validateSignature(body, signature, channelSecret) {
  if (!body || !signature || !channelSecret) {
    console.warn("⚠️ 無法驗證 LINE 簽名，參數不完整");
    return false;
  }

  // 使用 channelSecret 建立 HMAC-SHA256 雜湊
  const hash = crypto
    .createHmac("SHA256", channelSecret)
    .update(body)
    .digest("base64");

  // 比對加密後的簽名與 LINE Header 傳來的是否相同
  const isValid = hash === signature;

  if (!isValid) {
    console.warn("⚠️ LINE 簽名驗證失敗");
  }

  return isValid;
}
