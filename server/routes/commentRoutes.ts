import { Router } from 'express';
import { addComment, getComments } from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/:issueId', getComments);
router.post('/:issueId', protect, addComment);

export default router;
