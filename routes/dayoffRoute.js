const express = require("express");
const router = express.Router();
const dayoffController = require("../controllers/dayoffController")

const { requireUser } = require("../middlewares/authMiddleware")

router.post("/request",requireUser,dayoffController.requestDayOff)

module.exports = router