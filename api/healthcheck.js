// api/healthcheck.js

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      status: "ok",
      message: "LINE 訂單查詢系統已啟動",
      timestamp: new Date().toISOString(),
    });
  } else {
    return res.status(405).json({
      status: "error",
      message: "不支援的請求方法",
    });
  }
}
