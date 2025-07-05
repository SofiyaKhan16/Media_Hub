import express from 'express';
import upload from '../config/multer.js';
import mediaFileController from '../controllers/mediaFileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, mediaFileController.getAll);
router.get('/:id', authMiddleware, mediaFileController.getById);
router.post('/', authMiddleware, upload.single('file'), mediaFileController.createMedia);
router.delete('/:id', authMiddleware, mediaFileController.delete);

export default router;
