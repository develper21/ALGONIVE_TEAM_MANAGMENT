const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send task notification email
const sendTaskNotificationEmail = async (userEmail, userName, taskDetails) => {
  try {
    // Skip if email credentials are not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email credentials not configured. Skipping email notification.');
      return { success: false, message: 'Email not configured' };
    }

    const transporter = createTransporter();
    
    const { taskTitle, taskStatus, taskPriority, dueDate, taskId } = taskDetails;
    
    // Determine email subject and content based on task status
    let subject = '';
    let htmlContent = '';
    
    if (taskStatus === 'Pending') {
      subject = `⏳ Task Reminder: ${taskTitle}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Task Pending</h2>
          <p>Hi ${userName},</p>
          <p>You have a pending task that needs your attention:</p>
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${taskTitle}</h3>
            <p><strong>Status:</strong> ${taskStatus}</p>
            <p><strong>Priority:</strong> ${taskPriority}</p>
            <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
          </div>
          <p>Please review and start working on this task.</p>
          <p style="color: #666; font-size: 12px;">This is an automated notification from Algonive Task Manager.</p>
        </div>
      `;
    } else if (taskStatus === 'In Progress') {
      subject = `🚀 Task In Progress: ${taskTitle}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Task In Progress</h2>
          <p>Hi ${userName},</p>
          <p>Your task is currently in progress:</p>
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${taskTitle}</h3>
            <p><strong>Status:</strong> ${taskStatus}</p>
            <p><strong>Priority:</strong> ${taskPriority}</p>
            <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
          </div>
          <p>Keep up the good work! Don't forget to update the task progress.</p>
          <p style="color: #666; font-size: 12px;">This is an automated notification from Algonive Task Manager.</p>
        </div>
      `;
    } else if (taskStatus === 'Completed') {
      subject = `✅ Task Completed: ${taskTitle}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Task Completed!</h2>
          <p>Hi ${userName},</p>
          <p>Congratulations! You have completed the following task:</p>
          <div style="background-color: #d1fae5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${taskTitle}</h3>
            <p><strong>Status:</strong> ${taskStatus}</p>
            <p><strong>Priority:</strong> ${taskPriority}</p>
            <p><strong>Completed On:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>Great job! Keep up the excellent work.</p>
          <p style="color: #666; font-size: 12px;">This is an automated notification from Algonive Task Manager.</p>
        </div>
      `;
    }
    
    // Check for overdue tasks
    const isOverdue = new Date(dueDate) < new Date() && taskStatus !== 'Completed';
    if (isOverdue) {
      subject = `🚨 OVERDUE Task: ${taskTitle}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Task Overdue!</h2>
          <p>Hi ${userName},</p>
          <p>The following task is overdue and requires immediate attention:</p>
          <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <h3 style="margin-top: 0;">${taskTitle}</h3>
            <p><strong>Status:</strong> ${taskStatus}</p>
            <p><strong>Priority:</strong> ${taskPriority}</p>
            <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            <p style="color: #ef4444;"><strong>Days Overdue:</strong> ${Math.ceil((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24))}</p>
          </div>
          <p>Please prioritize this task and update its status as soon as possible.</p>
          <p style="color: #666; font-size: 12px;">This is an automated notification from Algonive Task Manager.</p>
        </div>
      `;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: userEmail,
      subject: subject,
      html: htmlContent,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send task assignment notification
const sendTaskAssignmentEmail = async (userEmail, userName, taskDetails) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email credentials not configured. Skipping email notification.');
      return { success: false, message: 'Email not configured' };
    }

    const transporter = createTransporter();
    const { taskTitle, taskPriority, dueDate, assignedBy } = taskDetails;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: userEmail,
      subject: `📋 New Task Assigned: ${taskTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">New Task Assigned</h2>
          <p>Hi ${userName},</p>
          <p>A new task has been assigned to you by ${assignedBy}:</p>
          <div style="background-color: #ede9fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${taskTitle}</h3>
            <p><strong>Priority:</strong> ${taskPriority}</p>
            <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
          </div>
          <p>Please check your dashboard for more details.</p>
          <p style="color: #666; font-size: 12px;">This is an automated notification from Algonive Task Manager.</p>
        </div>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Task assignment email sent to ${userEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending task assignment email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendTaskNotificationEmail,
  sendTaskAssignmentEmail,
};
