// backend/jest.config.js

/** @type {import('jest').Config} */
export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"], // ✅ 正確格式
  transform: {},
  setupFiles: ["dotenv/config"],
};
