import { Router } from 'express';
import {
  createIssue,
  getMyIssues,
  getIssueStats,
  getIssueById,
  updateIssue,
  deleteIssue,
  updateIssueStatus,
} from '../controllers/issueController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// User-specific routes (Protected)
router.get('/my', protect, getMyIssues);
router.get('/stats', protect, getIssueStats);
router.post('/', protect, createIssue);

// Single issue operations
router.get('/:id', getIssueById);
router.put('/:id', protect, updateIssue);
router.delete('/:id', protect, deleteIssue);
router.patch('/:id/status', protect, updateIssueStatus);

export default router;
