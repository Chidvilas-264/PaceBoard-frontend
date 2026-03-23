import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "fuel-issn-quiz-penetration.trycloudflare.com",
      "coleman-jurisdiction-tricks-album.trycloudflare.com",
      ".trycloudflare.com"
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
