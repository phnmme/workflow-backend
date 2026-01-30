/** @format */

const leaveType = require("../models/leaveTypeModel")
const leaveRequest = require("../models/requestModel")

exports.addLeaveType = async (req, res) => {
  const { leaveName, limitDays, detail } = req.body
  const newRequest = new leaveType({
    leaveName: leaveName,
    limitDays: limitDays,
    detail: detail,
  })
  newRequest.save()
  res.status(201).json({ message: "เพิ่มสำเร็จ" })
}

exports.changeStatus = async (req, res) => {
  const { requestID, status } = req.body
  const updated = await leaveRequest.findByIdAndUpdate(
    requestID, 
    {
      status: status
    }
  )
  updated.save()
  res.status(201).json({ message: "เปลี่ยนสถานะเสร็จสิ้น" })
}
