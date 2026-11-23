import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Copy official authorized seal & signature to assets and public folders
const sealSrc = 'C:/Users/MANIMEGALAI/.gemini/antigravity/brain/7f8cf84b-c588-4933-90a4-412508568aab/.user_uploaded/media_1795088488947_c7047164.jpg'
try {
  if (fs.existsSync(sealSrc)) {
    const assetsDest = path.resolve(__dirname, 'src/assets/bsel_authorized_seal_signature.jpg')
    const publicDest = path.resolve(__dirname, 'public/bsel_authorized_seal_signature.jpg')
    fs.copyFileSync(sealSrc, assetsDest)
    fs.copyFileSync(sealSrc, publicDest)
  }
} catch (e) {
  console.warn('[vite.config.js] Could not copy seal signature image:', e)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      
      server: { host: true },
    }
  }
})
