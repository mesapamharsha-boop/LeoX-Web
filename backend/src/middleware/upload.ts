import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ROOT_DIR } from '../database/db';

// Ensure uploads directories exist
export const uploadsDir = path.join(ROOT_DIR, 'public', 'uploads');
export const frontendUploadsDir = path.join(ROOT_DIR, 'frontend', 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(frontendUploadsDir)) {
  fs.mkdirSync(frontendUploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${uniqueSuffix}-${sanitized}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|mp4|mov|webm|svg/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype.toLowerCase();

    if (allowed.test(ext) || allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG, WEBP, GIF, SVG) and videos (MP4, MOV, WEBM) are supported.'));
    }
  },
});
