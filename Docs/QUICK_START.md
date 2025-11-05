# Quick Start Guide - Algonive Team Management

## 🚀 Quick Setup (5 Minutes)

### Step 1: Configure Environment Variables

Create a `.env` file in the `/server` directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` and add your values:

```env
PORT=8000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/algonive
JWT_SECRET=your_super_secret_jwt_key_here
ADMIN_INVITE_TOKEN=123456
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ui
npm install
```

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server will start on: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd ui
npm run dev
```
Frontend will start on: http://localhost:5173

### Step 4: Create Your First Admin Account

1. Open http://localhost:5173/signup
2. Fill in your details
3. Enter Admin Invite Token: `123456` (or whatever you set in .env)
4. Click "Sign Up"

---

## 🎯 Testing the Application

### Test CORS Fix
1. Open browser console (F12)
2. Try to login or signup
3. You should NOT see any CORS errors
4. Notifications should appear on success/error

### Test Security Features
1. Try rapid login attempts → Should be rate limited after 5 attempts
2. Try invalid email format → Should show validation error
3. Try short password (< 8 chars) → Should show validation error

### Test Notifications
1. **Login Page**: Success/error notifications
2. **Signup Page**: Success/error notifications
3. **Dashboard**: Error notifications if data fetch fails
4. **Create Task**: Success on create, error on validation failure
5. **Manage Tasks**: Success on download, error on fetch failure
6. **Task Details**: Success on checklist update

---

## 🔑 Default Credentials

After creating your admin account, you can create member accounts:
- Members don't need the Admin Invite Token
- Leave the "Admin Invite Token" field empty for member registration

---

## 🐛 Troubleshooting

### CORS Errors Still Appearing?
1. Check `.env` file has `CLIENT_URL=http://localhost:5173`
2. Restart the backend server
3. Clear browser cache

### Rate Limit Errors?
- Wait 15 minutes or restart the server
- This is normal security behavior

### Database Connection Error?
1. Make sure MongoDB is running
2. Check `MONGO_URI` in `.env`
3. For local MongoDB: `mongodb://localhost:27017/algonive`
4. For MongoDB Atlas: Use your connection string

### Notifications Not Showing?
1. Check browser console for errors
2. Make sure `NotificationProvider` is wrapping the app
3. Clear browser cache and reload

---

## 📱 Features to Test

### Admin Features
- ✅ Create tasks
- ✅ Assign tasks to users
- ✅ View all tasks
- ✅ Manage users
- ✅ Download reports
- ✅ Delete tasks

### Member Features
- ✅ View assigned tasks
- ✅ Update task status
- ✅ Update checklist items
- ✅ View task details
- ✅ Track progress

---

## 🎨 UI Features

### Notification Types
- **Success** (Green): Task created, updated, deleted
- **Error** (Red): Validation errors, network errors
- **Info** (Blue): General information
- **Warning** (Yellow): Warnings

### Notification Locations
- Top-right corner
- Auto-dismiss after 3 seconds
- Click X to dismiss manually

---

## 🔐 Security Features Active

1. ✅ CORS Protection
2. ✅ Rate Limiting (5 login attempts per 15 min)
3. ✅ Input Validation
4. ✅ XSS Protection
5. ✅ NoSQL Injection Prevention
6. ✅ Secure Headers (Helmet)
7. ✅ JWT Authentication
8. ✅ Password Hashing (bcrypt)

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (filtered by role)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task (admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (admin only)
- `PUT /api/tasks/:id/status` - Update task status
- `PUT /api/tasks/:id/todo` - Update checklist

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID

### Reports
- `GET /api/reports/export/tasks` - Download tasks report
- `GET /api/reports/export/users` - Download users report

---

## 💡 Tips

1. **Admin Token**: Keep your `ADMIN_INVITE_TOKEN` secret
2. **JWT Secret**: Use a strong, random string for `JWT_SECRET`
3. **Production**: Change all secrets before deploying
4. **MongoDB**: Use MongoDB Atlas for production
5. **Environment**: Never commit `.env` file to git

---

## 🎉 You're All Set!

Your application is now:
- ✅ Secure from common attacks
- ✅ User-friendly with notifications
- ✅ Properly validated
- ✅ Ready for development

Happy coding! 🚀
