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

const userRoute = require("./routes/authRoute");
const chatRoute = require("./routes/chatRoute");

const app = express();
const server = http.createServer(app);

// middleware
app.use(express.json());

// routes
app.use("/s/v1", userRoute);
app.use("/s/v1", dayoffRoute);
app.use("/chat", chatRoute);

// socket.io
const io = new Server(server, {
  cors: { origin: "*" },
});

require("./socket/chat")(io);

connectDB();
app.use("/attendance",attendRoute);
app.use("/log",logRoute);


server.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
