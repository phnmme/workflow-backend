const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const { requireAdmin } = require("../middlewares/authMiddleware");

router.get("/", requireAdmin, logController.getLogs);

router.get("/user/:userId", requireAdmin, logController.getLogByUser);

router.post("/", requireAdmin, logController.createLog);
router.put("/:id", requireAdmin, logController.updateLog);

router.delete("/:id", requireAdmin, logController.deleteLog);

router.get("/summary/user", requireAdmin, logController.getMonthSummary);

router.get("/summary/all", requireAdmin, logController.getAllSummary);

module.exports = router;
