
import express from 'express';
import { getAccount, getAllAccounts, verifyGoogleToken } from '../controllers/accountController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/verify-google/:token', verifyGoogleToken);

router.get('/', authMiddleware, getAllAccounts);
router.get('/:id', authMiddleware, getAccount);

export default router;
