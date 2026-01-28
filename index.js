const express = require("express");
const connectDB = require("./configs/database");
const app = express();
const userRoute = require("./routes/authRoute");
const attendRoute = require("./routes/attendRoute");
const logRoute = require("./routes/logRoute");
const env = require("./configs/env");

connectDB();
app.use(express.json());
app.use("/s/v1", userRoute);
app.use("/attendance",attendRoute);
app.use("/log",logRoute);

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
