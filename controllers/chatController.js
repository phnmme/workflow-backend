const ChatRoom = require("../models/chatRoomModel");
const Message = require("../models/messageModel");

/* ============== ROOM */

// Create chatroom
exports.createRoom = async (req, res) => {
  try {
    const room = await ChatRoom.create({
      members: req.body.members,
      owner: req.user.id,
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my rooms
exports.getMyRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      members: req.user.id,
    }).populate("members", "username email");

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get another user's rooms
exports.getUserRooms = async (req, res) => {
  try {
    const { userId } = req.params;

    const rooms = await ChatRoom.find({
      members: userId,
    });

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get room by id
exports.getRoomById = async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.roomId)
      .populate("members", "username email");

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ====================== MEMBERS */

// Add user to room
exports.addUserToRoom = async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.roomId);
    room.members.addToSet(req.body.userId);
    await room.save();

    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove user from room
exports.removeUserFromRoom = async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.roomId);
    room.members.pull(req.body.userId);
    await room.save();

    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ====================== MESSAGE (REST)*/

// Get messages by room
exports.getMessagesByRoom = async (req, res) => {
  try {
    const messages = await Message.find({
      roomId: req.params.roomId,
    })
      .populate("senderId", "username email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
