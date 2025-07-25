const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const { getPeruTime } = require('../utils/util');
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  if (!ip) return res.status(400).json({ message: "IP address not found" });
  if (!token) return res.status(401).json({ message: "Authorization token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await UserModel.findOne({ email: decoded.email });

    let ipHistory = !user.ip_address_history ? '' : user.ip_address_history;
    if (!ipHistory.includes(ip)) ipHistory += ip + ' (' + getPeruTime() + '),'
    await UserModel.updateOne({ _id: user._id }, { $set: { ip_address: ip, ip_address_history: ipHistory, status: "Active" } })




    if (user.is_locked == true) {
      return res.status(503).json({ error: true, message: "Sorry, your account has been locked by admin!" });
    }
    if (user.ip_address != ip) {
      return res.status(401).json({ error: true, message: "Session expired, Please login again!" });
    }
    if (user) {
      req.user = decoded;
      await UserModel.updateOne({ _id: user._id }, { $set: { status: "Active" } })
      next();
      return;
    }
    res.status(403).json({ message: "User not exists!" });
  } catch {
    res.status(403).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
