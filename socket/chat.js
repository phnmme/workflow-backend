const Message = require("../models/messageModel");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id);

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

        const populatedMessage = await newMessage.populate(
          "senderId",
          "username email"
        );

        io.to(data.roomId).emit("receive_message", populatedMessage);
      } catch (err) {
        socket.emit("error_message", "Send message failed");
      }
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected:", socket.id);
    });
  });
};
