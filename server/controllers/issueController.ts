import { Response } from 'express';
import { Issue } from '../models/Issue';
import { Notification } from '../models/Notification';
import { getIsDbConnected } from '../config/db';
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

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const logControllerError = (operation: string, error: unknown): void => {
  console.error(
    `${operation} failed:`,
    error instanceof Error ? error.name : 'UnknownError'
  );
};

const AFFECTED_COUNT_OPTIONS = [
  'Not sure',
  'A few neighbors',
  'Dozens of residents',
  'Entire block / street',
  'All commuters on main artery',
];

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
      affectedCount,
      landmark,
    } = req.body ?? {};

    if (typeof title !== 'string' || !title.trim()) {
      res.status(400).json({ success: false, message: 'Issue title is required.' });
      return;
    }

    if (typeof category !== 'string' || !category.trim()) {
      res.status(400).json({ success: false, message: 'Category is required.' });
      return;
    }

    if (typeof description !== 'string' || !description.trim()) {
      res.status(400).json({ success: false, message: 'Description is required.' });
      return;
    }

    if (typeof location !== 'string' || !location.trim()) {
      res.status(400).json({ success: false, message: 'Location is required.' });
      return;
    }

    const normalizedPriority = typeof priority === 'string' ? priority.toUpperCase() : '';
    if (!['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(normalizedPriority)) {
      res.status(400).json({
        success: false,
        message: 'Priority must be Low, Medium, High, or Critical.',
      });
      return;
    }

    if (
      affectedCount !== undefined &&
      (typeof affectedCount !== 'string' || !AFFECTED_COUNT_OPTIONS.includes(affectedCount))
    ) {
      res.status(400).json({
        success: false,
        message: 'Select a valid estimate for people affected.',
      });
      return;
    }

    if (!getIsDbConnected()) {
      res.status(503).json({
        success: false,
        message: 'Report storage is temporarily unavailable. Please try again later.',
      });
      return;
    }

    const reportId = generateReportId();

    const issue = await Issue.create({
      reportId,
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      priority: normalizedPriority,
      status: 'REPORTED',
      userId,
      imageUrl: imageUrl || null,
      frequency: frequency || null,
      affectedCount: affectedCount || null,
      landmark: landmark || null,
      createdAt: new Date(),
      resolvedAt: null,
    });

    try {
      await Notification.create({
        userId,
        message: `Your issue ${reportId} ("${title.trim()}") has been registered.`,
        type: 'STATUS_UPDATE',
        read: false,
        createdAt: new Date(),
      });
    } catch (error: unknown) {
      logControllerError('createIssue notification', error);
    }

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully.',
      issue,
    });
  } catch (error: unknown) {
    logControllerError('createIssue', error);
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

    if (!getIsDbConnected()) {
      res.status(503).json({
        success: false,
        message: 'Report storage is temporarily unavailable. Please try again later.',
      });
      return;
    }

    const issues = await Issue.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: issues.length, issues });
  } catch (error: unknown) {
    logControllerError('getMyIssues', error);
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

    if (!getIsDbConnected()) {
      res.status(503).json({
        success: false,
        message: 'Report storage is temporarily unavailable. Please try again later.',
      });
      return;
    }

    const userIssues = await Issue.find({ userId });
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
  } catch (error: unknown) {
    logControllerError('getIssueStats', error);
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

    if (!getIsDbConnected()) {
      res.status(503).json({
        success: false,
        message: 'Report storage is temporarily unavailable. Please try again later.',
      });
      return;
    }

    const issue = await Issue.findOne({
      $or: [
        { reportId: { $regex: new RegExp(`^${escapeRegExp(query)}$`, 'i') } },
        ...(query.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: query }] : []),
      ],
    });

    if (!issue) {
      res.status(404).json({ success: false, message: 'Report not found with the specified ID.' });
      return;
    }

    res.json({ success: true, issue });
  } catch (error: unknown) {
    logControllerError('getIssueById', error);
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
    const {
      title,
      description,
      category,
      location,
      priority,
      landmark,
      frequency,
      affectedCount,
    } = req.body ?? {};

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!getIsDbConnected()) {
      res.status(503).json({
        success: false,
        message: 'Report storage is temporarily unavailable. Please try again later.',
      });
      return;
    }

    if (
      affectedCount !== undefined &&
      (typeof affectedCount !== 'string' || !AFFECTED_COUNT_OPTIONS.includes(affectedCount))
    ) {
      res.status(400).json({
        success: false,
        message: 'Select a valid estimate for people affected.',
      });
      return;
    }

    const issue = await Issue.findOne({ _id: issueId, userId });
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
    if (affectedCount !== undefined) issue.affectedCount = affectedCount;

    await issue.save();
    res.json({ success: true, message: 'Issue updated successfully.', issue });
  } catch (error: unknown) {
    logControllerError('updateIssue', error);
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

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!getIsDbConnected()) {
      res.status(503).json({
        success: false,
        message: 'Report storage is temporarily unavailable. Please try again later.',
      });
      return;
    }

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
  } catch (error: unknown) {
    logControllerError('deleteIssue', error);
    res.status(500).json({ success: false, message: 'Failed to delete issue.' });
  }
};

/**
 * @desc    Update the status of an issue owned by the authenticated user
 * @route   PATCH /api/issues/:id/status
 * @access  Private (Owner only)
 */
export const updateIssueStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const issueId = req.params.id;
    const userId = req.user?.id;
    const { status } = req.body ?? {};

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const validStatuses = [
      'REPORTED',
      'UNDER REVIEW',
      'VERIFIED',
      'ASSIGNED',
      'IN PROGRESS',
      'RESOLVED',
      'CLOSED',
    ];

    if (typeof status !== 'string' || !validStatuses.includes(status.toUpperCase())) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
      return;
    }

    const cleanStatus = status.toUpperCase();
    const resolvedAt = cleanStatus === 'RESOLVED' || cleanStatus === 'CLOSED' ? new Date() : null;

    if (!getIsDbConnected()) {
      res.status(503).json({
        success: false,
        message: 'Report storage is temporarily unavailable. Please try again later.',
      });
      return;
    }

    const issue = await Issue.findOne({
      $or: [{ _id: issueId }, { reportId: issueId }],
      userId,
    });

    if (!issue) {
      res.status(404).json({
        success: false,
        message: 'Issue not found or you do not have permission to update it.',
      });
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
  } catch (error: unknown) {
    logControllerError('updateIssueStatus', error);
    res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
};
