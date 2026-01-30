
const leaveType = require("../models/leaveTypeModel")

exports.addLeaveType = async (req,res) => {
    const { leaveName , limitDays , detail} = req.body;
    const newRequest = new leaveType({
        leaveName : leaveName,
        limitDays : limitDays,
        detail : detail
    })
    newRequest.save()
    res.status(201).json({ message : "เพิ่มสำเร็จ"})
    
}