import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const region = process.env.AWS_REGION || 'ap-south-1';
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const isS3Configured = Boolean(bucketName && accessKeyId && secretAccessKey);

let s3Client = null;

if (isS3Configured) {
  try {
    s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
    console.log(`[Amazon S3] Client initialized for bucket: ${bucketName} in region: ${region}`);
  } catch (err) {
    console.warn('[Amazon S3] Failed to initialize S3 client:', err.message);
  }
} else {
  console.warn('[Amazon S3] Missing AWS S3 credentials (AWS_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY). Uploads will use local server storage.');
}

// Local uploads directory for fallback
const localUploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(localUploadsDir)) {
  fs.mkdirSync(localUploadsDir, { recursive: true });
}

/**
 * Upload a file buffer or stream to Amazon S3 (or local fallback)
 * @param {Object} file - Multer file object or { buffer, originalname, mimetype }
 * @param {string} folder - Target folder/prefix in bucket (e.g. 'students', 'receipts', 'certificates')
 * @returns {Promise<{ url: string, key: string, storage: 's3' | 'local' }>}
 */
export async function uploadToS3(file, folder = 'general') {
  const fileExt = path.extname(file.originalname || file.name || '').toLowerCase() || '.jpg';
  const cleanBase = path.basename(file.originalname || 'upload', fileExt).replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${folder}/${cleanBase}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${fileExt}`;

  // If S3 is configured, upload to AWS S3 bucket
  if (isS3Configured && s3Client) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype || 'application/octet-stream'
      });

      await s3Client.send(command);

      // Construct standard S3 URL
      const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`;
      console.log(`[Amazon S3] File successfully uploaded to S3: ${publicUrl}`);

      return {
        url: publicUrl,
        key: filename,
        storage: 's3'
      };
    } catch (err) {
      console.error('[Amazon S3] Error uploading to S3, falling back to local:', err.message);
    }
  }

  // Fallback: Save file to local server/uploads/ directory
  const localFileName = `${cleanBase}_${Date.now()}${fileExt}`;
  const localFilePath = path.join(localUploadsDir, localFileName);
  fs.writeFileSync(localFilePath, file.buffer);

  const localUrl = `/uploads/${localFileName}`;
  console.log(`[Amazon S3 Fallback] Saved locally to ${localUrl}`);

  return {
    url: localUrl,
    key: localFileName,
    storage: 'local'
  };
}

/**
 * Generate a presigned download URL for private S3 objects
 */
export async function getPresignedDownloadUrl(key, expiresIn = 3600) {
  if (!isS3Configured || !s3Client) return null;
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (err) {
    console.error('[Amazon S3] Presigned URL error:', err.message);
    return null;
  }
}

export function isCloudStorageReady() {
  return isS3Configured && Boolean(s3Client);
}

export default {
  uploadToS3,
  getPresignedDownloadUrl,
  isCloudStorageReady,
  bucketName,
  region
};
