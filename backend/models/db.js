// backend/models/db.js

import pg from "pg";

const { Pool } = pg;

// 讀取環境變數
const connectionString = process.env.DB_URL;

if (!connectionString) {
  throw new Error("❌ 未設定資料庫連線字串（DB_URL）");
}

// 建立連線池（適用於 Serverless 或長連線）
const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// 測試資料庫連線（僅啟動階段執行一次）
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log(`✅ PostgreSQL 已連線成功（目前時間：${res.rows[0].now}）`);
  } catch (err) {
    console.error("❌ 無法連線至 PostgreSQL：", err);
  }
})();

/**
 * 匯出 query 方法供其他模組使用
 */
export default {
  query: (text, params) => pool.query(text, params),
};
