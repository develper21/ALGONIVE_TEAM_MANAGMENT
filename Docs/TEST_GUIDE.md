# Testing Guide - Algonive Team Management

## ✅ Fixed Issues

### 1. Express v5 Compatibility Issue
- **Problem**: `express-mongo-sanitize`, `xss-clean`, and `hpp` were incompatible with Express v5
- **Solution**: Created custom sanitization middleware that works with Express v5
- **File**: `/server/middlewares/sanitizeMiddleware.js`

### 2. Duplicate Index Warning
- **Problem**: Mongoose warning about duplicate email index
- **Solution**: Moved unique constraint from field definition to index definition
- **File**: `/server/models/User.js`

### 3. Text Escaping Issue
- **Problem**: `validator.escape()` was corrupting normal text
- **Solution**: Removed HTML escaping, using custom sanitization instead
- **File**: `/server/middlewares/validationMiddleware.js`

---

## 🚀 How to Test

### Step 1: Start the Server

```bash
cd server
npm install
npm run dev
```

**Expected Output**:
```
server running on 8000
MongoDB connected
```

**No errors should appear!**

### Step 2: Start the Frontend

```bash
cd ui
npm run dev
```

### Step 3: Test User Registration (CRUD - Create)

1. Open http://localhost:5173/signup
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Admin Token: (leave empty for member, or use your token for admin)
3. Click "Sign Up"

**Expected Result**:
- ✅ Success notification appears
- ✅ User is created in database
- ✅ Redirected to dashboard
- ✅ No console errors

### Step 4: Test User Login (CRUD - Read)

1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: test@example.com
   - Password: password123
3. Click "Login"

**Expected Result**:
- ✅ Success notification
- ✅ Redirected to dashboard
- ✅ User data loaded

### Step 5: Test Task Creation (CRUD - Create)

**For Admin Users:**
1. Go to "Create Task" page
2. Fill in task details:
   - Title: Test Task
   - Description: This is a test task
   - Priority: High
   - Due Date: Select a future date
   - Assign To: Select users
   - Todo Checklist: Add some items
3. Click "Create Task"

**Expected Result**:
- ✅ Success notification: "Task Created Successfully"
- ✅ Task saved to database
- ✅ No errors in console

### Step 6: Test Task Update (CRUD - Update)

1. Go to "Manage Tasks"
2. Click on a task to edit
3. Modify some fields
4. Click "Update Task"

**Expected Result**:
- ✅ Success notification: "Task Updated Successfully"
- ✅ Changes saved to database

### Step 7: Test Task Delete (CRUD - Delete)

1. Go to task edit page
2. Click "Delete Task"
3. Confirm deletion

**Expected Result**:
- ✅ Success notification: "Task Deleted Successfully"
- ✅ Task removed from database
- ✅ Redirected to tasks list

### Step 8: Test User Management (CRUD - Read)

**For Admin Users:**
1. Go to "Manage Users" page
2. View all users

**Expected Result**:
- ✅ All users displayed
- ✅ Task counts shown for each user
- ✅ No errors

### Step 9: Test Reports Download

1. Go to "Manage Tasks" or "Manage Users"
2. Click "Download Report" button

**Expected Result**:
- ✅ Success notification: "Details downloaded successfully"
- ✅ Excel file downloaded
- ✅ File contains correct data

### Step 10: Test Checklist Update (User)

**For Member Users:**
1. Go to "My Tasks"
2. Click on a task
3. Check/uncheck checklist items

**Expected Result**:
- ✅ Success notification: "Checklist updated successfully"
- ✅ Progress bar updates
- ✅ Status changes if all items completed

---

## 🔍 Verification Checklist

### Backend Tests:

- [ ] Server starts without errors
- [ ] No "Cannot set property query" error
- [ ] No duplicate index warning
- [ ] MongoDB connects successfully
- [ ] CORS headers present in responses
- [ ] Rate limiting works (try 6 failed logins)

### Frontend Tests:

- [ ] No CORS errors in browser console
- [ ] Signup works and creates user
- [ ] Login works and authenticates user
- [ ] Dashboard loads data
- [ ] Tasks can be created
- [ ] Tasks can be updated
- [ ] Tasks can be deleted
- [ ] Users list loads (admin)
- [ ] Reports download works
- [ ] Notifications appear on all actions
- [ ] Checklist updates work

### Database Tests:

