import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('='.repeat(50));
console.log('📧 Email Configuration Test');
console.log('='.repeat(50));

// Check if credentials are set
console.log('\n1. Checking environment variables...');
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || '❌ NOT SET'}`);
console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ SET (hidden)' : '❌ NOT SET'}`);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log('\n❌ ERROR: Email credentials not configured!');
  console.log('Please add EMAIL_USER and EMAIL_PASS to your .env file');
  process.exit(1);
}

// Create transporter
console.log('\n2. Creating email transporter...');
const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email content
const testEmail = {
  from: `Task Manager <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: '✅ Test Email - Task Manager',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">✅ Email Configuration Successful!</h2>
      <p>Hi there,</p>
      <p>This is a test email from your Task Manager application.</p>
      <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <p style="margin: 0; color: #166534;">
          <strong>Your email system is working correctly!</strong>
        </p>
        <p style="margin: 10px 0 0 0; color: #166534; font-size: 14px;">
          You will now receive notifications for:
        </p>
        <ul style="color: #166534; font-size: 14px;">
          <li>Task assignments</li>
          <li>Deadline reminders (24 hours before)</li>
          <li>Overdue task alerts</li>
          <li>Status changes</li>
        </ul>
      </div>
      <p>Sent at: ${new Date().toLocaleString()}</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 12px;">
        This is an automated test email from Task Manager
      </p>
    </div>
  `
};

// Send test email
console.log('\n3. Sending test email...');
console.log(`   To: ${process.env.EMAIL_USER}`);

transporter.sendMail(testEmail, (error, info) => {
  if (error) {
    console.log('\n❌ ERROR: Failed to send email');
    console.log('Error details:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 TIP: Make sure you are using a Gmail App Password, not your regular password');
      console.log('   1. Go to https://myaccount.google.com/security');
      console.log('   2. Enable 2-Step Verification');
      console.log('   3. Generate an App Password for Mail');
      console.log('   4. Use that 16-character password in EMAIL_PASS');
    }
    
    process.exit(1);
  } else {
    console.log('\n✅ SUCCESS: Email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`\n📬 Check your inbox: ${process.env.EMAIL_USER}`);
    console.log('   (Also check spam/junk folder if you don\'t see it)');
    console.log('\n' + '='.repeat(50));
    console.log('Email configuration is working correctly! 🎉');
    console.log('='.repeat(50));
  }
});
