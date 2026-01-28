const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const controller = require("../controllers/authController");

router.post("/", auth, controller.createChatroom);
router.post("/:id/join", auth, controller.joinChatroom);
router.post("/:id/leave", auth, controller.leaveChatroom);
router.get("/", auth, controller.getMyChatrooms);

module.exports = router;