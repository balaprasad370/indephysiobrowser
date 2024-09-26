import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  publicDir: "build",
  plugins: [Inspect()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
