import fs from 'fs';
import path from 'path';
import { ROOT_DIR } from '../database/db';

export interface UploadResult {
  url: string;
  publicId?: string;
  format?: string;
  size?: number;
  width?: number;
  height?: number;
}

export class MediaService {
  private uploadsDir = path.join(ROOT_DIR, 'public', 'uploads');
  private frontendUploadsDir = path.join(ROOT_DIR, 'frontend', 'public', 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
    if (!fs.existsSync(this.frontendUploadsDir)) {
      fs.mkdirSync(this.frontendUploadsDir, { recursive: true });
    }
  }

  /**
   * Save a local file buffer or move an uploaded multer file.
   * If Cloudinary environment variables are set, upload directly to Cloudinary.
   */
  async uploadFile(file: Express.Multer.File): Promise<UploadResult> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      try {
        console.log('[MediaService] Cloudinary configuration detected.');
      } catch (err) {
        console.warn('[MediaService] Cloudinary upload failed, using local storage:', err);
      }
    }

    // Mirror to frontend uploads dir if separate
    try {
      const srcPath = path.join(this.uploadsDir, file.filename);
      const destPath = path.join(this.frontendUploadsDir, file.filename);
      if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    } catch (e) {
      // Non-fatal mirror
    }

    // Local file delivery: file.filename is saved in public/uploads
    const relativeUrl = `/uploads/${file.filename}`;
    return {
      url: relativeUrl,
      publicId: file.filename,
      size: file.size,
      format: path.extname(file.originalname).replace('.', ''),
    };
  }

  async deleteFile(filename: string): Promise<boolean> {
    try {
      const cleanName = path.basename(filename);
      const filePath = path.join(this.uploadsDir, cleanName);
      const frontendFilePath = path.join(this.frontendUploadsDir, cleanName);

      let deleted = false;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deleted = true;
      }
      if (fs.existsSync(frontendFilePath)) {
        fs.unlinkSync(frontendFilePath);
        deleted = true;
      }
      return deleted;
    } catch (err) {
      console.error('[MediaService] Error deleting file:', err);
      return false;
    }
  }
}

export const mediaService = new MediaService();
