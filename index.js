const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./configs/database");
const app = express();
const userRoute = require("./routes/authRoute");
const dayoffRoute = require("./routes/dayoffRoute");
const attendRoute = require("./routes/attendRoute");
const logRoute = require("./routes/logRoute");
const env = require("./configs/env");

const chatRoute = require("./routes/chatRoute");
const cors = require("cors");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
require("./socket/chat")(io);
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/s/v1", userRoute);
app.use("/s/v1", dayoffRoute);
app.use("/s/v1/chat", chatRoute);

app.use("/s/v1/attendance", attendRoute);
app.use("/s/v1/log", logRoute);

server.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
