import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// 번들 분석 도구 (npm run build:analyze로 사용)
// npm install -D rollup-plugin-visualizer 필요
const isAnalyze = process.env.ANALYZE === "true";

export default defineConfig({
  plugins: [
    react(),
    // 번들 분석 플러그인 (조건부 로드)
    isAnalyze && {
      name: "bundle-analyzer",
      async buildStart() {
        const { visualizer } = await import("rollup-plugin-visualizer");
        return visualizer({
          filename: "stats.html",
          open: true,
          gzipSize: true,
          brotliSize: true,
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@types": path.resolve(__dirname, "./src/types"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/e2e/**", // E2E 테스트는 Playwright로 실행
    ],
  },
  build: {
    // 번들 크기 경고 임계값
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // 청크 분할 전략
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js"],
        },
      },
    },
  },
});
