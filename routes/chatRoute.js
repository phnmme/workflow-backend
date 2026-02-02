const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");
const auth = require("../middlewares/authMiddleware");

/* ====================== ROOM */

// สร้างห้อง
router.post("/rooms",auth.requireUser,chatController.createRoom);

// ดึงห้องทั้งหมดของตัวเอง
router.get("/rooms/me",auth.requireUser,chatController.getMyRooms);

// ดึงห้องของ user คนอื่น
router.get("/rooms/user/:userId",auth.requireUser,chatController.getUserRooms);

// ดึงห้องเดียว
router.get("/rooms/:roomId",auth.requireUser,chatController.getRoomById);

/* ====================== MEMBERS*/

// เพิ่ม user เข้า room
router.put("/rooms/:roomId/add-user",auth.requireUser,chatController.addUserToRoom);

// เอา user ออกจาก room
router.put( "/rooms/:roomId/remove-user",auth.requireUser,chatController.removeUserFromRoom);

/* ====================== ป-MESSAGE*/

// ดึงข้อความใน room
router.get("/rooms/:roomId/messages",auth.requireUser,chatController.getMessagesByRoom);

module.exports = router;
