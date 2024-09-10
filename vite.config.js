import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      ui: '/src/ui',
      common: '/src/common',
      api: '/src/api',
      navigation: '/src/navigation',
      context: '/src/context'
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  base: './', // This ensures assets are referenced relative to index.html
})
