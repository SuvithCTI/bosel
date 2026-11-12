import express from 'express';
import multer from 'multer';
import { uploadToS3, isCloudStorageReady } from '../config/s3.js';

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
