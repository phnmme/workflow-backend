const Message = require("../models/messageModel");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id);

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("send_message", async (data) => {
      /*
        data = {
          roomId,
          senderId,
          message
        }
      */

      const newMessage = await Message.create({
        roomId: data.roomId,
        senderId: data.senderId,
        message: data.message,
      });

      io.to(data.roomId).emit("receive_message", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected:", socket.id);
    });
  });
};
