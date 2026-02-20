const jwt = require("jsonwebtoken")
const UserModel = require("../models/userModel")
const IpModel = require("../models/ipModel")
const blockedIpModel = require("../models/blockedIpModel")
const { checkDaysLeft } = require("../functions")
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]
  if (!token) {
    return res.status(403).json({ message: "Access denied" })
  }
  try {
    const decoded = jwt.verify(token, "abc123")
    req.user = decoded // User information from decoded token
    next()
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" })
  }
}
const validateFields = (req, res, next) => {
  const { shop_id, domain, email, password, course_name } = req.body

  const file_path = req?.file // Assuming the file upload is handled by multer and file_path is available
  if (!shop_id || !domain || !email || !password || !course_name || !file_path) {
    return res.status(400).json({ message: "Every field is required!" })
  }
  next()
}
const adminMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(" ")[1]
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  if (!token) return res.status(401).json({ message: "Access Denied" })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await UserModel.findOne({ email: decoded.email, _id: decoded._id })

    if (!user) {
      res.status(403).json({ message: "La usuario no existe" })
      return
    }

    // let isEmailVerified = user.email_verified
    // if (!isEmailVerified) {
    //   return res.status(200).json({ user: { error: true, email: user.email, token, message: "Correo electrónico no verificado", email_verified: false } })
    // }
    if (decoded && ["admin", "manager"].includes(decoded.role)) {
      req.user = decoded
      next()
    } else {
      res.status(403).json({ message: "Sólo el administrador puede acceder a esta ruta" })
    }
  } catch {
    res.status(403).json({ message: "Token inválido" })
  }
}

const memberMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(" ")[1]

  if (!token) return res.status(401).json({ message: "Access Denied" })
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await UserModel.findOne({ email: decoded.email, _id: decoded._id })

    if (!user) {
      res.status(403).json({ message: "La usuario no existe" })
      return
    }

    // let isEmailVerified = user.email_verified
    // if (!isEmailVerified) {
    //   return res.status(200).json({ user: { error: true, email: user.email, token, message: "Correo electrónico no verificado", email_verified: false } })
    // }
    let first_ip = user.first_ip
    // Use case: Restricting or logging new IPs for non-admin users only.
    if (first_ip && !first_ip.split(",").includes(ip) && user.role !== "admin") {
      // check if the ip is whitelisted , if not then block the request
      let user = await IpModel.findOne({ ip_address: ip })
      if (!user || !user._id) {
        res.status(403).json({ error: true, message: "Se alcanzó el límite de IP" })
        return
      }
    }

    if (user && user?.is_locked == true) {
      return res.status(503).json({ error: true, message: "Sorry, your account has been locked by admin!" })
    }
    // check user sub validity
    let userValidity = checkDaysLeft(user.sub_start_date, user.sub_validity)
    if (!userValidity) {
      return res.status(403).json({ error: true, message: "Your subscription has been expired, Please renew to continue!" })
    }
    if (user && decoded && ["member", "admin", "manager","appcbl_soft", "specific", "all_profile"].includes(decoded.role)) {
      req.user = decoded
      next()
    } else {
      res.status(403).json({ message: "Rol no permitido" })
    }
  } catch (err) {
    res.status(403).json({ message: err.message || "Invalid Token" })
  }
}
const ipTrackMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(" ")[1]
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  if (!ip) return res.status(400).json({ message: "IP address not found" })
  if (!token) return res.status(401).json({ message: "Authorization token missing" })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.role === "admin") {
      req.user = decoded
      next()
    }
    if (decoded && ["member", "specific", "appcbl_soft", "all_profile", "manager"].includes(decoded.role)) {
      const user = await UserModel.findOne({ email: decoded.email, _id: decoded._id })
      if ((user && user.ip_address && user.ip_address != "null" && user.ip_address == ip) || user.ip_address == null) {
        if (user.ip_address == null) {
          await UserModel.updateOne({ _id: user._id }, { $set: { ip_address: ip, status: "Active" } })
        }
        req.user = decoded
        next()
        return
      }
      if (!user) {
        res.status(403).json({ error: true, message: "Account not exists" })
        return
      }
      res.status(200).json({ error: true, message: "Sorry, the account is already in use!" })
    } else {
      res.status(403).json({ error: true, message: "Rol no permitido" })
    }
  } catch {
    res.status(403).json({ error: true, message: "Invalid Token" })
  }
}
const verifyMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(" ")[1]
  if (!token) return res.status(401).json({ message: "Access Denied" })
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const user = await UserModel.findOne({ email: decoded.email, _id: decoded._id })

  // let isEmailVerified = user.email_verified
  // if (!isEmailVerified) {
  //   return res.status(200).json({ user: { error: true, email: user.email, token, message: "Correo electrónico no verificado", email_verified: false } })
  // } else if (user && !user?.verified_ip?.includes(ip)) {
  //   return res.status(200).json({ user: { verified: false, email: user.email } })
  // } else {
  //   next()
  // }
  next()
}
module.exports = {
  authMiddleware,
  adminMiddleware,
  memberMiddleware,
  ipTrackMiddleware,
  validateFields,
  verifyMiddleware,
}
