# 📋 Changelog

所有值得記錄的版本變更紀錄都會列在此處。  
本專案遵循 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/) 格式，並使用 [Semantic Versioning](https://semver.org/lang/zh-TW/) 進行版本控管。

---

## [1.0.0] - 2025-03-25

### ✨ 新增

- 首次發佈《LINE 訂單查詢系統 最終版本（更新版）》
- 支援以 Email / 手機號碼查詢 Shopify 訂單
- LINE 使用者可綁定聯絡資訊以加速後續查詢
- 回傳訂單結果以 Flex Message Carousel 呈現
- LINE Rich Menu 整合與綁定狀態切換功能
- 使用 PostgreSQL 儲存使用者綁定資料
- 採用 Node.js + Vercel Serverless 架構
- 加入 CI/CD 自動測試與部署流程（GitHub Actions）
- 撰寫完整 `.env.example`, `vercel.json`, `README.md`
- 整合單元測試（Jest）與整合測試（Webhook 模擬）

---

## [1.0.1] - 2025-03-27

### 🛠 修正

- 修正綁定流程中 Email 格式判斷錯誤
- 調整 `menu_image.jpg` 的 Rich Menu 圖示熱區對齊問題
- 增強 LINE Webhook Signature 驗證錯誤訊息

---

## [1.1.0] - 2025-04-01

### ✨ 新增

- 新增自動根據使用者狀態切換 Rich Menu 的服務層封裝
- 新增 webhookFlow 整合測試（模擬完整綁定與查詢流程）
- 在 Flex Message 增加物流追蹤按鈕（若 fulfillment 含 tracking_url）

### 🛠 修正

- 修正 PostgreSQL 錯誤處理中 async 錯誤未捕捉問題
- 更新部分 Flex Message 欄位樣式與排版

---

## [1.2.0] - 2025-04-08

### 🚧 開發中

- 🧪 整合 7-11 超商物流查詢介面（模組預留）
- 🧩 準備支援多商店 API 整合架構
- 🌐 建立多語系支援 i18n 結構與 JSON 資源
- 📊 導入 Flex Message 使用 A/B 測試設定（即將上線）

---

## [Unreleased]

### 🔮 計劃中

- LINE Account Linking 快速綁定支援
- 客服後台管理介面（前端 + 權限控管）
- 訂單異常自動通知（結合 webhook + LINE Notify）

---

## 📘 附註

- 所有版本將依功能進展、風險變動等依據使用 `MAJOR.MINOR.PATCH` 格式標示
- 更新內容請提交至 `CHANGELOG.md`，並在 PR 描述中同步標註
- 開發者可依版本對應 `.env` 與 `.vercel.json` 的參數更新進行同步修訂

---

📝 Maintained by [開發者 / 團隊名稱] — Last updated: 2025-04-01
