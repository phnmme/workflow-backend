const mongoose = require("mongoose");

const blacklist_jwtSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "blacklisted_jwts",
  }
);

module.exports = mongoose.model("BlacklistedJwt", blacklist_jwtSchema);
