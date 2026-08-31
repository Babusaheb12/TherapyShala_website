import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(import.meta.dirname, '..'), '');
  const rawTarget = env.VITE_API_BASE_URL || '';
  const targetHost = rawTarget.startsWith('http')
    ? rawTarget.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '')
    : 'https://api.therapyshala.com';

  return {
    envDir: '../',
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: targetHost,
          changeOrigin: true,
          secure: false,
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
              proxyReq.setHeader('Origin', targetHost);
              proxyReq.setHeader('Referer', targetHost);
            });
          },
        },
      },
    },
  };
});
