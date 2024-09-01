import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  build: {
    outDir: 'dist'
  },
  server: {
    // set http://localhost:5173 for connecting with api
    host: 'localhost',
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://eleganceparadisbackend.azurewebsites.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

