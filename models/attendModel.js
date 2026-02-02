const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true,
            index: true,
        },
        CheckIn:{
            type: Date,
            default: Date.now,
            required: true
        },
        CheckOut:{
            type: Date,
            default: null,
        },
        date:{
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["present","late","absent","leave"],
            default: "present",
        },
        notes: {
            type: String,
            default: null,
        }
    },
    {
        timestamps: true,
        collection: "attendances",
    }
)
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ userId: 1, date: -1 });


module.exports = mongoose.model("Attendance",attendanceSchema)