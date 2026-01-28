const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./configs/database");
const env = require("./configs/env");

const userRoute = require("./routes/authRoute");
const chatRoomRoute = require("./routes/chatRoomRoute");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(express.json());
app.use("/s/v1", userRoute);
app.use("/chatrooms", chatRoomRoute);

// socket 
io.on("connection", socket => {
  console.log("connected:", socket.id);

  socket.on("joinRoom", roomId => {
    socket.join(roomId);
    console.log(`Joined room: ${roomId}`);
  });

  socket.on("sendMessage", data => {
    io.to(data.roomId).emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id);
  });
});

connectDB();
app.use(express.json());
app.use("/s/v1", userRoute);

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});