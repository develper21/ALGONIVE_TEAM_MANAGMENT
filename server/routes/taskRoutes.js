import express from 'express';
import fs from 'fs';
import multer from 'multer';
import Task from '../models/Task.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import TaskActivity from '../models/TaskActivity.js';
import TaskAttachment from '../models/TaskAttachment.js';
import { authMiddleware } from '../utils/authMiddleware.js';
import { sendEmail, emailTemplates } from '../utils/emailService.js';
import { recordTaskActivity } from '../utils/activityPublisher.js';
import { ensureTaskUploadDir, getTaskRelativePath, detectFileType, resolveAttachmentPath } from '../utils/attachmentStorage.js';

const router = express.Router();

const attachmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const dir = ensureTaskUploadDir(req.params.id);
      cb(null, dir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const attachmentUpload = multer({
  storage: attachmentStorage,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB per file
  }
});

const requireTaskAccess = async (taskId, user) => {
  const task = await Task.findById(taskId).populate('team', 'members name color');
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
  }

  const userId = user._id.toString();
  const isMember = task.team?.members?.some((memberId) => memberId.toString() === userId);
  const isCreator = task.createdBy.toString() === userId;

  if (!isMember && !isCreator && user.role !== 'admin') {
    const error = new Error('Access denied');
    error.status = 403;
    throw error;
  }

  return task;
};

// @route   POST /api/tasks/:id/attachments
// @desc    Upload files for a task
// @access  Private
router.post('/:id/attachments', authMiddleware, attachmentUpload.array('files', 10), async (req, res) => {
  try {
    const task = await requireTaskAccess(req.params.id, req.user);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const attachments = await Promise.all(req.files.map(async (file) => {
      const relativePath = getTaskRelativePath(task._id, file.filename);
      const fileType = detectFileType(file.mimetype, file.originalname);

      const attachment = await TaskAttachment.create({
        task: task._id,
        uploadedBy: req.user._id,
        originalName: file.originalname,
        storedName: file.filename,
        size: file.size,
        mimeType: file.mimetype,
        fileType,
        relativePath
      });

      return attachment;
    }));

    res.status(201).json({
      success: true,
      attachments
    });
  } catch (error) {
    console.error('Upload attachment error:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to upload attachments'
    });
  }
});

// @route   GET /api/tasks/:id/attachments
// @desc    List attachments for a task
// @access  Private
router.get('/:id/attachments', authMiddleware, async (req, res) => {
  try {
    await requireTaskAccess(req.params.id, req.user);

    const attachments = await TaskAttachment.find({ task: req.params.id })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name email');

    res.json({
      success: true,
      attachments
    });
  } catch (error) {
    console.error('List attachments error:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to fetch attachments'
    });
  }
});

// @route   GET /api/tasks/attachments/:attachmentId/download
// @desc    Download a specific attachment
// @access  Private
router.get('/attachments/:attachmentId/download', authMiddleware, async (req, res) => {
  try {
    const attachment = await TaskAttachment.findById(req.params.attachmentId);
    if (!attachment) {
      return res.status(404).json({ success: false, message: 'Attachment not found' });
    }

    await requireTaskAccess(attachment.task, req.user);

    const absolutePath = resolveAttachmentPath(attachment.relativePath);
    if (!fs.existsSync(absolutePath)) {
      return res.status(410).json({ success: false, message: 'Attachment file missing from storage' });
    }

    res.setHeader('Content-Type', attachment.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalName}"`);

    const readStream = fs.createReadStream(absolutePath);
    readStream.pipe(res);
  } catch (error) {
    console.error('Download attachment error:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to download attachment'
    });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, assignee, team, status, priority, dueDate, tags } = req.body;

    if (!title || !team) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and team are required' 
      });
    }

    // Verify team exists and user is a member
    const teamDoc = await Team.findById(team);
    if (!teamDoc) {
      return res.status(404).json({ 
        success: false, 
        message: 'Team not found' 
      });
    }

    if (!teamDoc.members.includes(req.user._id)) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not a member of this team' 
      });
    }

    // Verify assignee is a team member
    if (assignee && !teamDoc.members.includes(assignee)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Assignee must be a team member' 
      });
    }

    const task = new Task({
      title,
      description: description || '',
      createdBy: req.user._id,
      assignee: assignee || null,
      team,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: tags || []
    });

    await task.save();

    await recordTaskActivity({
      taskId: task._id,
      teamId: team,
      actorId: req.user._id,
      action: 'task_created',
      metadata: {
        status: task.status,
        priority: task.priority,
        assignee: assignee || null
      }
    });

    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'name email')
      .populate('assignee', 'name email')
      .populate('team', 'name color');

    // Create notification for assignee
    if (assignee && assignee !== req.user._id.toString()) {
      const notification = new Notification({
        user: assignee,
        actor: req.user._id,
        task: task._id,
        type: 'assignment',
        message: `${req.user.name} assigned you a task: "${title}"`,
        link: `/tasks/${task._id}`
      });
      await notification.save();

      // Send email notification
      const assigneeUser = await User.findById(assignee);
      if (assigneeUser) {
        await sendEmail(
          assigneeUser.email,
          `New Task Assigned: ${title}`,
          emailTemplates.taskAssignment(title, req.user.name, dueDate || new Date())
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: populatedTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error creating task' 
    });
  }
});

// @route   GET /api/tasks/activity/feed
// @desc    Get recent task activity for user's teams
// @access  Private
router.get('/activity/feed', authMiddleware, async (req, res) => {
  try {
    const { limit = 25 } = req.query;
    const user = await User.findById(req.user._id).populate('teams');
    const userTeamIds = user.teams.map(t => t._id);

    const activities = await TaskActivity.find({ team: { $in: userTeamIds } })
      .sort({ createdAt: -1 })
      .limit(Math.min(parseInt(limit, 10) || 25, 100))
      .populate('task', 'title status priority assignee')
      .populate('team', 'name color')
      .populate('actor', 'name email role avatar');

    res.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('Get activity feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching activity feed'
    });
  }
});

