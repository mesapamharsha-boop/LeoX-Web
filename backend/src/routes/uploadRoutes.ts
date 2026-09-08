import { Router } from 'express';
import { upload } from '../middleware/upload';
import { handleUpload, handleDeleteMedia } from '../controllers/uploadController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.post('/', authenticateAdmin, upload.single('media'), handleUpload);
router.delete('/:filename', authenticateAdmin, handleDeleteMedia);

export default router;
