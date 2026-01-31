const Attendance = require("../models/attendModel");

// helper: format datetime DD/MM/YYYY HH:mm:ss
const formatDateTime = (date) => {
  if (!date) return null;
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  const second = String(d.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
};

const attendController = {

  CheckIn: async (req, res) => {
    try {
      const userId = req.user._id;
      const now = new Date();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const exist = await Attendance.findOne({ userId, date: today });
      if (exist) {
        return res.status(400).json({
          message: "วันนี้คุณได้ทำการ Check-In ไปแล้ว",
        });
      }

      const workStartTime = new Date(today);
      workStartTime.setHours(9, 0, 0, 0);

      let status = "present";
      if (now > workStartTime) status = "late";

      const newAttendance = new Attendance({
        userId,
        date: today,
        CheckIn: now,
        status,
      });

      await newAttendance.save();

      res.status(201).json({
        success: true,
        message: "Check-In สำเร็จ",
        date: formatDateTime(today),
        CheckIn: formatDateTime(now),
        status,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  CheckOut: async (req, res) => {
    try {
      const userId = req.user._id;
      const now = new Date();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const attendance = await Attendance.findOne({
        userId,
        date: today,
        CheckOut: null,
      });

      if (!attendance) {
        return res.status(404).json({
          message: "ไม่พบประวัติการ Check-In ของคุณในวันนี้",
        });
      }

      attendance.CheckOut = now;
      await attendance.save();

      res.status(200).json({
        success: true,
        message: "Check-Out สำเร็จ",
        CheckIn: formatDateTime(attendance.CheckIn),
        CheckOut: formatDateTime(now),
        status: attendance.status,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
  //http://localhost:3000/attendance/history
  getHistory: async (req, res) => {
    try {
      const userId = req.user._id;
      const days = Number(req.query.days) || 7;

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      const logs = await Attendance.find({
        userId,
        date: { $gte: startDate, $lte: endDate },
      }).sort({ date: -1 });

      const formatted = logs.map((log) => ({
        date: formatDateTime(log.date),
        checkInTime: formatDateTime(log.CheckIn),
        checkOutTime: formatDateTime(log.CheckOut),
        status: log.status,
      }));

      res.status(200).json({
        success: true,
        days,
        count: formatted.length,
        data: formatted,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "server error",
      });
    }
  },
};

module.exports = attendController;
