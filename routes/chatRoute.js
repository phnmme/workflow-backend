const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const auth = require("../middlewares/authMiddleware");

router.get("/room/:roomId/messages",auth.requireUser, chatController.getMessagesByRoom);

module.exports = router;
