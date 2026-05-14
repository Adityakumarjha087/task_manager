import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { admin } from '../middleware/adminMiddleware';
import { searchUsers, updateProfile, createEmployee, deleteEmployee } from '../controllers/userController';

const router = express.Router();

router.get('/', protect, searchUsers);
router.put('/profile', protect, updateProfile);
router.post('/', protect, admin, createEmployee);
router.delete('/:id', protect, admin, deleteEmployee);

export default router;
