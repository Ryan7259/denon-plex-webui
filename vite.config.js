import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// by default this plugin generates the prebundled visuals
// use this cmd to see actual minified bundle, npx rollup-plugin-visualizer --sourcemap stats.json
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    },
  },
})