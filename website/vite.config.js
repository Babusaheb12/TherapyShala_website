import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const localEnv = loadEnv(mode, process.cwd(), "");
  const parentEnv = loadEnv(mode, path.resolve(import.meta.dirname, ".."), "");
  const rawTarget =
    localEnv.VITE_API_BASE_URL ||
    parentEnv.VITE_API_BASE_URL ||
    "https://api.therapyshala.com/api/v1";
  const targetHost = rawTarget.startsWith("http")
    ? rawTarget.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "")
    : "https://api.therapyshala.com";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: targetHost,
          changeOrigin: true,
          secure: false,
          timeout: 60000,
          proxyTimeout: 60000,
          headers: {
            Origin: "http://localhost:5173",
            "ngrok-skip-browser-warning": "true",
          },
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("Origin", "http://localhost:5173");
              proxyReq.setHeader("ngrok-skip-browser-warning", "true");
            });
            proxy.on("error", (err, req, res) => {
              console.warn("[Vite Proxy Warning]:", err?.message);
            });
          },
        },
        "/media": {
          target: targetHost,
          changeOrigin: true,
          secure: false,
          timeout: 60000,
          proxyTimeout: 60000,
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("ngrok-skip-browser-warning", "true");
            });
          },
        },
      },
    },
  };
});
