const Message = require("../models/Message");
const Notification = require("../models/Notification");
const Task = require("../models/Task");
const User = require("../models/User");

// @desc Send a message in a task discussion
// @route POST /api/messages
// @access Private
const sendMessage = async (req, res) => {
  try {
    const { taskId, content } = req.body;
    const senderId = req.user.id;

    // Validate task exists
    const task = await Task.findById(taskId).populate("assignedTo createdBy");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user has access to this task (either assigned or admin)
    const isAssigned = task.assignedTo.some(
      (user) => user._id.toString() === senderId
    );
    const isCreator = task.createdBy && task.createdBy._id.toString() === senderId;
    const user = await User.findById(senderId);
    const isAdmin = user.role === "admin";

    if (!isAssigned && !isCreator && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You don't have access to this task" });
    }

    // Create message
    const message = await Message.create({
      taskId,
      sender: senderId,
      content,
    });

    // Populate sender details
    await message.populate("sender", "name email profileImageUrl profileDisplayUrl gender");

    // Create notifications for all task participants except sender
    const recipients = new Set();

    // Add task creator
    if (task.createdBy && task.createdBy._id.toString() !== senderId) {
      recipients.add(task.createdBy._id.toString());
    }

    // Add assigned users
    task.assignedTo.forEach((user) => {
      if (user._id.toString() !== senderId) {
        recipients.add(user._id.toString());
      }
    });

    // Create notifications
    const notifications = Array.from(recipients).map((recipientId) => ({
      recipient: recipientId,
      sender: senderId,
      type: "message",
      title: `New message in ${task.title}`,
      message: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
      taskId: taskId,
      messageId: message._id,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get all messages for a task
// @route GET /api/messages/:taskId
// @access Private
const getTaskMessages = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    // Validate task exists
    const task = await Task.findById(taskId).populate("assignedTo createdBy");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user has access to this task
    const isAssigned = task.assignedTo.some(
      (user) => user._id.toString() === userId
    );
    const isCreator = task.createdBy && task.createdBy._id.toString() === userId;
    const user = await User.findById(userId);
    const isAdmin = user.role === "admin";

    if (!isAssigned && !isCreator && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You don't have access to this task" });
    }

    // Get messages
    const messages = await Message.find({ taskId })
      .populate("sender", "name email profileImageUrl profileDisplayUrl gender role")
      .sort({ createdAt: 1 });

    // Mark messages as read by current user
    await Message.updateMany(
      {
        taskId,
        sender: { $ne: userId },
        "readBy.userId": { $ne: userId },
      },
      {
        $push: {
          readBy: {
            userId: userId,
            readAt: new Date(),
          },
        },
      }
    );

    res.json({
      messages,
      count: messages.length,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get unread message count for a task
// @route GET /api/messages/:taskId/unread-count
// @access Private
const getUnreadCount = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const count = await Message.countDocuments({
      taskId,
      sender: { $ne: userId },
      "readBy.userId": { $ne: userId },
    });

    res.json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Delete a message
// @route DELETE /api/messages/:messageId
// @access Private
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only sender or admin can delete
    const user = await User.findById(userId);
    if (message.sender.toString() !== userId && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages" });
    }

    await message.deleteOne();

    // Delete associated notifications
    await Notification.deleteMany({ messageId: messageId });

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  sendMessage,
  getTaskMessages,
  getUnreadCount,
  deleteMessage,
};
