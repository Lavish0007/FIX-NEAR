import { Response } from 'express';
import { Issue } from '../models/Issue';
import { Notification } from '../models/Notification';
import { getIsDbConnected } from '../config/db';
import { memoryStore, StoredIssue } from '../data/store';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * Generate human-readable FixNear report ID (e.g. FX-20261002-4821)
 */
export const generateReportId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `FX-${year}${month}${day}-${randomSuffix}`;
};

/**
 * @desc    Create a new civic issue
 * @route   POST /api/issues
 * @access  Private
 */
export const createIssue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const {
      title,
      description,
      category,
      location,
      priority = 'MEDIUM',
      imageUrl,
      frequency,
      landmark,
    } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ success: false, message: 'Issue title is required.' });
      return;
    }

    if (!category) {
      res.status(400).json({ success: false, message: 'Category is required.' });
      return;
    }

    if (!description || !description.trim()) {
      res.status(400).json({ success: false, message: 'Description is required.' });
      return;
    }

    if (!location || !location.trim()) {
      res.status(400).json({ success: false, message: 'Location is required.' });
      return;
    }

    const reportId = generateReportId();

    if (getIsDbConnected()) {
      const issue = await Issue.create({
        reportId,
        title: title.trim(),
        description: description.trim(),
        category,
        location: location.trim(),
        priority: priority.toUpperCase(),
        status: 'REPORTED',
        userId,
        imageUrl: imageUrl || null,
        frequency: frequency || null,
        landmark: landmark || null,
        createdAt: new Date(),
        resolvedAt: null,
      });

      // Create notification
      await Notification.create({
        userId,
        message: `Your issue ${reportId} ("${title.trim()}") has been registered.`,
        type: 'STATUS_UPDATE',
        read: false,
        createdAt: new Date(),
      });

      res.status(201).json({
        success: true,
        message: 'Issue reported successfully.',
        issue,
      });
    } else {
      // In-Memory Fallback
      const newIssue: StoredIssue = {
        _id: 'iss_' + Date.now(),
        reportId,
        title: title.trim(),
        description: description.trim(),
        category,
        location: location.trim(),
        priority: priority.toUpperCase() as any,
        status: 'REPORTED',
        userId,
        imageUrl: imageUrl || undefined,
        frequency: frequency || undefined,
        landmark: landmark || undefined,
        createdAt: new Date(),
        resolvedAt: null,
      };

      memoryStore.issues.unshift(newIssue);

      // Create in-memory notification
      memoryStore.notifications.unshift({
        _id: 'notif_' + Date.now(),
        userId,
        message: `Your issue ${reportId} ("${title.trim()}") has been registered.`,
        type: 'STATUS_UPDATE',
        read: false,
        createdAt: new Date(),
      });

      res.status(201).json({
        success: true,
        message: 'Issue reported successfully.',
        issue: newIssue,
      });
    }
  } catch (error: any) {
    console.error('createIssue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create issue. Please check all fields.',
    });
  }
};

/**
 * @desc    Get all issues belonging to the logged-in user
 * @route   GET /api/issues/my
 * @access  Private
 */
export const getMyIssues = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (getIsDbConnected()) {
      const issues = await Issue.find({ userId }).sort({ createdAt: -1 });
      res.json({ success: true, count: issues.length, issues });
    } else {
      const issues = memoryStore.issues
        .filter((i) => i.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      res.json({ success: true, count: issues.length, issues });
    }
  } catch (error: any) {
    console.error('getMyIssues error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve your issues.' });
  }
};

/**
 * @desc    Get dashboard metrics for logged-in user
 * @route   GET /api/issues/stats
 * @access  Private
 */
export const getIssueStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    let userIssues: any[] = [];

    if (getIsDbConnected()) {
      userIssues = await Issue.find({ userId });
    } else {
      userIssues = memoryStore.issues.filter((i) => i.userId === userId);
    }

    const total = userIssues.length;
    const resolved = userIssues.filter(
      (i) => i.status === 'RESOLVED' || i.status === 'CLOSED'
    ).length;
    const active = total - resolved;
    const highPriority = userIssues.filter(
      (i) => i.priority === 'HIGH' || i.priority === 'CRITICAL'
    ).length;

    res.json({
      success: true,
      stats: {
        total,
        active,
        resolved,
        highPriority,
      },
    });
  } catch (error: any) {
    console.error('getIssueStats error:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate issue statistics.' });
  }
};

/**
 * @desc    Get single issue by Mongo _id OR human reportId
 * @route   GET /api/issues/:id
 * @access  Private or Public Lookup
 */
export const getIssueById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = req.params.id.trim();

    if (getIsDbConnected()) {
      // Try searching by reportId first, then by ObjectId if valid
      let issue = await Issue.findOne({
        $or: [
          { reportId: { $regex: new RegExp(`^${query}$`, 'i') } },
          ...(query.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: query }] : []),
        ],
      });

      if (!issue) {
        res.status(404).json({ success: false, message: 'Report not found with the specified ID.' });
        return;
      }

      res.json({ success: true, issue });
    } else {
      const issue = memoryStore.issues.find(
        (i) =>
          i.reportId.toLowerCase() === query.toLowerCase() ||
          i._id.toLowerCase() === query.toLowerCase()
      );

      if (!issue) {
        res.status(404).json({ success: false, message: 'Report not found with the specified ID.' });
        return;
      }

      res.json({ success: true, issue });
    }
  } catch (error: any) {
    console.error('getIssueById error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving issue details.' });
  }
};

