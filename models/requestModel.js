const mongoose = require("mongoose")

const leaveRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref:"Account",
        require: true,
    },
    leaveType: {
        type: mongoose.Schema.ObjectId,
        ref:"-",
        require:true
    },
    start_date: {
        type: Date,
        require: true,
    },
    end_date: {
        type: Date,
        require: true,
    },
    days: {
        type: Number,
        require: true,
    },
    reason: {
        type: String,
        maxlength: 200,
    },
    status: {
        type: String,
        enum: ["PENDING","CANCELLED","APPROVED"],
        default: "PENDING",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
},{
    timestamps: true,
    collection: "requests",
});

module.exports = mongoose.model("leaveRequest",leaveRequestSchema);