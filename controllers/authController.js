const { hashPassword, verifyPassword } = require("../utils/hash");
const jwt = require("jsonwebtoken");
const env = require("../configs/env");
const Account = require("../models/userModel");
const LogAuth = require("../models/logModel");
const BlacklistedJwt = require("../models/jwtModel");

const authController = {
  // --------------------------- Register --------------------------------
  register: async (req, res) => {
    const {
      username,
      email,
      password,
      confirmPassword,
      idCard,
      firstName,
      lastName,
    } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "รหัสผ่านไม่ตรงกัน" });
    }
    Account.findOne({ $or: [{ username }, { email }, { idCard }] }).then(
      (existingUser) => {
        if (existingUser) {
          return res
            .status(400)
            .json({ message: "ชื่อผู้ใช้หรืออีเมลนี้มีอยู่แล้ว" });
        }
      }
    );
    const hashedPassword = await hashPassword(password);
    const newUser = new Account({
      username,
      email,
      password: hashedPassword,
      idCard,
      firstName,
      lastName,
    });
    await newUser.save();

    const newLogAuth = new LogAuth({
      userId: newUser._id,
      action: "สมัครสมาชิก",
      timestamp: new Date(),
      details: `ผู้ใช้ ${username} สมัครสมาชิกสำเร็จ`,
    });
    await newLogAuth.save();

    res.status(201).json({ message: "ลงทะเบียนผู้ใช้สำเร็จ" });
  },
  // --------------------------- Login --------------------------------
  login: async (req, res) => {
    const { username, password } = req.body;

    const user = await Account.findOne({ username });
    console.log("username from body:", username);
    console.log("user from db:", user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      env.jwtSecretKey,
      {
        expiresIn: "9h",
      }
    );

    res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", token });
  },
  // --------------------------- Logout --------------------------------
  logout: async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "โทเค็นไม่ถูกต้อง" });
    }
    const blacklistedToken = new BlacklistedJwt({ token });
    await blacklistedToken.save();

    res.status(200).json({ message: "ออกจากระบบสำเร็จ" });
  },
  // --------------------------- Change Password --------------------------------
  changePassword: async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    const user = await Account.findOne({ username });
    if (user) {
      const isOldPasswordValid = await verifyPassword(
        oldPassword,
        user.password
      );
      if (isOldPasswordValid) {
        const hashedNewPassword = await hashPassword(newPassword);
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
      } else {
        res.status(401).json({ message: "ข้อมูลไม่ถูกต้อง" });
      }
    } else {
      res.status(401).json({ message: "ข้อมูลไม่ถูกต้อง" });
    }
  },
  getMe: async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, env.jwtSecretKey);
      const user = await Account.findById(decoded.userId).select(
        "-password -__v -deletedAt"
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, env.jwtSecretKey);

      const users = await Account.find({
        _id: { $ne: decoded.userId },
      }).select("-password -__v -deletedAt");

      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  verifyToken: async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, env.jwtSecretKey);
      res.status(200).json({ valid: true, decoded });
    } catch (err) {
      res.status(401).json({ valid: false, message: "Invalid token" });
    }
  },
};

module.exports = authController;
