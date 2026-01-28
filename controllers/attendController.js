const Attendance = require('../models/attendModel');

const attendController = {
    CheckIn: async (req, res) => {
        try {
            const userId = req.user._id;
            const today = new Date.toString().split("T")[0];
            const exist = await Attend.findeOne({ userId, date: today });

            if (exist) {
                return res.status(400).json({
                    message: "วันนี้คุณได้ทำการ Check-In ไปแล้ว"
                })
            }
            const workStartTime = new Date(now);
            workStartTime.setHours(9, 0, 0, 0); 

            let status = "present";
            if (now > workStartTime) {
                status = "late"; 
            }
            const newAttendance = new Attendance({
                userId,
                date: today,
            })
            await newAttendance.save();

            res.status(201).json({
                success: true,
                message: "Check-In สำเร็จ",
                CheckIn: now,
                status,
                date: newAttendance,
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server Error" });
        }
    },
    CheckOut: async (req, res) => {
        try {
            const userId = req.user._id;
            const today = new Date.toString().split("T")[0];
            const attendance = await Attend.findeOne({
                userId,
                date: today,
                checkout: null,
            })

            if (!attendance) {
                return res.status(404).json({
                    message: "ไม่พบประวัติการ Check-In ของคุณในวันนี้"
                })
            }

            attendance.CheckOut = Date.now();

            await attendance.save();

            res.status(200).json({
                success: true,
                message: "Check-out สำเร็จ",
                data: attendance,
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server Error" });
        }
    },
}

module.exports = attendController;