const express = require("express");
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
} = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all notifications
router.get("/", getNotifications);

// Get unread count
router.get("/unread-count", getUnreadCount);

// Mark all as read
router.put("/mark-all-read", markAllAsRead);

// Mark single notification as read
router.put("/:notificationId/read", markAsRead);

// Delete a notification
router.delete("/:notificationId", deleteNotification);

// Clear all read notifications
router.delete("/clear-read", clearReadNotifications);

module.exports = router;
