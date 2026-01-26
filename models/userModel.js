const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
      trim: true,
    },
    idCard: {
      type: String,
      required: true,
      unique: true,
      maxlength: 13,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      maxlength: 255,
    },
    firstName: {
      type: String,
      maxlength: 100,
    },
    lastName: {
      type: String,
      maxlength: 100,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "accounts",
  }
);

module.exports = mongoose.model("Account", accountSchema);
