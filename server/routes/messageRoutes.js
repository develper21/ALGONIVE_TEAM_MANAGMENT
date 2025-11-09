const express = require("express");
const {
  sendMessage,
  getTaskMessages,
  getUnreadCount,
  deleteMessage,
} = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

// Send a message
router.post("/", sendMessage);

// Get all messages for a task
router.get("/:taskId", getTaskMessages);

// Get unread message count for a task
router.get("/:taskId/unread-count", getUnreadCount);

// Delete a message
router.delete("/:messageId", deleteMessage);

module.exports = router;
