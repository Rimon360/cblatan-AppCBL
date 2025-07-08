const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel")
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await UserModel.findOne({ email: decoded.email });
    if (user.is_locked == true) {
      return res.status(200).json({ error: true, message: "Sorry, your account has been locked by admin!" });
    }
    if (user) {
      req.user = decoded;
      next();
      return;
    }
    res.status(403).json({ message: "User not exists!" });
  } catch {
    res.status(403).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
