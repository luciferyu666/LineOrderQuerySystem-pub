// backend/vitest.config.js
import { defineConfig } from "vitest/config";
import path from "path";
import dotenv from "dotenv";

// ✅ 明確指定讀取 .env.test（這一行非常關鍵！）
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      reporter: ["text", "html"],
    },
  },
  resolve: {
    alias: {
      "@services": path.resolve(__dirname, "services"),
      "@models": path.resolve(__dirname, "models"),
      "@utils": path.resolve(__dirname, "utils"),
      "@line": path.resolve(__dirname, "../lib/line"),
      "@shopify": path.resolve(__dirname, "../lib/shopify"),
    },
  },
});
