const jwt = require("jsonwebtoken");
const env = require("../configs/env");
const Account = require("../models/userModel");
const BlacklistedJwt = require("../models/jwtModel");

const getUserFromHeader = async (req) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];

        if (!token) {
            throw { status: 401, message: "ไม่มีโทเค็นการยืนยันตัวตน" };
        }

        const isBlacklisted = await BlacklistedJwt.findOne({ token });
        if (isBlacklisted) {
            throw { status: 401, message: "โทเค็นไม่ถูกต้อง" };
        }

        let decoded;
        try {
            decoded = jwt.verify(token, env.jwtSecretKey);
        } catch (err) {
            throw { status: 401, message: "โทเค็นหมดอายุหรือไม่ถูกต้อง" };
        }

        const user = await Account.findById(decoded.userId);
        if (!user) {
            throw { status: 401, message: "ไม่พบผู้ใช้ในระบบ" };
        }

        return user;
    } catch (error) {
        throw error; 
    }
};

module.exports = getUserFromHeader;
