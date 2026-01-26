const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireUser, requireAdmin } = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", requireUser, authController.logout);
router.post("/change-password", requireUser, authController.changePassword);

module.exports = router;
