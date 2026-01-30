
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

exports.getMyRequest = async (req, res) => {
    const user = await getUserFromHeader(req)
    const request = await leaveRequest.find({ userId : user._id})
    res.status(201).json(request)
}

exports.cancelRequest = async (req, res) => {
  const { requestID } = req.body
  const updated = await leaveRequest.findByIdAndUpdate(
    requestID, 
    {
      status: "CANCELED"
    }
  )

  if(!updated){
    res.status(404).json({message: "ไม่พบคำร้อง"})
  }

  updated.save()
  res.status(201).json({ message: "ยกเลิกคำร้องเสร็จสิ้น" })
}