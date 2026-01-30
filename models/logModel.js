const mongoose = require("mongoose");

const LogAuthSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    action: {
      type: String,
      required: true,
      maxlength: 255,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    details: {
      type: String,
      maxlength: 1024,
    },
  },
  {
    timestamps: true,
    collection: "auth_logs",
  }
);

LogAuthSchema.index({ userId:1,date: 1}, {unique : true})
LogAuthSchema.index({date:1});
LogAuthSchema.index({userId:1,date: -1});

module.exports = mongoose.model("LogAuth", LogAuthSchema);
