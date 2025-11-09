# Chat & Notification System Documentation

## 🎉 Features Implemented

### 1. **Project-Based Discussion System** 💬
- GitHub-style discussion for each task/project
- Real-time messaging between team members and admin
- Message history with timestamps
- Delete own messages (or admin can delete any)
- Auto-scroll to latest messages
- Character limit: 2000 characters per message

### 2. **Smart Notification System** 🔔
- Bell icon in navbar with unread count badge
- Real-time notification updates (every 30 seconds)
- Dropdown with latest 10 notifications
- Click notification to navigate to task
- Mark individual or all notifications as read
- Delete notifications
- Different notification types:
  - 💬 New message in task
  - 📋 Task assigned
  - 🔄 Task updated
  - ✅ Task completed

---

## 📁 Backend Files Created

### Models
1. **`/server/models/Message.js`**
   - Stores all chat messages
   - Links to task and sender
   - Tracks read status
   - Indexes for fast queries

2. **`/server/models/Notification.js`**
   - Stores all notifications
   - Multiple notification types
   - Read/unread tracking
   - Links to tasks and messages

### Controllers
3. **`/server/controllers/messageController.js`**
   - `sendMessage()` - Send message and create notifications
   - `getTaskMessages()` - Fetch all messages for a task
   - `getUnreadCount()` - Get unread message count
   - `deleteMessage()` - Delete message (own or admin)

4. **`/server/controllers/notificationController.js`**
   - `getNotifications()` - Get all notifications with pagination
   - `getUnreadCount()` - Get unread notification count
   - `markAsRead()` - Mark single notification as read
   - `markAllAsRead()` - Mark all as read
   - `deleteNotification()` - Delete single notification
   - `clearReadNotifications()` - Clear all read notifications

### Routes
5. **`/server/routes/messageRoutes.js`**
   - `POST /api/messages` - Send message
   - `GET /api/messages/:taskId` - Get task messages
   - `GET /api/messages/:taskId/unread-count` - Unread count
   - `DELETE /api/messages/:messageId` - Delete message

6. **`/server/routes/notificationRoutes.js`**
   - `GET /api/notifications` - Get all notifications
   - `GET /api/notifications/unread-count` - Unread count
   - `PUT /api/notifications/mark-all-read` - Mark all read
   - `PUT /api/notifications/:id/read` - Mark one read
   - `DELETE /api/notifications/:id` - Delete one
   - `DELETE /api/notifications/clear-read` - Clear read

---

## 🎨 Frontend Files Created

### Components
7. **`/ui/src/components/NotificationBell.jsx`**
   - Bell icon with unread badge
   - Dropdown with notifications list
   - Click to navigate to task
   - Mark as read functionality
   - Delete notifications
   - Auto-refresh every 30 seconds

8. **`/ui/src/components/TaskDiscussion.jsx`**
   - Chat interface for each task
   - Send/receive messages
   - Real-time updates (polls every 10 seconds)
   - Delete own messages
   - Sender avatars and names
   - Admin badge for admin users
   - Timestamp formatting
   - Character counter

### Updated Files
9. **`/ui/src/components/layouts/Navbar.jsx`**
   - Added NotificationBell component
   - Positioned in top-right corner

10. **`/ui/src/pages/User/ViewTaskDetails.jsx`**
    - Added TaskDiscussion panel
    - 3-column layout (task details + discussion)
    - Responsive design

11. **`/ui/src/utils/apiPaths.js`**
    - Added MESSAGES API paths
    - Added NOTIFICATIONS API paths

12. **`/server/server.js`**
    - Registered message routes
    - Registered notification routes

---

## 🚀 How It Works

### For Members (Employees):
1. **Open any task** from "My Tasks"
2. **See discussion panel** on the right side
3. **Type message** and click "Send" or press Enter
4. **Admin gets notification** automatically
5. **View notifications** by clicking bell icon in navbar

### For Admin:
1. **Bell icon shows unread count** in navbar
2. **Click bell** to see all notifications
3. **Click notification** to go to that task
4. **Reply in discussion** panel
5. **Member gets notification** automatically

