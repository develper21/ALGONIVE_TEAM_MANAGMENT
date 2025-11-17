# 📧 Email Notification Testing Guide

## ✅ What's Been Fixed

### 1. **Overdue Task Notifications** 🚨
- Added automatic email alerts for overdue tasks
- System now checks every 10 minutes for tasks past their deadline
- Sends urgent email notifications with red styling

### 2. **Enhanced Email System**
- ✅ Deadline reminders (24 hours before due)
- ✅ Overdue task alerts (for tasks past deadline)
- ✅ Task assignment notifications
- ✅ Status change notifications

### 3. **New Features**
- Added `overdue` notification type
- Improved email templates with better styling
- Better error logging for email debugging
- Manual test endpoint for immediate testing

---

## 🔧 Setup Requirements

### 1. **Environment Variables** (backend/.env)
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

### 2. **Gmail App Password Setup**
1. Go to Google Account: https://myaccount.google.com/
2. Security → 2-Step Verification (enable if not already)
3. Security → App passwords
4. Generate new app password for "Mail"
5. Copy the 16-character password
6. Paste in `EMAIL_PASS` in backend/.env

---

## 🧪 Testing Methods

### Method 1: Manual Test Endpoint (Immediate)

**Use this to test emails right away without waiting!**

1. **Login to your account** on http://localhost:5173

2. **Create a task with past due date:**
   - Go to Dashboard
   - Click "New Task"
   - Set due date to yesterday or any past date
   - Assign to yourself
   - Save

3. **Trigger email test via API:**

Open a new terminal and run:

```bash
# Windows PowerShell
$token = "YOUR_JWT_TOKEN_HERE"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
Invoke-RestMethod -Uri "http://localhost:5000/api/tasks/test-email-notifications" -Method POST -Headers $headers
```

**OR use browser console:**

```javascript
// Open browser console (F12) while logged in
fetch('http://localhost:5000/api/tasks/test-email-notifications', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log(data));
```

4. **Check your email inbox** - You should receive overdue task alerts!

---

### Method 2: Automatic Cron Job (Every 10 Minutes)

The system automatically checks for overdue and upcoming tasks every 10 minutes.

1. **Create overdue task** (as above)
2. **Wait up to 10 minutes**
3. **Check backend console** for logs:
   ```
   Running overdue task check...
   Found X overdue tasks
   ✅ Overdue alert sent for task: [Task Name] to [email]
   ```
4. **Check email inbox**

---

### Method 3: Restart Server (Immediate Check)

The cron job runs once on server startup:

1. **Stop backend server** (Ctrl+C)
2. **Restart:** `npm run dev`
3. **Watch console logs** for email sending confirmation
4. **Check email**

---

## 📊 Understanding Email Types

### 1. **Overdue Alert** 🚨
- **When:** Task deadline has passed
- **Frequency:** Once per day per task
- **Subject:** "🚨 URGENT: Task [name] is Overdue"
- **Color:** Red

### 2. **Deadline Reminder** ⏰
- **When:** Task due within 24 hours
- **Frequency:** Every 6 hours
- **Subject:** "Reminder: Task [name] due soon"
- **Color:** Orange/Yellow

### 3. **Task Assignment** 📋
- **When:** New task assigned to you
- **Frequency:** Once per assignment
- **Subject:** "New Task Assigned"
- **Color:** Blue

### 4. **Status Change** ✅
- **When:** Task status updated
- **Frequency:** Per status change
- **Subject:** "Task Status Updated"
- **Color:** Green

---

## 🔍 Debugging Email Issues

### Check 1: Environment Variables Loaded
```bash
# In backend directory
node -e "require('dotenv').config(); console.log('EMAIL_USER:', process.env.EMAIL_USER); console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');"
```

### Check 2: Backend Console Logs
Look for these messages:
- ✅ `Email sent: <message-id>` - Success!
- ❌ `Email credentials not configured` - Check .env
- ❌ `Error sending email: Invalid login` - Wrong app password
- ❌ `Error sending email: EAUTH` - Authentication failed

### Check 3: Gmail Security
- Ensure 2-Step Verification is ON
- Use App Password, NOT your regular Gmail password
- Check if Gmail blocked the login attempt

### Check 4: Test Email Service Directly
Create a test file `test-email.js`:

```javascript
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: 'Test Email',
  html: '<h1>Email is working!</h1>'
}, (err, info) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Success:', info.messageId);
  }
});
```

Run: `node test-email.js`

---

## 📝 Common Issues & Solutions

### Issue 1: "Email credentials not configured"
**Solution:** Create `backend/.env` file with EMAIL_USER and EMAIL_PASS

### Issue 2: "Invalid login: 535-5.7.8 Username and Password not accepted"
**Solution:** 
- Use App Password, not regular password
- Regenerate App Password
- Enable 2-Step Verification first

### Issue 3: No emails received
**Solution:**
- Check spam/junk folder
- Verify email address is correct
- Check backend console for error messages
- Try manual test endpoint first

### Issue 4: Emails sent but not received
**Solution:**
- Gmail may delay emails (wait 1-2 minutes)
- Check "All Mail" folder in Gmail
- Verify recipient email matches your login email

---

## ✨ Quick Test Checklist

- [ ] Backend .env file has EMAIL_USER and EMAIL_PASS
- [ ] Gmail App Password generated (16 characters)
- [ ] Backend server running
- [ ] Frontend running
- [ ] Logged in to application
- [ ] Created task with past due date
- [ ] Task assigned to yourself
- [ ] Triggered manual test OR waited 10 minutes
- [ ] Checked backend console for success logs
- [ ] Checked email inbox (and spam)

---

## 🎯 Expected Results

When everything works correctly:

1. **Backend Console:**
```
Running overdue task check...
Found 1 overdue tasks
✅ Overdue alert sent for task: Complete Project Report to user@gmail.com
```

2. **Email Inbox:**
- Subject: "🚨 URGENT: Task 'Complete Project Report' is Overdue"
- Beautiful HTML email with red styling
- Shows days overdue
- Link to dashboard

3. **Notification Panel:**
- Red alert icon 🚨
- "Task 'Complete Project Report' is overdue by X day(s)"

---

## 📞 Need Help?

If emails still don't work after following this guide:

1. Share backend console logs
2. Confirm EMAIL_USER and EMAIL_PASS are set (don't share actual values)
3. Try the test-email.js script
4. Check if other apps can send email from your Gmail

---

**Happy Testing! 🎉**
