import cron from 'node-cron';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendEmail, emailTemplates } from './emailService.js';

// Check for overdue tasks
const checkOverdueTasks = async () => {
  try {
    console.log('Running overdue task check...');
    
    const now = new Date();

    // Find tasks that are overdue and not completed
    const overdueTasks = await Task.find({
      dueDate: { $lt: now },
      status: { $ne: 'completed' }
    }).populate('assignee', 'name email').populate('createdBy', 'name');

    console.log(`Found ${overdueTasks.length} overdue tasks`);

    for (const task of overdueTasks) {
      if (!task.assignee) continue;

      // Calculate days overdue
      const daysOverdue = Math.ceil((now - task.dueDate) / (1000 * 60 * 60 * 24));

      // Check if notification already sent recently (within last 24 hours)
      const recentNotification = await Notification.findOne({
        user: task.assignee._id,
        task: task._id,
        type: 'overdue',
        createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
      });

      if (recentNotification) {
        console.log(`Overdue notification already sent for task ${task._id}`);
        continue;
      }

      // Create notification
      const notification = new Notification({
        user: task.assignee._id,
        task: task._id,
        type: 'overdue',
        message: `Task "${task.title}" is overdue by ${daysOverdue} day(s)`,
        link: `/tasks/${task._id}`
      });

      await notification.save();

      // Send email alert
      const emailResult = await sendEmail(
        task.assignee.email,
        `🚨 URGENT: Task "${task.title}" is Overdue`,
        emailTemplates.taskOverdue(task.title, daysOverdue)
      );

      if (emailResult.success) {
        console.log(`✅ Overdue alert sent for task: ${task.title} to ${task.assignee.email}`);
      } else {
        console.log(`❌ Failed to send email for task: ${task.title} - ${emailResult.error || emailResult.message}`);
      }
    }
  } catch (error) {
    console.error('Error in overdue task check:', error);
  }
};

// Check for upcoming task deadlines
const checkUpcomingTasks = async () => {
  try {
    console.log('Running deadline reminder check...');
    
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find tasks due within next 24 hours that are not completed
    const upcomingTasks = await Task.find({
      dueDate: {
        $gte: now,
        $lte: next24Hours
      },
      status: { $ne: 'completed' }
    }).populate('assignee', 'name email').populate('createdBy', 'name');

    console.log(`Found ${upcomingTasks.length} tasks with upcoming deadlines`);

    for (const task of upcomingTasks) {
      if (!task.assignee) continue;

      // Calculate hours left
      const hoursLeft = Math.round((task.dueDate - now) / (1000 * 60 * 60));

      // Check if notification already sent recently (within last 6 hours)
      const recentNotification = await Notification.findOne({
        user: task.assignee._id,
        task: task._id,
        type: 'deadline',
        createdAt: { $gte: new Date(now.getTime() - 6 * 60 * 60 * 1000) }
      });

      if (recentNotification) {
        console.log(`Notification already sent for task ${task._id}`);
        continue;
      }

      // Create notification
      const notification = new Notification({
        user: task.assignee._id,
        task: task._id,
        type: 'deadline',
        message: `Task "${task.title}" is due in ${hoursLeft} hours`,
        link: `/tasks/${task._id}`
      });

      await notification.save();

      // Send email reminder
      const emailResult = await sendEmail(
        task.assignee.email,
        `Reminder: Task "${task.title}" due soon`,
        emailTemplates.deadlineReminder(task.title, hoursLeft)
      );

      if (emailResult.success) {
        console.log(`✅ Reminder sent for task: ${task.title} to ${task.assignee.email}`);
      } else {
        console.log(`❌ Failed to send email for task: ${task.title} - ${emailResult.error || emailResult.message}`);
      }
    }
  } catch (error) {
    console.error('Error in reminder job:', error);
  }
};

// Schedule cron job to run every 10 minutes
export const startReminderJob = () => {
  console.log('Starting reminder cron job (runs every 10 minutes)...');
  
  // Run every 10 minutes - check both upcoming and overdue tasks
  cron.schedule('*/10 * * * *', async () => {
    await checkUpcomingTasks();
    await checkOverdueTasks();
  });
  
  // Also run once on startup
  checkUpcomingTasks();
  checkOverdueTasks();
};
