const jwt = require("jsonwebtoken")
const UserModel = require("../models/userModel")
const { getPeruTime } = require("../utils/util")
const { format } = require("date-fns")
const { checkValidity } = require("../functions")
const IpModel = require("../models/ipModel")
const blockedIpModel = require("../models/blockedIpModel")
const productModel = require("../models/productModel")
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(" ")[1]
  const maxAllowedIPLimit = 4
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  if (!ip) return res.status(400).json({ message: "Dirección IP no encontrada" })
  if (!token) return res.status(401).json({ message: "Falta de token de autorización" })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    let user = await UserModel.findOne({ email: decoded.email })
    let proxeis = await productModel.distinct("proxy")

    let isAlwaysAllowedUser = ["admin", "manager"].includes(user?.role?.trim())

    if (!user) {
      return res.status(404).json({ message: "User not exists" })
    }

    if (user && !user?.verified_ip?.includes(ip) && !proxeis.includes(ip) && !isAlwaysAllowedUser) {
      // check if the incomming ip is verified by OTP or not to prevent unusual access
      // return res.status(200).json({ user: { verified: false, email: user.email } })
    }

    // let isEmailVerified = user.email_verified
    // if (!isEmailVerified && !isAlwaysAllowedUser) {
    //   return res.status(200).json({ user: { error: true, email: user.email, token, message: "Correo electrónico no verificado", email_verified: false } })
    // }
    let ipHistory = !user.ip_address_history ? "" : user.ip_address_history
    let first_ip = user.first_ip
    if (first_ip == "") {
      first_ip = ip
    } else if (first_ip && first_ip.split(",").length < maxAllowedIPLimit && !first_ip.split(",").includes(ip)) {
      first_ip += "," + ip
    }
    if (!ipHistory.includes(ip)) ipHistory += ip + " (" + getPeruTime() + "),"
    await UserModel.updateOne({ _id: user._id }, { $set: { ip_address: ip, ip_address_history: ipHistory, status: "Active", first_ip } })
    user = await UserModel.findOne({ email: decoded.email })
    first_ip = user.first_ip
    if (first_ip && !first_ip.split(",").includes(ip) && user.role !== "admin" && !proxeis.includes(ip)) {
      // check if the ip is whitelisted , if not then block the request
      let user = await IpModel.findOne({ ip_address: ip })
      if (!user || !user._id) {
        res.status(403).json({ error: true, message: "Se alcanzó el límite de IP" })
        return
      }
    }

    const validity = user.sub_validity
    let subStarted = format(user.sub_start_date, "d/M/y")
    let expiration = checkValidity(subStarted, validity)

    decoded.expiration = expiration  
    
    if (user.is_locked == true) {
      return res.status(503).json({ error: true, message: "Lo siento, ¡su cuenta ha sido bloqueada por Admin!" })
    }
    if (user.ip_address != ip) {
      // to allow only 1 session per account
      return res.status(401).json({ error: true, message: "Sesión expirada, ¡inicie sesión nuevamente!" })
    }
    if (user) {
      req.user = decoded
      await UserModel.updateOne({ _id: user._id }, { $set: { status: "Active" } })
      next()
      return
    }
    res.status(403).json({ message: "La usuario no existe!" })
  } catch {
    res.status(403).json({ message: "Token inválido" })
  }
}

module.exports = verifyToken
