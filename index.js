const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./configs/db");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

connectDB();

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("chat message", (msg) => {
    console.log("message: " + msg.msg);
    io.emit("chat message", msg);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
