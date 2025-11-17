import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email notification
export const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email credentials not configured. Skipping email send.');
      return { success: false, message: 'Email not configured' };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `Task Manager <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
export const emailTemplates = {
  taskAssignment: (taskTitle, assignerName, dueDate) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">New Task Assigned</h2>
      <p>Hi there,</p>
      <p><strong>${assignerName}</strong> has assigned you a new task:</p>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #1f2937;">${taskTitle}</h3>
        <p style="margin: 0; color: #6b7280;">Due Date: ${new Date(dueDate).toLocaleDateString()}</p>
      </div>
      <p>Log in to your dashboard to view details and start working on it.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Task</a>
    </div>
  `,
  
  deadlineReminder: (taskTitle, hoursLeft) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4444;">⏰ Task Deadline Reminder</h2>
      <p>Hi there,</p>
      <p>This is a reminder that your task is due soon:</p>
      <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
        <h3 style="margin: 0 0 10px 0; color: #991b1b;">${taskTitle}</h3>
        <p style="margin: 0; color: #7f1d1d; font-weight: bold;">Due in ${hoursLeft} hours</p>
      </div>
      <p>Please complete the task before the deadline.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Task</a>
    </div>
  `,
  
  statusChange: (taskTitle, oldStatus, newStatus, changedBy) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Task Status Updated</h2>
      <p>Hi there,</p>
      <p><strong>${changedBy}</strong> has updated the status of a task:</p>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #1f2937;">${taskTitle}</h3>
        <p style="margin: 0; color: #6b7280;">
          Status: <span style="text-decoration: line-through;">${oldStatus}</span> → <strong style="color: #10b981;">${newStatus}</strong>
        </p>
      </div>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Task</a>
    </div>
  `,

  taskOverdue: (taskTitle, daysOverdue) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">🚨 Task Overdue Alert</h2>
      <p>Hi there,</p>
      <p><strong>URGENT:</strong> Your task has passed its deadline and is now overdue!</p>
      <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <h3 style="margin: 0 0 10px 0; color: #991b1b;">${taskTitle}</h3>
        <p style="margin: 0; color: #7f1d1d; font-weight: bold;">⚠️ Overdue by ${daysOverdue} day(s)</p>
      </div>
      <p>Please complete this task as soon as possible or update its status.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Complete Task Now</a>
    </div>
  `
};
