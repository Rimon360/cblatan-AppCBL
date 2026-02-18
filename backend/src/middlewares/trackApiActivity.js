const jwt = require("jsonwebtoken")
const UserModel = require("../models/userModel")
const { getPeruTime } = require("../utils/util")
const { format } = require("date-fns")
const { checkValidity, peruTime } = require("../functions")
const IpModel = require("../models/ipModel")
const userApiActivityModel = require("../models/userApiActivityModel")
const trackApiActivity = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(" ")[1]
  const ip_address = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  const peru_time = peruTime()
  const api_route = req?.originalUrl || ""
  if (!ip_address) return res.status(400).json({ message: "Dirección IP no encontrada" })
  if (!token) return res.status(401).json({ message: "Falta de token de autorización" })

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET)
    decoded.expiration = req?.user?.expiration;
    let user = await UserModel.findOne({ email: decoded.email })
    if (!user) {
      let { role, email } = decoded
      if (role !== "admin") await userApiActivityModel.insertOne({ role, email, ip_address, peru_time, api_route })
      return res.status(404).json({ message: "User not exists" })
    }
    if (user) {
      let { role, email } = user
      req.user = decoded
      if (role !== "admin") await userApiActivityModel.insertOne({ role, email, ip_address, peru_time, api_route })
      next()
      return
    }
    res.status(403).json({ message: "La usuario no existe!" })
  } catch (err) {
    res.status(403).json({ message: err.message || "Token inválido" })
  }
}

module.exports = trackApiActivity
