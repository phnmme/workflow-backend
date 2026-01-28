const Log = require('../models/logModel');

const logController = {
    getLogs: async (req, res) => {
        try {
            const {
                page = 1,
                limit = 20,
                userId,
                action,
                startDate,
                endDate,
            } = req.query;
            
            const query = {};

            if(userId){
                query.userId = userId;
            }

            if(action){
                query.action = { $regex: action, $option: "i"}
            }

            if(startDate || endDate){
                query.timestamp = {};
                if(startDate) query.timestamp.$gte = new Date(startDate);
                if(endDate) query.timestamp.$lte = new Date(endDate);
            }

            const skip = (page - 1) * limit;

            const logs = await Log.find(query)
                        .populate("userId","username firstName lastName")
                        .sort({timestamp: -1})
                        .skip(skip)
                        .limit(parseInt(limit))

            const total = await Log.countDocuments(query)

            res.status(200).json({
                success: true,
                count: logs.length,
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total/limit),
                data: logs,
            })
        }
        catch (err) {
            console.error(err);
            res.status(500).json({message: "server error"});

        }
    }
}
module.exports = logController;