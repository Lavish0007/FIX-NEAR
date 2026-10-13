import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getNotifications);
router.patch('/read-all', protect, markAllAsRead);
router.patch('/:id/read', protect, markAsRead);

export default router;
