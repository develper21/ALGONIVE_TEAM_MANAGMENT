const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getUsers, getUserById } = require("../controllers/userController");

const router = express.Router();

router.get("/", protect, adminOnly, getUsers); // get all users (Admin only)
router.get("/:id", protect, getUserById); // get specific user
//router.delete("/:id", protect, adminOnly, deleteUser); // delete user (Admin only)

module.exports = router;
