const ChatRoom = require("../models/chatRoomModel");

exports.createChatroom = async (req, res) => {
  const room = await ChatRoom.create({
    name: req.body.name,
    ownerId: req.user.id,
    members: [req.user.id]
  });
  res.json(room);
};

exports.joinChatroom = async (req, res) => {
  await ChatRoom.findByIdAndUpdate(req.params.id, {
    $addToSet: { members: req.user.id }
  });
  res.sendStatus(200);
};

exports.leaveChatroom = async (req, res) => {
  await ChatRoom.findByIdAndUpdate(req.params.id, {
    $pull: { members: req.user.id }
  });
  res.sendStatus(200);
};

exports.getMyChatrooms = async (req, res) => {
  const rooms = await ChatRoom.find({
    members: req.user.id
  });
  res.json(rooms);
};
