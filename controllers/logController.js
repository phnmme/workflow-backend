const Log = require('../models/attendModel');
const { CheckIn, CheckOut } = require('./attendController');

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

const logController = {

    //GET LOGS 
    getLogs: async (req, res) => {
        try {
            const { page = 1, limit = 20, userId, status, startDate, endDate } = req.query;
            const query = {};

            if (userId) query.userId = userId;
            if (status) query.status = status;

            if (startDate || endDate) {
                query.date = {};
                if (startDate) query.date.$gte = new Date(startDate);
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    query.date.$lte = end;
                }
            }

            const skip = (page - 1) * limit;

            const logs = await Log.find(query)
                .populate("userId", "username firstName lastName email idCard")
                .sort({ date: -1 })
                .skip(skip)
                .limit(Number(limit));

            const total = await Log.countDocuments(query);

            res.json({
                success: true,
                total,
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                data: logs.map(l => ({
                    ...l.toObject(),
                    CheckIn: formatDateTime(l.CheckIn),
                    CheckOut: formatDateTime(l.CheckOut),
                })),
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    // GET LOG BY USER http://localhost:3000/log/user/697b5d5f06f69f9abe460e9f
    getLogByUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const { year, month } = req.query;

            const query = { userId };

            if (year && month) {
                const start = new Date(year, month - 1, 1);
                const end = new Date(year, month, 0, 23, 59, 59, 999);
                query.date = { $gte: start, $lte: end };
            }

            const logs = await Log.find(query)
                .populate("userId", "username firstName lastName email idCard")
                .sort({ date: -1 });

            res.json({
                success: true,
                count: logs.length,
                data: logs.map(l => ({
                    ...l.toObject(),
                    CheckIn: formatDateTime(l.CheckIn),
                    CheckOut: formatDateTime(l.CheckOut),
                })),
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    },


    // CREATE LOG http://localhost:3000/log/
    createLog: async (req, res) => {
        try {
            const { userId, date, CheckIn, CheckOut, status, notes } = req.body;

            if (!userId || !date) {
                return res.status(400).json({ message: "ต้องมี userId และ date" });
            }

            const exist = await Log.findOne({
                userId,
                date: {
                    $gte: new Date(date).setHours(0, 0, 0, 0),
                    $lte: new Date(date).setHours(23, 59, 59, 999),
                },
            });

            if (exist) {
                return res.status(400).json({ message: "attendance วันนี้มีอยู่แล้ว" });
            }

            const log = await Log.create({
                userId,
                date: new Date(date),
                CheckIn: CheckIn ? new Date(CheckIn) : null,
                CheckOut: CheckOut ? new Date(CheckOut) : null,
                status: status || "absent",
                notes,
            });

            res.status(201).json({
                success: true,
                data: {
                    ...log.toObject(),
                    CheckIn: formatDateTime(log.CheckIn),
                    CheckOut: formatDateTime(log.CheckOut),
                },
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    //UPDATE LOG http://localhost:3000/log/697b35da43c8f046ec203c90
    updateLog: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, CheckIn, CheckOut, notes } = req.body;

            const validStatuses = ["present", "late", "absent", "leave"];
            if (status && !validStatuses.includes(status)) {
                return res.status(400).json({ message: "status ไม่ถูกต้อง" });
            }

            const log = await Log.findByIdAndUpdate(
                id,
                {
                    status,
                    CheckIn: CheckIn ? new Date(CheckIn) : undefined,
                    CheckOut: CheckOut ? new Date(CheckOut) : undefined,
                    notes,
                },
                { new: true }
            ).populate("userId", "username firstName lastName email");

            if (!log) return res.status(404).json({ message: "ไม่พบ log" });

            res.json({
                success: true,
                data: {
                    ...log.toObject(),
                    CheckIn: formatDateTime(log.CheckIn),
                    CheckOut: formatDateTime(log.CheckOut),
                },
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    //DELETE http://localhost:3000/log/697b35da43c8f046ec203c90
    deleteLog: async (req, res) => {
        try {
            const { id } = req.params;
            const log = await Log.findByIdAndDelete(id);

            if (!log) return res.status(404).json({ message: "ไม่พบ log" });

            res.json({ success: true, message: "ลบสำเร็จ" });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // MONTH SUMMARY 
    //http://localhost:3000/log/summary/user?userId=697b5d5f06f69f9abe460e9f&year=2026&month=1
    getMonthSummary: async (req, res) => {
        try {
            const { userId, year, month } = req.query;

            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0, 23, 59, 59, 999);

            const logs = await Log.find({
                userId,
                date: { $gte: start, $lte: end },
            });

            const summary = {
                present: 0,
                late: 0,
                absent: 0,
                leave: 0,
                total: logs.length,
            };

            logs.forEach(l => summary[l.status]++);

            res.json({ success: true, summary, data: logs });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    //USER SUMMARY ดูสรุป employee แต่ละคน
    //http://localhost:3000/log/summary/all?year=2026&month=1
    getAllSummary: async (req, res) => {
        try {
            const { year, month } = req.query;

            const yearNum = parseInt(year, 10);
            const monthNum = parseInt(month, 10);

            

            if (!yearNum || !monthNum) {
                return res.status(400).json({
                    success: false,
                    message: "ต้องมี year และ month ที่ถูกต้อง"
                });
            }

           const start = new Date(yearNum, monthNum - 1, 1);
            const end = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

            const logs = await Log.find({
                date: { $gte: start, $lte: end }
            }).populate("userId", "username firstName lastName email idCard");

            const summaryMap = {};

            logs.forEach((log) => {
                const uid = log.userId._id.toString();

                if (!summaryMap[uid]) {
                    summaryMap[uid] = {
                        userId: uid,
                        username: log.userId.username,
                        firstName: log.userId.firstName,
                        lastName: log.userId.lastName,
                        email: log.userId.email,
                        idCard: log.userId.idCard,
                        present: 0,
                        late: 0,
                        absent: 0,
                        leave: 0,
                        total: 0,
                    };
                }

                summaryMap[uid][log.status]++;
                summaryMap[uid].total++;
            });

            res.json({
                success: true,
                month,
                year,
                data: Object.values(summaryMap),
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    },

};

module.exports = logController;