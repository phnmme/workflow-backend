const mongoose = require("mongoose");
const env = require("../configs/env");

const connectDB = async () => {
  try {
    const con = await mongoose.connect(env.mongoUri);

    console.log(`✅ MongoDB Connected: ${con.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;