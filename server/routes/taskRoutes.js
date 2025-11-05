const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getDashboardData,
  getUserDashboardData,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
} = require("../controllers/taskController");
const { validateTask, validateObjectId } = require("../middlewares/validationMiddleware");

const router = express.Router();

// task management route
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks); // get all tasks (admin: all, user: assigned)
router.get("/:id", protect, validateObjectId("id"), getTaskById); // get specific tasks
router.post("/", protect, adminOnly, validateTask, createTask); // create a task (admin only)
router.put("/:id", protect, validateObjectId("id"), validateTask, updateTask); // update task detail
router.delete("/:id", protect, adminOnly, validateObjectId("id"), deleteTask); // delete task (admin only)
router.put("/:id/status", protect, validateObjectId("id"), updateTaskStatus); // update task status
router.put("/:id/todo", protect, validateObjectId("id"), updateTaskChecklist); // update task checklist

module.exports = router;
