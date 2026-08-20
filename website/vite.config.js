import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://lucrative-flaky-undermine.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
            proxyReq.setHeader('Origin', 'https://lucrative-flaky-undermine.ngrok-free.dev');
            proxyReq.setHeader('Referer', 'https://lucrative-flaky-undermine.ngrok-free.dev');
          });
        },
      },
    },
  },
})
