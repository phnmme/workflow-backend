
const leaveRequest = require("../models/requestModel")
const getUserFromHeader = require("../utils/token");



exports.requestDayOff = async (req,res) => {
    const { leaveTypeID , reason , startDate , endDate , days} = req.body;
    const user = await getUserFromHeader(req);
    const newRequest = new leaveRequest({
        userId : user._id,
        leaveTypeID : leaveTypeID,
        start_date : startDate,
        end_date : endDate,
        days : days,
        reason : reason,
    })
    newRequest.save()
    res.status(201).json({ message : "ยื่นคำร้องสำเร็จ"})
    
}