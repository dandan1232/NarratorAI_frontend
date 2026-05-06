import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// 让 Vite 代理绕过系统 HTTP 代理
process.env.NO_PROXY = process.env.NO_PROXY
  ? `${process.env.NO_PROXY},api.tangdouz.com,api.xiaomimimo.com`
  : 'api.tangdouz.com,api.xiaomimimo.com';

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/mimo': {
          target: 'https://api.xiaomimimo.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mimo/, '/anthropic'),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              const apiKey = env.VITE_MIMO_AUTH_TOKEN || process.env.VITE_MIMO_AUTH_TOKEN || '';
              proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
            });
          },
        },
        '/sticker': {
          target: 'https://api.tangdouz.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/sticker/, ''),
        },
      },
    },
  }
})
