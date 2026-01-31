const express = require("express");
const router = express.Router();
const dayoffController = require("../controllers/dayoffController")
const adminDayoffController = require("../controllers/adminDayoffController")

const { requireUser , requireAdmin } = require("../middlewares/authMiddleware")

router.post("/request",requireUser,dayoffController.requestDayOff)
router.get("/getMyRequest",requireUser,dayoffController.getMyRequest)
router.post("/cancelRequest",requireUser,dayoffController.cancelRequest)

router.post("/addLeaveType",requireAdmin,adminDayoffController.addLeaveType)
router.patch("/:id/changeStatus",requireAdmin,adminDayoffController.changeStatus)
router.patch("/:id/updateLeaveType",requireAdmin,adminDayoffController.updateLeaveType)
router.get("/getAllRequest",requireAdmin,adminDayoffController.getAllRequest);

module.exports = router