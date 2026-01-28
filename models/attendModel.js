const mongoose = require('mongoose');

const attendanceSchema = new mongoose.schema(
    {
        userId:{
            type: mongoose.schema.Types.ObjectID,
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
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["present","late","absent"],
            default: "present",
        },
    },
    {
        timestamps: true,
        collection: "attendances",
    }
)
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance",attendanceSchema)