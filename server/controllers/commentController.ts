import { Response } from 'express';
import { Comment } from '../models/Comment';
import { Notification } from '../models/Notification';
import { Issue } from '../models/Issue';
import { getIsDbConnected } from '../config/db';
import { memoryStore, StoredComment } from '../data/store';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * @desc    Add a comment to an issue
 * @route   POST /api/comments/:issueId
 * @access  Private
 */
export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userName = req.user?.name || 'Citizen';
    const issueId = req.params.issueId;
    const { message } = req.body;

    if (!message || !message.trim()) {
      res.status(400).json({ success: false, message: 'Comment text cannot be empty.' });
      return;
    }

    if (getIsDbConnected()) {
      const issue = await Issue.findOne({
        $or: [
          { reportId: issueId },
          ...(issueId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: issueId }] : []),
        ],
      });

      if (!issue) {
        res.status(404).json({ success: false, message: 'Issue not found.' });
        return;
      }

      const comment = await Comment.create({
        issueId: issue._id,
        userId,
        userName,
        message: message.trim(),
        createdAt: new Date(),
      });

      // Notify the issue owner if the commenter is different
      if (issue.userId.toString() !== userId) {
        await Notification.create({
          userId: issue.userId,
          message: `${userName} added a comment on your report ${issue.reportId}.`,
          type: 'COMMENT',
          read: false,
          createdAt: new Date(),
        });
      }

      res.status(201).json({
        success: true,
        message: 'Comment added successfully.',
        comment,
      });
    } else {
      const issue = memoryStore.issues.find(
        (i) =>
          i._id.toLowerCase() === issueId.toLowerCase() ||
          i.reportId.toLowerCase() === issueId.toLowerCase()
      );

      if (!issue) {
        res.status(404).json({ success: false, message: 'Issue not found.' });
        return;
      }

      const newComment: StoredComment = {
        _id: 'comm_' + Date.now(),
        issueId: issue._id,
        userId: userId!,
        userName,
        message: message.trim(),
        createdAt: new Date(),
      };

      memoryStore.comments.push(newComment);

      // Notification in memory
      if (issue.userId !== userId) {
        memoryStore.notifications.unshift({
          _id: 'notif_' + Date.now(),
          userId: issue.userId,
          message: `${userName} commented on your report ${issue.reportId}.`,
          type: 'COMMENT',
          read: false,
          createdAt: new Date(),
        });
      }

      res.status(201).json({
        success: true,
        message: 'Comment added successfully.',
        comment: newComment,
      });
    }
  } catch (error: any) {
    console.error('addComment error:', error);
    res.status(500).json({ success: false, message: 'Failed to add comment.' });
  }
};

/**
 * @desc    Get all comments for an issue
 * @route   GET /api/comments/:issueId
 * @access  Private / Public
 */
export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const issueId = req.params.issueId;

    if (getIsDbConnected()) {
      const issue = await Issue.findOne({
        $or: [
          { reportId: issueId },
          ...(issueId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: issueId }] : []),
        ],
      });

      if (!issue) {
        res.status(404).json({ success: false, message: 'Issue not found.' });
        return;
      }

      const comments = await Comment.find({ issueId: issue._id }).sort({ createdAt: 1 });
      res.json({ success: true, count: comments.length, comments });
    } else {
      const issue = memoryStore.issues.find(
        (i) =>
          i._id.toLowerCase() === issueId.toLowerCase() ||
          i.reportId.toLowerCase() === issueId.toLowerCase()
      );

      if (!issue) {
        res.status(404).json({ success: false, message: 'Issue not found.' });
        return;
      }

      const comments = memoryStore.comments.filter((c) => c.issueId === issue._id);
      res.json({ success: true, count: comments.length, comments });
    }
  } catch (error: any) {
    console.error('getComments error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve comments.' });
  }
};
