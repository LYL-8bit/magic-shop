import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  server: {
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 100000,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  }
})
