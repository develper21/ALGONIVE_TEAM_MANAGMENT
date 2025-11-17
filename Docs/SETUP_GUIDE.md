# 🚀 Quick Setup Guide

## Step-by-Step Installation

### 1️⃣ Backend Setup (5 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
# Copy from .env.example and fill in your values:
# - MONGODB_URL: Your MongoDB Atlas connection string
# - JWT_SECRET: Any random secret string (e.g., "mySecretKey123")
# - EMAIL_USER: Your Gmail address (optional for testing)
# - EMAIL_PASS: Your Gmail app password (optional for testing)

# Start the backend server
npm start
```

**Backend should now be running on http://localhost:5000**

### 2️⃣ Frontend Setup (3 minutes)

Open a **new terminal** and run:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file (optional - defaults to localhost:5000)
# Add: VITE_API_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev
```

**Frontend should now be running on http://localhost:5173**

### 3️⃣ First Time Usage

1. **Open browser** → http://localhost:5173
2. **Click "Create Account"**
3. **Fill in your details** (name, email, password)
4. **Login** with your credentials
5. **Create your first team**
6. **Add team members** (they need to signup first)
7. **Create tasks** and start managing!

---

## 🔑 MongoDB Atlas Setup (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a **FREE cluster** (M0 Sandbox)
4. Click **"Connect"** → **"Connect your application"**
5. Copy the connection string
6. Replace `<password>` with your database password
7. Paste into `MONGODB_URL` in backend `.env`


---

## 📧 Email Setup (Optional - For Reminders)

### Using Gmail:

1. **Enable 2-Factor Authentication** on your Gmail
2. Go to **Google Account** → **Security** → **2-Step Verification**
3. Scroll down to **"App passwords"**
4. Select **"Mail"** and **"Windows Computer"**
5. Click **"Generate"**
6. Copy the 16-character password
7. Add to `.env`:
   ```
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

**Note:** Email is optional. The app works fine without it, you just won't receive email reminders.

---

## ✅ Verification

### Check Backend:
- Open http://localhost:5000/api/health
- Should see: `{"success": true, "message": "Task Manager API is running"}`

### Check Frontend:
- Open http://localhost:5173
- Should see the login page

### Check Database Connection:
- Backend terminal should show: `✅ Connected to MongoDB Atlas`

---

## 🐛 Common Issues

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in backend/.env
PORT=5001
```

### MongoDB Connection Failed
- Check if IP is whitelisted (use 0.0.0.0/0 for testing)
- Verify username and password
- Check connection string format

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check CORS settings in backend/server.js
- Verify VITE_API_URL in frontend/.env

---

## 🎯 Test Accounts (After Setup)

Create these test accounts to try the app:

**Admin User:**
- Name: Admin User
- Email: admin@test.com
- Password: admin123
- Role: Admin

**Team Member:**
- Name: John Doe
- Email: john@test.com
- Password: john123
- Role: Member

---

## 📱 Features to Try

1. ✅ **Dashboard** - View task statistics
2. ✅ **Create Team** - Add your first team
3. ✅ **Add Members** - Invite team members by email
4. ✅ **Create Task** - Assign tasks with priorities
5. ✅ **Kanban Board** - Visual task management
6. ✅ **Notifications** - Check the bell icon
7. ✅ **Update Status** - Move tasks through workflow
8. ✅ **Search & Filter** - Find tasks quickly

---

## 🚀 Ready to Deploy?

See the main **README.md** for deployment instructions to:
- **Backend:** Render, Railway, or Heroku
- **Frontend:** Vercel or Netlify
- **Database:** MongoDB Atlas (already cloud-based)

---

**Need Help?** Check the main README.md or create an issue!

Happy Task Managing! 🎉
