import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    proxy: {
      '/veena-api': {
        target: 'https://extapi.veenaworld.com/partner/staging/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/veena-api/, ''),
        headers: {
          'x-api-key': 'l3h1EvJdjEatKTDxBBDjq99jhTat6edl731UlTia',
          'X-Partner-Id': 'mpfWKNkb4grRBbc5w53K',
        }
      }
    }
  }
})
