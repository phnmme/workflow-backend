const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const authMiddleware = require("../middlewares/authMiddleware"); 

router.get("/", authMiddleware.requireAdmin, logController.getLogs);

router.get("/user/:userId",authMiddleware.requireAdmin,logController.getLogByUser);

router.post("/", authMiddleware.requireAdmin, logController.createLog);

router.put("/:id", authMiddleware.requireAdmin, logController.updateLog);

router.delete("/:id",authMiddleware.requireAdmin,logController.deleteLog);

router.get("/summary/user",authMiddleware.requireAdmin,logController.getMonthSummary);

router.get("/summary/all",authMiddleware.requireAdmin,logController.getAllSummary);

module.exports = router;