// @route   GET /api/tasks
// @desc    Get tasks (with filters)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { team, status, assignee, priority, search } = req.query;

    // Build query
    let query = {};

    // Get user's teams
    const user = await User.findById(req.user._id).populate('teams');
    const userTeamIds = user.teams.map(t => t._id);

    // Filter by team
    if (team) {
      query.team = team;
    } else {
      // Show tasks from all user's teams
      query.team = { $in: userTeamIds };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by assignee
    if (assignee) {
      query.assignee = assignee;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email')
      .populate('assignee', 'name email')
      .populate('team', 'name color')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching tasks' 
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignee', 'name email')
      .populate('team', 'name color members');

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    // Check if user is a team member
    if (!task.team.members.includes(req.user._id)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching task' 
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name');

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    // Verify user is team member
    const team = await Team.findById(task.team);
    if (!team.members.includes(req.user._id)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    const { title, description, assignee, status, priority, dueDate, tags } = req.body;

    const oldStatus = task.status;
    const oldAssignee = task.assignee ? task.assignee._id?.toString() || task.assignee.toString() : null;
    const oldPriority = task.priority;

    // Update fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignee !== undefined) task.assignee = assignee;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (tags) task.tags = tags;

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'name email')
      .populate('assignee', 'name email')
      .populate('team', 'name color');

    // Create notification for status change
    if (status && status !== oldStatus && task.assignee) {
      const notification = new Notification({
        user: task.assignee._id,
        actor: req.user._id,
        task: task._id,
        type: 'status_change',
        message: `Task "${task.title}" status changed from ${oldStatus} to ${status}`,
        link: `/tasks/${task._id}`
      });
      await notification.save();

      // Send email
      if (task.assignee.email) {
        await sendEmail(
          task.assignee.email,
          `Task Status Updated: ${task.title}`,
          emailTemplates.statusChange(task.title, oldStatus, status, req.user.name)
        );
      }
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      task: populatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating task' 
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    // Only creator or admin can delete
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only task creator can delete this task' 
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Delete related notifications
    await Notification.deleteMany({ task: req.params.id });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error deleting task' 
    });
  }
});

// @route   GET /api/tasks/stats/dashboard
// @desc    Get task statistics for dashboard
// @access  Private
router.get('/stats/dashboard', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('teams');
    const userTeamIds = user.teams.map(t => t._id);

    // Get task counts by status
    const taskStats = await Task.aggregate([
      { $match: { team: { $in: userTeamIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get tasks assigned to user
    const myTasks = await Task.countDocuments({
      assignee: req.user._id,
      status: { $ne: 'completed' }
    });

    // Get overdue tasks
    const overdueTasks = await Task.countDocuments({
      team: { $in: userTeamIds },
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' }
    });

    const historyStart = new Date();
    historyStart.setDate(historyStart.getDate() - 6);

    const statusHistoryRaw = await TaskActivity.aggregate([
      {
        $match: {
          team: { $in: userTeamIds },
          action: 'status_changed',
          createdAt: { $gte: historyStart }
        }
      },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.day': 1 } }
    ]);

    const statusHistory = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(historyStart.getTime());
      date.setDate(historyStart.getDate() + index);
      const key = date.toISOString().slice(0, 10);
      const entry = statusHistoryRaw.find(item => item._id.day === key);
      return {
        date: key,
        count: entry ? entry.count : 0
      };
    });

    res.json({
      success: true,
      stats: {
        byStatus: taskStats,
        myTasks,
        overdueTasks,
        statusHistory
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching stats' 
    });
  }
});

// @route   POST /api/tasks/test-email-notifications
// @desc    Manually trigger email notifications check (for testing)
// @access  Private
router.post('/test-email-notifications', authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    
    // Find overdue tasks assigned to the current user
    const overdueTasks = await Task.find({
      assignee: req.user._id,
      dueDate: { $lt: now },
      status: { $ne: 'completed' }
    });

    // Find upcoming tasks (within 24 hours)
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const upcomingTasks = await Task.find({
      assignee: req.user._id,
      dueDate: { $gte: now, $lte: next24Hours },
      status: { $ne: 'completed' }
    });

    const results = {
      overdue: [],
      upcoming: []
    };

    // Send overdue emails
    for (const task of overdueTasks) {
      const daysOverdue = Math.ceil((now - task.dueDate) / (1000 * 60 * 60 * 24));
      const emailResult = await sendEmail(
        req.user.email,
        `🚨 URGENT: Task "${task.title}" is Overdue`,
        emailTemplates.taskOverdue(task.title, daysOverdue)
      );
      results.overdue.push({
        task: task.title,
        daysOverdue,
        emailSent: emailResult.success,
        error: emailResult.error || emailResult.message
      });
    }

    // Send upcoming deadline emails
    for (const task of upcomingTasks) {
      const hoursLeft = Math.round((task.dueDate - now) / (1000 * 60 * 60));
      const emailResult = await sendEmail(
        req.user.email,
        `Reminder: Task "${task.title}" due soon`,
        emailTemplates.deadlineReminder(task.title, hoursLeft)
      );
      results.upcoming.push({
        task: task.title,
        hoursLeft,
        emailSent: emailResult.success,
        error: emailResult.error || emailResult.message
      });
    }

    res.json({
      success: true,
      message: 'Email notification test completed',
      results,
      emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error testing emails',
      error: error.message
    });
  }
});

export default router;
