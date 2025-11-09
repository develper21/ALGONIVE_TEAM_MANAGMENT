const express = require("express");
const {
  createWorkLog,
  getUserWorkLogs,
  getTaskWorkLogs,
  getDailySummary,
  deleteWorkLog,
} = require("../controllers/workLogController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

// Create or update work log
router.post("/", createWorkLog);

// Get daily summary for current user
router.get("/summary/daily", getDailySummary);

// Get work logs for a user
router.get("/user/:userId", getUserWorkLogs);

// Get work logs for a task
router.get("/task/:taskId", getTaskWorkLogs);

// Delete a work log
router.delete("/:workLogId", deleteWorkLog);

module.exports = router;
