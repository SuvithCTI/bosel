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

// Student Photo Dev Cache Plugin for cross-device QR scanning (in-memory + node_modules cache)
function studentPhotoCachePlugin() {
  const memoryCache = new Map()
  const cacheDir = path.resolve(__dirname, 'node_modules/.cache')
  const cacheFile = path.resolve(cacheDir, 'bsel_student_photos.json')

  // Load existing cache from node_modules if present
  try {
    if (fs.existsSync(cacheFile)) {
      const saved = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'))
      Object.entries(saved).forEach(([k, v]) => memoryCache.set(k, v))
    }
  } catch {}

  const persistCache = () => {
    try {
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }
      const obj = Object.fromEntries(memoryCache.entries())
      fs.writeFileSync(cacheFile, JSON.stringify(obj))
    } catch {}
  }

  return {
    name: 'student-photo-cache-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/photo-cache')) {
          const urlObj = new URL(req.url, 'http://localhost')
          if (req.method === 'GET') {
            const key = urlObj.searchParams.get('key')
            if (key) {
              const cleanKey = key.trim()
              const lowerKey = cleanKey.toLowerCase()
              const digits = cleanKey.replace(/\D/g, '')
              const photo = memoryCache.get(cleanKey) ||
                            memoryCache.get(lowerKey) ||
                            (digits ? memoryCache.get(digits) : null) ||
                            null
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, photo }))
              return
            }
            const allObj = Object.fromEntries(memoryCache.entries())
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, cache: allObj }))
            return
          }
          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body)
                if (parsed.photo) {
                  if (parsed.key) memoryCache.set(parsed.key, parsed.photo)
                  if (parsed.reg) {
                    memoryCache.set(parsed.reg, parsed.photo)
                    memoryCache.set(parsed.reg.toLowerCase(), parsed.photo)
                    const digits = parsed.reg.replace(/\D/g, '')
                    if (digits) memoryCache.set(digits, parsed.photo)
                  }
                  if (parsed.name) {
                    memoryCache.set(parsed.name.toLowerCase(), parsed.photo)
                  }
                  persistCache()
                }
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true }))
              } catch (err) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
              }
            })
            return
          }
        }
        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    studentPhotoCachePlugin(),
  ],
  server: {
    host: true,
    watch: {
      ignored: ['**/node_modules/**', '**/student_photos_cache.json', '**/*.json']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
    }
  }
})
