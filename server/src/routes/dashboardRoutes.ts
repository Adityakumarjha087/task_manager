import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getDashboardStats } from '../controllers/dashboardController';

const router = express.Router();

router.use(protect);

router.get('/', getDashboardStats);

export default router;
