import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { uploadToS3, getS3FileStream, isCloudStorageReady } from '../config/s3.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for memory storage (max 10MB file size)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types: images and PDFs
    const allowedMime = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
      'application/pdf'
    ];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP and PDF files are allowed.'));
    }
  }
});

/**
 * POST /api/upload
 * Uploads a file to Amazon S3 (or local fallback storage)
 * Query/body param 'folder' specifies bucket folder (e.g. 'photos', 'receipts', 'certificates')
 */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided in the request.' });
    }

    const folder = req.body.folder || req.query.folder || 'general';
    const result = await uploadToS3(req.file, folder);

    return res.status(200).json({
      success: true,
      url: result.url,
      key: result.key,
      storage: result.storage,
      message: result.storage === 's3' 
        ? 'File successfully uploaded to Amazon S3.' 
        : 'File saved to local server storage (fallback mode).'
    });
  } catch (err) {
    console.error('[Upload Route Error]:', err);
    res.status(500).json({ success: false, message: err.message || 'Error uploading file.' });
  }
});

/**
 * GET /api/upload/file/*key and GET /api/upload/view
 * Streams/proxies any uploaded file from Amazon S3 (or local storage fallback)
 * Ensures 100% reliable image display across all browsers and devices.
 */
router.get('/file/*key', async (req, res) => {
  try {
    const rawParam = req.params.key || req.params[0] || req.query.key;
    if (!rawParam) {
      return res.status(400).send('Missing file key');
    }

    const rawKey = Array.isArray(rawParam) ? rawParam.join('/') : String(rawParam);
    const key = rawKey
      .replace(/^https?:\/\/[^/]+\.s3\.[^/]+\.amazonaws\.com\//i, '')
      .replace(/^\/+/, '');

    // 1. Try S3 if configured
    if (isCloudStorageReady()) {
      try {
        const stream = await getS3FileStream(key);
        if (stream && stream.Body) {
          if (stream.ContentType) res.setHeader('Content-Type', stream.ContentType);
          if (stream.ContentLength) res.setHeader('Content-Length', stream.ContentLength);
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.setHeader('Access-Control-Allow-Origin', '*');
          return stream.Body.pipe(res);
        }
      } catch (s3Err) {
        // Fall through to local fallback
      }
    }

    // 2. Try local fallback storage
    const localPath = path.join(__dirname, '..', 'uploads', path.basename(key));
    if (fs.existsSync(localPath)) {
      return res.sendFile(localPath);
    }

    return res.status(404).send('File not found');
  } catch (err) {
    console.error('[File Proxy Error]:', err.message);
    res.status(500).send('Error serving file');
  }
});

router.get('/view', async (req, res) => {
  try {
    const rawKey = req.query.url || req.query.key;
    if (!rawKey) {
      return res.status(400).send('Missing url or key query parameter');
    }
    const key = rawKey
      .replace(/^https?:\/\/[^/]+\.s3\.[^/]+\.amazonaws\.com\//i, '')
      .replace(/^\/+/, '');

    if (isCloudStorageReady()) {
      try {
        const stream = await getS3FileStream(key);
        if (stream && stream.Body) {
          if (stream.ContentType) res.setHeader('Content-Type', stream.ContentType);
          if (stream.ContentLength) res.setHeader('Content-Length', stream.ContentLength);
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.setHeader('Access-Control-Allow-Origin', '*');
          return stream.Body.pipe(res);
        }
      } catch (e) {}
    }

    const localPath = path.join(__dirname, '..', 'uploads', path.basename(key));
    if (fs.existsSync(localPath)) {
      return res.sendFile(localPath);
    }

    return res.status(404).send('File not found');
  } catch (err) {
    res.status(500).send('Error');
  }
});

/**
 * GET /api/upload/status
 * Returns cloud storage readiness
 */
router.get('/status', (req, res) => {
  res.json({
    cloudReady: isCloudStorageReady(),
    provider: isCloudStorageReady() ? 'Amazon S3' : 'Local Storage Fallback'
  });
});

export default router;
