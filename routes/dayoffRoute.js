const express = require("express");
const router = express.Router();
const dayoffController = require("../controllers/dayoffController")
const adminDayoffController = require("../controllers/adminDayoffController")

const { requireUser , requireAdmin } = require("../middlewares/authMiddleware")

router.post("/request",requireUser,dayoffController.requestDayOff)


router.post("/addLeaveType",requireAdmin,adminDayoffController.addLeaveType)
router.post("/changeStatus",requireAdmin,adminDayoffController.changeStatus)


module.exports = router