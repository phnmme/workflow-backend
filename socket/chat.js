const Message = require("../models/messageModel");
const jwt = require("jsonwebtoken");

module.exports = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("No token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("Decoded token in socket auth:", decoded);

      socket.userId = decoded.userId;
      console.log("Socket auth successful for user:", socket.userId);
      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id, "user:", socket.userId);

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("send_message", async (data) => {
      try {
        const newMessage = await Message.create({
          roomId: data.roomId,
          senderId: socket.userId,
          message: data.message,
        });

        console.log("New message created:", newMessage);

        const populatedMessage = await newMessage.populate(
          "senderId",
          "username email"
        );

        console.log("Populated message:", populatedMessage);

        io.to(data.roomId).emit("receive_message", populatedMessage);
      } catch (err) {
        console.error(err);
        socket.emit("error_message", "Send message failed");
      }
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected:", socket.id);
    });
  });
};
