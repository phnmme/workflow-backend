const jwt = require("jsonwebtoken");
const env = require("../configs/env");
const BlacklistedJwt = require("../models/jwtModel");
const Account = require("../models/userModel");

const getTokenFromHeader = (req) => {
  const authHeader = req.headers["authorization"];
  return authHeader && authHeader.split(" ")[1];
};

const verifyToken = async (token) => {
  if (!token) {
    throw { status: 401, message: "ไม่มีโทเค็นการยืนยันตัวตน" };
  }

  const isBlacklisted = await BlacklistedJwt.findOne({ token });
  if (isBlacklisted) {
    throw { status: 401, message: "โทเค็นไม่ถูกต้อง" };
  }

  return jwt.verify(token, env.jwtSecretKey);
};

const authMiddleware = {
  requireUser: async (req, res, next) => {
    try {
      const token = getTokenFromHeader(req);
      const decoded = await verifyToken(token);

      const user = await Account.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "ผู้ใช้ไม่พบในระบบ" });
      }

      req.user = user;
      next();
    } catch (err) {
      return res
        .status(err.status || 401)
        .json({ message: err.message || "Unauthorized" });
    }
  },

  requireAdmin: async (req, res, next) => {
    try {
      const token = getTokenFromHeader(req);
      const decoded = await verifyToken(token);

      const user = await Account.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "ผู้ใช้ไม่พบในระบบ" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "สิทธิ์การเข้าถึงถูกปฏิเสธ" });
      }
      console.log("Admin access granted for user:", user);
      req.user = user;
      next();
    } catch (err) {
      return res
        .status(err.status || 401)
        .json({ message: err.message || "Unauthorized" });
    }
  },
};

module.exports = authMiddleware;