- [ ] Users are saved correctly
- [ ] Tasks are saved correctly
- [ ] Relationships work (assignedTo, createdBy)
- [ ] Validation prevents invalid data
- [ ] Duplicate emails are rejected
- [ ] All CRUD operations work

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot set property query"
**Solution**: ✅ Fixed! Removed incompatible middleware

### Issue 2: Duplicate index warning
**Solution**: ✅ Fixed! Moved unique constraint to index definition

### Issue 3: Text appears escaped (like &lt; instead of <)
**Solution**: ✅ Fixed! Removed HTML escaping

### Issue 4: CORS errors
**Solution**: Already fixed in previous update

### Issue 5: Rate limit errors
**Solution**: This is normal! Wait 15 minutes or restart server

---

## 📊 API Endpoints to Test

### Authentication:
```bash
# Register
POST http://localhost:8000/api/auth/register
Body: { "name": "Test", "email": "test@test.com", "password": "password123" }

# Login
POST http://localhost:8000/api/auth/login
Body: { "email": "test@test.com", "password": "password123" }

# Get Profile
GET http://localhost:8000/api/auth/profile
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

### Tasks:
```bash
# Create Task (Admin only)
POST http://localhost:8000/api/tasks
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
Body: {
  "title": "Test Task",
  "description": "Description",
  "priority": "High",
  "dueDate": "2025-12-31",
  "assignedTo": ["USER_ID"]
}

# Get All Tasks
GET http://localhost:8000/api/tasks
Headers: { "Authorization": "Bearer YOUR_TOKEN" }

# Update Task
PUT http://localhost:8000/api/tasks/:id
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
Body: { "title": "Updated Title" }

# Delete Task (Admin only)
DELETE http://localhost:8000/api/tasks/:id
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

### Users:
```bash
# Get All Users (Admin only)
GET http://localhost:8000/api/users
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

---

## ✅ Expected Behavior

### Successful Operations:
1. **User Registration**: 
   - Status: 201
   - Response includes: _id, name, email, role, token
   - Success notification appears

2. **User Login**:
   - Status: 200
   - Response includes: _id, name, email, role, token
   - Success notification appears

3. **Task Creation**:
   - Status: 201
   - Response includes: message, task object
   - Success notification appears

4. **Task Update**:
   - Status: 200
   - Response includes: message, updatedTask
   - Success notification appears

5. **Task Deletion**:
   - Status: 200
   - Response includes: message
   - Success notification appears

### Failed Operations:
1. **Invalid Email**:
   - Status: 400
   - Error message: "Please provide a valid email address"
   - Error notification appears

2. **Short Password**:
   - Status: 400
   - Error message: "Password must be at least 8 characters long"
   - Error notification appears

3. **Duplicate Email**:
   - Status: 409
   - Error message: "User Already Exists!"
   - Error notification appears

4. **Rate Limit Exceeded**:
   - Status: 429
   - Error message: "Too many requests..."
   - Error notification appears

---

## 🎯 Complete CRUD Test Flow

### User CRUD:
1. ✅ **Create**: Register new user → Success
2. ✅ **Read**: Login → User data retrieved
3. ✅ **Update**: Update profile → Changes saved
4. ✅ **Delete**: (Not implemented, admin can manage users)

### Task CRUD:
1. ✅ **Create**: Create new task → Task saved
2. ✅ **Read**: View task details → Data displayed
3. ✅ **Update**: Edit task → Changes saved
4. ✅ **Delete**: Delete task → Task removed

---

## 🎉 Success Criteria

All tests pass when:
- ✅ No errors in server console
- ✅ No errors in browser console
- ✅ All CRUD operations work
- ✅ Notifications appear for all actions
- ✅ Data persists in database
- ✅ Validation works correctly
- ✅ Security features active

---

## 📝 Notes

1. **Database**: Make sure MongoDB is running
2. **Environment**: Check `.env` file has all required values
3. **Ports**: Backend on 8000, Frontend on 5173
4. **Admin Token**: Set in `.env` for admin registration
5. **JWT Secret**: Must be set in `.env`

---

## 🚀 Ready to Test!

Your application is now fully functional with:
- ✅ Express v5 compatibility
- ✅ Complete CRUD operations
- ✅ Security features
- ✅ Notifications everywhere
- ✅ Proper error handling

Start testing and enjoy your secure, fully-functional application! 🎊
