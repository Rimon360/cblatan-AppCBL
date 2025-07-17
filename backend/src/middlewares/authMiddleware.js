const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, "abc123");
    req.user = decoded; // User information from decoded token
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};
const validateFields = (req, res, next) => {
  const { shop_id, domain, email, password, course_name } = req.body;


  const file_path = req?.file; // Assuming the file upload is handled by multer and file_path is available
  if (!shop_id || !domain || !email || !password || !course_name || !file_path) {
    return res.status(400).json({ message: "Every field is required!" });
  }
  next();
};
const adminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded && decoded.role === "admin") {
      req.user = decoded;
      next();
    } else {
      res.status(403).json({ message: "Only admin can access this route" });
    }
  } catch {
    res.status(403).json({ message: "Invalid Token" });
  }
};

const memberMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({ email: decoded.email, _id: decoded._id });
    if (user && user?.is_locked == true) {
      return res.status(503).json({ error: true, message: "Sorry, your account has been locked by admin!" });
    }
    if (user && decoded && decoded.role === "member" || decoded.role === "admin") {
      req.user = decoded;
      next();
    } else {
      res.status(403).json({ message: "Only admin or member can access this route" });
    }
  } catch (err) {
    res.status(403).json({ message: err.message || "Invalid Token" });
  }
};
const ipTrackMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  if (!ip) return res.status(400).json({ message: "IP address not found" });
  if (!token) return res.status(401).json({ message: "Authorization token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'admin') {
      req.user = decoded;
      next();
    }
    if (decoded && decoded.role === "member") {
      const user = await UserModel.findOne({ email: decoded.email, _id: decoded._id })
      if (user && user.ip_address && user.ip_address != 'null' && user.ip_address == ip || user.ip_address == null) {
        if (user.ip_address == null) {
          await UserModel.updateOne({ _id: user._id }, { $set: { ip_address: ip, status: "Active" } })
        }
        req.user = decoded;
        next();
        return;
      }
      if (!user) {
        res.status(403).json({ error: true, message: "Account not exists" });
        return
      }
      res.status(200).json({ error: true, message: "Sorry, the account is already in use!" });
    } else {
      res.status(403).json({ error: true, message: "Only admin or member can access this route" });
    }
  } catch {
    res.status(403).json({ error: true, message: "Invalid Token" });
  }
};



module.exports = {
  authMiddleware,
  adminMiddleware,
  memberMiddleware,
  ipTrackMiddleware,
  validateFields
};
