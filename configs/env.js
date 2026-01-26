require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URL,
  entropy: process.env.ENTROPY,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
};
