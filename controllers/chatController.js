const Message = require("../models/messageModel");

exports.getMessagesByRoom = async (req, res) => {
  const { roomId } = req.params;

  const messages = await Message.find({ roomId })
    .populate("senderId", "username email")
    .sort({ createdAt: 1 });

  res.json(messages);
};
