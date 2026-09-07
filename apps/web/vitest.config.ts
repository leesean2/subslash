import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["__tests__/unit/**/*.test.ts", "__tests__/integration/**/*.test.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["lib/**/*.ts", "app/api/**/*.ts"],
    },
  },
  resolve: {
    alias: {
      "@lib": path.resolve(__dirname, "./lib"),
      "@": path.resolve(__dirname, "./app"),
    },
  },
});
