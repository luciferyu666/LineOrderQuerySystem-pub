📄 README.md

````
# 📦 LINE 訂單查詢系統（LINE Order Query System）

一個可供用戶在 LINE 聊天中查詢 Shopify 訂單狀態的聊天機器人系統。
整合 LINE Messaging API、Shopify Admin API、PostgreSQL、Vercel Serverless 架構，並使用 Flex Message 呈現查詢結果。

本專案已納入模組化設計、自動部署、測試覆蓋，並支援後續擴充 7-11 物流、Rich Menu 切換與多商店支援。

---

## 🧠 專案架構

LINE-Order-Query-System/
├── api/                            # ✅ Serverless Functions (Controller 層)
│   ├── index.js                    # LINE Webhook 接收與分派
│   ├── richmenu.js                # Rich Menu 切換 API
│   └── healthcheck.js             # 健康檢查 API
│
├── backend/                        # ✅ 後端業務邏輯與資料處理
│   ├── services/                   # 業務邏輯封裝（Service 層）
│   │   ├── orderService.js
│   │   ├── userBindingService.js
│   │   └── richMenuService.js
│   ├── models/                     # PostgreSQL 資料表操作（Model 層）
│   │   ├── db.js
│   │   └── userBindingModel.js
│   ├── utils/                      # 工具函式模組
│   │   ├── dateFormatter.js
│   │   ├── stringHelper.js
│   │   └── validateSignature.js
│   └── package.json
│
├── lib/                            # ✅ 外部 API 封裝模組（抽象化 API 呼叫）
│   ├── line/
│   │   ├── messageHandler.js       # 處理 LINE webhook 的事件
│   │   ├── flexTemplates.js        # Flex Message 模板組件
│   │   └── richMenu.js             # LINE Rich Menu API 封裝
│   ├── shopify/
│   │   ├── graphqlClient.js        # Shopify GraphQL API 用戶端
│   │   ├── restClient.js           # Shopify REST API 呼叫模組
│   │   └── orderFetcher.js         # 訂單查詢邏輯封裝
│   └── logger.js                   # 共用日誌工具
│
├── richmenu/                       # ✅ Rich Menu 設定與圖片
│   ├── rich_menu.json              # Rich Menu JSON 格式定義
│   ├── menu_image.jpg              # Rich Menu 背景圖（2500x843）
│   └── upload.js                   # 自動上傳 Rich Menu 腳本
│
├── tests/                          # ✅ 測試（Jest）
│   ├── unit/
│   │   ├── orderService.test.js
│   │   └── userBindingService.test.js
│   ├── integration/
│   │   └── webhookFlow.test.js
│   └── __mocks__/                  # 模擬資料（Mock Data）
│
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions 自動測試與部署
│
├── .env.example                    # ✅ 環境變數設定範本
├── vercel.json                     # ✅ Vercel 路由設定
├── README.md                       # ✅ 專案說明文件
├── CHANGELOG.md                    # ✅ 更新紀錄
└── package.json                    # 專案依賴與指令設定


---

## 🚀 功能總覽

- ✅ LINE 使用者可查詢訂單狀態
- ✅ 綁定 Email/手機，自動識別身份
- ✅ 使用 Flex Message 呈現多筆訂單
- ✅ 自動切換 Rich Menu（已綁定 / 未綁定）
- ✅ Vercel Serverless 架構部署
- ✅ 單元 + 整合測試（Jest）
- ✅ 可擴充 7-11 超商物流查詢

---

## ⚙️ 安裝與啟動方式

### 1. Clone 專案
```bash
git clone https://github.com/luciferyu666/LineOrderQuerySystem.git
cd LineOrderQuerySystem

2. 安裝依賴
npm install

3. 建立環境變數
cp .env.example .env

請填入 .env 中的 Shopify、LINE、DB 資訊。
4. 啟動本地開發（需安裝 vercel CLI）
vercel dev


🌐 Webhook 設定（LINE 後台）
登入 LINE Developers
建立 Messaging API Channel
啟用 Webhook，設定網址為：
https://your-project-name.vercel.app/api/webhook

儲存並「驗證」，即可收到訊息事件

🛠️ Rich Menu 上傳
node richmenu/upload.js

會自動讀取 richmenu/rich_menu.json + menu_image.jpg
成功後自動設定為預設 Rich Menu

🧪 測試流程
執行所有測試
npm test

產生測試覆蓋率報告
npx jest --coverage

執行單元測試
npm run test:unit

執行整合測試（模擬 webhook）
npm run test:integration


🧰 工具與技術棧
技術項目
說明
Node.js / Vercel
Serverless 架構主體
@line/bot-sdk
LINE Messaging API 封裝
Shopify REST / GraphQL API
查詢訂單資料
PostgreSQL
使用者綁定資料儲存
Jest
測試框架
GitHub Actions
CI/CD 自動化
Flex Message
美觀的訂單訊息 UI
ngrok
本地 webhook 測試工具


📂 環境變數說明（.env）
名稱
說明
LINE_CHANNEL_ACCESS_TOKEN
LINE Bot 存取憑證
LINE_CHANNEL_SECRET
用於 webhook 驗證
SHOPIFY_STORE_DOMAIN
Shopify 商店網域
SHOPIFY_ACCESS_TOKEN
Admin API 權杖
DB_URL
PostgreSQL 連線字串
RICH_MENU_BOUND_ID
綁定用戶 Rich Menu ID
RICH_MENU_UNBOUND_ID
未綁定用戶 Rich Menu ID


🔒 安全性與部署建議
.env 應加入 .gitignore，避免敏感資訊外洩
資料庫建議使用 Supabase、RDS、Neon 等雲端服務
可加上 IP 白名單與簽名驗證加強 webhook 安全
Vercel 可配置 preview/staging/production 多環境

🧠 未來擴充方向
🔗 LINE Account Linking 快速綁定機制
🌏 多語系 / 多商店支援（i18n + multi-tenant）
📦 整合物流查詢（7-11, 黑貓, 宅配通）
📊 管理後台（客服查詢訂單紀錄）
🔍 管理訂單搜尋、留言查詢等功能

🙌 貢獻方式
歡迎提交 Pull Request，請遵守以下規範：
每個功能請建立獨立 branch
PR 描述請清楚標示功能與影響範圍
新功能請附上測試與說明
提交前請執行 npm test

📞 聯絡與支援
如需技術支援或有整合需求，請聯絡開發者或提交 Issue。

📝 授權 License
本專案採用 MIT License，自由使用、修改與再發佈。

© 2025 LINE 訂單查詢系統 — Powered by Node.js, Vercel, and Shopify

---

## ✅ 建議補充內容（選用）

| 類型 | 說明 |
|------|------|
| `docs/` 資料夾 | 可加入 API 文件、自動化流程說明等 |
| `screenshots/` | 加入操作流程圖或 Flex Message 示意圖 |
| `README.zh-TW.md` / `README.en.md` | 支援中英文版本說明文件 |

---
````
