const mongoose = require("mongoose")

const leaveTypeSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    limitDays: {
        type: Number,
        require: true,
    },
    detail: {
        type: String,
        maxlength: 200,
    },
    isActive: {
        type: Boolean,
        default: "TRUE",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
},{
    timestamps: true,
    collection: "leaveTypes",
});

module.exports = mongoose.model("leaveType",leaveTypeSchema);