### Notification Flow:
```
Member sends message → 
  Creates notification for admin → 
    Admin sees bell badge → 
      Admin clicks notification → 
        Opens task with discussion → 
          Admin replies → 
            Member gets notification
```

---

## 🔐 Security Features

1. **Authentication Required**: All routes protected with JWT
2. **Access Control**: 
   - Only assigned users + admin can view task messages
   - Only sender or admin can delete messages
3. **Input Validation**:
   - Message length: max 2000 characters
   - XSS protection via sanitization middleware
4. **Rate Limiting**: Applied to all API routes

---

## 📊 Database Schema

### Message Collection
```javascript
{
  taskId: ObjectId (ref: Task),
  sender: ObjectId (ref: User),
  content: String (max 2000 chars),
  isRead: Boolean,
  readBy: [{
    userId: ObjectId,
    readAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Collection
```javascript
{
  recipient: ObjectId (ref: User),
  sender: ObjectId (ref: User),
  type: String (enum: message, task_assigned, etc.),
  title: String,
  message: String,
  taskId: ObjectId (ref: Task),
  messageId: ObjectId (ref: Message),
  isRead: Boolean,
  readAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 API Endpoints Summary

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages` | Send a message |
| GET | `/api/messages/:taskId` | Get all messages for task |
| GET | `/api/messages/:taskId/unread-count` | Get unread count |
| DELETE | `/api/messages/:messageId` | Delete a message |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get all notifications |
| GET | `/api/notifications/unread-count` | Get unread count |
| PUT | `/api/notifications/mark-all-read` | Mark all as read |
| PUT | `/api/notifications/:id/read` | Mark one as read |
| DELETE | `/api/notifications/:id` | Delete one |
| DELETE | `/api/notifications/clear-read` | Clear all read |

---

## 🧪 Testing Instructions

### Test Chat System:
1. Login as member (employee)
2. Go to "My Tasks"
3. Click on any task
4. See discussion panel on right
5. Type message and send
6. Login as admin in another browser
7. Check bell icon - should show notification
8. Click notification to open task
9. Reply to message
10. Check member's notifications

### Test Notification System:
1. Login as admin
2. Create a new task and assign to member
3. Member should get "task_assigned" notification
4. Member updates task status
5. Admin should get "task_updated" notification
6. Click "Mark all as read"
7. Badge should disappear

---

## 🎨 UI Features

### NotificationBell Component:
- ✅ Red badge with unread count
- ✅ Filled bell icon when unread
- ✅ Smooth dropdown animation
- ✅ Notification icons by type
- ✅ Relative timestamps (e.g., "5m ago")
- ✅ Click to navigate
- ✅ Delete button per notification
- ✅ "Mark all read" button

### TaskDiscussion Component:
- ✅ Clean chat interface
- ✅ Message bubbles (blue for own, white for others)
- ✅ Sender avatars and names
- ✅ Admin badge
- ✅ Timestamp formatting
- ✅ Delete button on hover
- ✅ Character counter
- ✅ Auto-scroll to bottom
- ✅ Empty state with emoji
- ✅ Loading spinner
- ✅ Shift+Enter for new line

---

## 🔄 Real-time Updates

### Polling Intervals:
- **Notifications**: Refresh every 30 seconds
- **Messages**: Refresh every 10 seconds
- **Unread Count**: Updates on page load and after actions

### Future Enhancement (Optional):
- Implement WebSocket for true real-time updates
- Push notifications for browser
- Sound alerts for new messages

---

## 📱 Responsive Design

- ✅ Mobile-friendly notification dropdown
- ✅ Responsive chat interface
- ✅ Adaptive grid layout for task details
- ✅ Touch-friendly buttons and inputs

---

## 🎉 Summary

**Total Files Created**: 8 new files
**Total Files Modified**: 4 files
**New API Endpoints**: 12 endpoints
**New Database Collections**: 2 collections

**Key Features**:
1. ✅ Project-based chat system
2. ✅ Smart notification system
3. ✅ Real-time updates
4. ✅ Admin & member access control
5. ✅ Beautiful UI with Tailwind CSS
6. ✅ Mobile responsive
7. ✅ GitHub-style discussions

**Ready to Use!** 🚀

Just restart your server and start chatting!
