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

exports.updateLeaveType = async (req, res) => {
  try {
    const { leaveTypeID } = req.params;
    const { leaveName, limitDays, detail, isActive } = req.body;

    const updated = await leaveType.findByIdAndUpdate(
      leaveTypeID,
      {
        ...(leaveName && { leaveName }),
        ...(limitDays !== undefined && { limitDays }),
        ...(detail && { detail }),
        ...(isActive !== undefined && { isActive })
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "ไม่พบประเภทการลา" });
    }

    res.status(200).json({
      message: "แก้ไขข้อมูลสำเร็จ",
      data: updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.changeStatus = async (req, res) => {
  const { requestID } = req.params;
  const { status } = req.body
 
  const updated = await leaveRequest.findByIdAndUpdate(
    requestID, 
    {
      status: status
    }
  )

  if(!updated){
    res.status(404).json({message: "ไม่พบคำร้อง"})
  }

  updated.save()
  res.status(201).json({ message: "เปลี่ยนสถานะเสร็จสิ้น" })
}

exports.getAllRequest = async (req, res) => {
  const request = await leaveRequest.find()
  res.status(201).json(request)
}