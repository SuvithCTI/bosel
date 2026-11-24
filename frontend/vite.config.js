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

// Student Photo Dev Cache Plugin for cross-device QR scanning
function studentPhotoCachePlugin() {
  const cacheFile = path.resolve(__dirname, 'public/student_photos_cache.json')
  const getCache = () => {
    try {
      if (fs.existsSync(cacheFile)) {
        return JSON.parse(fs.readFileSync(cacheFile, 'utf-8'))
      }
    } catch {}
    return {}
  }

  return {
    name: 'student-photo-cache-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/photo-cache')) {
          const urlObj = new URL(req.url, 'http://localhost')
          if (req.method === 'GET') {
            const cache = getCache()
            const key = urlObj.searchParams.get('key')
            if (key) {
              const cleanKey = key.trim()
              const lowerKey = cleanKey.toLowerCase()
              const digits = cleanKey.replace(/\D/g, '')
              const photo = cache[cleanKey] || cache[lowerKey] || (digits ? cache[digits] : null) || null
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, photo }))
              return
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, cache }))
            return
          }
          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body)
                if (parsed.photo) {
                  const cache = getCache()
                  if (parsed.key) cache[parsed.key] = parsed.photo
                  if (parsed.reg) {
                    cache[parsed.reg] = parsed.photo
                    cache[parsed.reg.toLowerCase()] = parsed.photo
                    const digits = parsed.reg.replace(/\D/g, '')
                    if (digits) cache[digits] = parsed.photo
                  }
                  if (parsed.name) {
                    cache[parsed.name.toLowerCase()] = parsed.photo
                  }
                  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2))
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