/**
 * @desc    Update issue details
 * @route   PUT /api/issues/:id
 * @access  Private (Owner only)
 */
export const updateIssue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const issueId = req.params.id;
    const { title, description, category, location, priority, landmark, frequency } = req.body;

    if (getIsDbConnected()) {
      const issue = await Issue.findOne({
        _id: issueId,
        userId,
      });

      if (!issue) {
        res.status(404).json({
          success: false,
          message: 'Issue not found or you do not have permission to modify it.',
        });
        return;
      }

      if (title) issue.title = title.trim();
      if (description) issue.description = description.trim();
      if (category) issue.category = category;
      if (location) issue.location = location.trim();
      if (priority) issue.priority = priority.toUpperCase();
      if (landmark !== undefined) issue.landmark = landmark;
      if (frequency !== undefined) issue.frequency = frequency;

      await issue.save();
      res.json({ success: true, message: 'Issue updated successfully.', issue });
    } else {
      const issueIndex = memoryStore.issues.findIndex(
        (i) => (i._id === issueId || i.reportId === issueId) && i.userId === userId
      );

      if (issueIndex === -1) {
        res.status(404).json({
          success: false,
          message: 'Issue not found or you do not have permission to modify it.',
        });
        return;
      }

      const issue = memoryStore.issues[issueIndex];
      if (title) issue.title = title.trim();
      if (description) issue.description = description.trim();
      if (category) issue.category = category;
      if (location) issue.location = location.trim();
      if (priority) issue.priority = priority.toUpperCase() as any;
      if (landmark !== undefined) issue.landmark = landmark;
      if (frequency !== undefined) issue.frequency = frequency;

      res.json({ success: true, message: 'Issue updated successfully.', issue });
    }
  } catch (error: any) {
    console.error('updateIssue error:', error);
    res.status(500).json({ success: false, message: 'Failed to update issue.' });
  }
};

/**
 * @desc    Delete issue
 * @route   DELETE /api/issues/:id
 * @access  Private (Owner only)
 */
export const deleteIssue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const issueId = req.params.id;

    if (getIsDbConnected()) {
      const issue = await Issue.findOneAndDelete({
        $or: [{ _id: issueId }, { reportId: issueId }],
        userId,
      });

      if (!issue) {
        res.status(404).json({
          success: false,
          message: 'Issue not found or you are not authorized to delete it.',
        });
        return;
      }

      res.json({ success: true, message: 'Issue deleted successfully.' });
    } else {
      const idx = memoryStore.issues.findIndex(
        (i) => (i._id === issueId || i.reportId === issueId) && i.userId === userId
      );

      if (idx === -1) {
        res.status(404).json({
          success: false,
          message: 'Issue not found or you are not authorized to delete it.',
        });
        return;
      }

      memoryStore.issues.splice(idx, 1);
      res.json({ success: true, message: 'Issue deleted successfully.' });
    }
  } catch (error: any) {
    console.error('deleteIssue error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete issue.' });
  }
};

/**
 * @desc    Update issue status (Civic Triage / Demo Control)
 * @route   PATCH /api/issues/:id/status
 * @access  Private
 */
export const updateIssueStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const issueId = req.params.id;
    const { status } = req.body;

    const validStatuses = [
      'REPORTED',
      'UNDER REVIEW',
      'VERIFIED',
      'ASSIGNED',
      'IN PROGRESS',
      'RESOLVED',
      'CLOSED',
    ];

    if (!status || !validStatuses.includes(status.toUpperCase())) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
      return;
    }

    const cleanStatus = status.toUpperCase();
    const resolvedAt = cleanStatus === 'RESOLVED' || cleanStatus === 'CLOSED' ? new Date() : null;

    if (getIsDbConnected()) {
      const issue = await Issue.findOne({
        $or: [{ _id: issueId }, { reportId: issueId }],
      });

      if (!issue) {
        res.status(404).json({ success: false, message: 'Issue not found' });
        return;
      }

      issue.status = cleanStatus;
      if (resolvedAt) {
        issue.resolvedAt = resolvedAt;
      } else if (cleanStatus !== 'RESOLVED' && cleanStatus !== 'CLOSED') {
        issue.resolvedAt = null;
      }

      await issue.save();

      // Create notification for issue owner
      await Notification.create({
        userId: issue.userId,
        message: `Your issue ${issue.reportId} has been moved to ${cleanStatus}.`,
        type: 'STATUS_UPDATE',
        read: false,
        createdAt: new Date(),
      });

      res.json({
        success: true,
        message: `Issue status updated to ${cleanStatus}`,
        issue,
      });
    } else {
      const issue = memoryStore.issues.find(
        (i) => i._id === issueId || i.reportId === issueId
      );

      if (!issue) {
        res.status(404).json({ success: false, message: 'Issue not found' });
        return;
      }

      issue.status = cleanStatus as any;
      if (resolvedAt) {
        issue.resolvedAt = resolvedAt;
      } else {
        issue.resolvedAt = null;
      }

      // In-memory notification
      memoryStore.notifications.unshift({
        _id: 'notif_' + Date.now(),
        userId: issue.userId,
        message: `Your issue ${issue.reportId} has been moved to ${cleanStatus}.`,
        type: 'STATUS_UPDATE',
        read: false,
        createdAt: new Date(),
      });

      res.json({
        success: true,
        message: `Issue status updated to ${cleanStatus}`,
        issue,
      });
    }
  } catch (error: any) {
    console.error('updateIssueStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
};
