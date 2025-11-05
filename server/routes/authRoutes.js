const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { authLimiter, strictLimiter } = require("../middlewares/securityMiddleware");
const {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
} = require("../middlewares/validationMiddleware");

const router = express.Router();

router.post("/register", authLimiter, validateRegistration, registerUser);
router.post("/login", authLimiter, validateLogin, loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, validateProfileUpdate, updateUserProfile);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ imageUrl });
});

module.exports = router;
