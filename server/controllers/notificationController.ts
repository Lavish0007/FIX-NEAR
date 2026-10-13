import { Response } from 'express';
import { Notification } from '../models/Notification';
import { getIsDbConnected } from '../config/db';
import { memoryStore } from '../data/store';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * @desc    Get notifications for logged-in user
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (getIsDbConnected()) {
      const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
      const unreadCount = notifications.filter((n) => !n.read).length;
      res.json({ success: true, count: notifications.length, unreadCount, notifications });
    } else {
      const notifications = memoryStore.notifications
        .filter((n) => n.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      const unreadCount = notifications.filter((n) => !n.read).length;
      res.json({ success: true, count: notifications.length, unreadCount, notifications });
    }
  } catch (error: any) {
    console.error('getNotifications error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve notifications.' });
  }
};

/**
 * @desc    Mark a single notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const notifId = req.params.id;

    if (getIsDbConnected()) {
      const notif = await Notification.findOneAndUpdate(
        { _id: notifId, userId },
        { read: true },
        { new: true }
      );

      if (!notif) {
        res.status(404).json({ success: false, message: 'Notification not found' });
        return;
      }

      res.json({ success: true, message: 'Notification marked as read', notification: notif });
    } else {
      const notif = memoryStore.notifications.find((n) => n._id === notifId && n.userId === userId);
      if (!notif) {
        res.status(404).json({ success: false, message: 'Notification not found' });
        return;
      }

      notif.read = true;
      res.json({ success: true, message: 'Notification marked as read', notification: notif });
    }
  } catch (error: any) {
    console.error('markAsRead error:', error);
    res.status(500).json({ success: false, message: 'Failed to update notification.' });
  }
};

/**
 * @desc    Mark all user notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (getIsDbConnected()) {
      await Notification.updateMany({ userId, read: false }, { read: true });
      res.json({ success: true, message: 'All notifications marked as read' });
    } else {
      memoryStore.notifications
        .filter((n) => n.userId === userId)
        .forEach((n) => {
          n.read = true;
        });
      res.json({ success: true, message: 'All notifications marked as read' });
    }
  } catch (error: any) {
    console.error('markAllAsRead error:', error);
    res.status(500).json({ success: false, message: 'Failed to update notifications.' });
  }
};
