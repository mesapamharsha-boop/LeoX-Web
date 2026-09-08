import { Request, Response } from 'express';
import { mediaService } from '../services/mediaService';

export const handleUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded.' });
      return;
    }

    const result = await mediaService.uploadFile(req.file);
    res.json({
      success: true,
      message: 'Media uploaded successfully.',
      ...result,
    });
  } catch (error: any) {
    console.error('[Upload] Error uploading media:', error);
    res.status(500).json({ success: false, message: error.message || 'File upload failed.' });
  }
};

export const handleDeleteMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;
    const deleted = await mediaService.deleteFile(filename);
    res.json({ success: true, message: deleted ? 'Media removed.' : 'File not found.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete media.' });
  }
};
