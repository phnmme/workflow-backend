const ChatRoom = require("../models/chatRoomModel");

module.exports = async (req, res, next) => {
  const room = await ChatRoom.findById(req.params.roomId);

  if (!room) {
    return res.status(404).json({ message: "ไม่เจอห้องแชทนี้" });
  }

  if (room.owner.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({
      message: "ไม่มีสิทธิ์"
    });
  }

  next();
};
