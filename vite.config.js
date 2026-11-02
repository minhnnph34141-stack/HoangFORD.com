import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Cấu hình Vite cho dự án Hoàng Ford Auto sử dụng React.
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    assetsDir: "assets",
  },
});
