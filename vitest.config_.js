// vitest.config.js
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["dotenv/config"],
    alias: {
      "@services": path.resolve(__dirname, "backend/services"),
      "@models": path.resolve(__dirname, "backend/models"),
      "@utils": path.resolve(__dirname, "backend/utils"),
      "@line": path.resolve(__dirname, "lib/line"),
      "@shopify": path.resolve(__dirname, "lib/shopify"),
    },
    coverage: {
      reporter: ["text", "html"], // 可改成 ['text', 'json', 'html'] 等
      reportsDirectory: "./coverage",
    },
  },
});
