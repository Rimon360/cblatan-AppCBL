process.on("uncaughtException", (err) => console.error(err))
process.on("unhandledRejection", (err) => console.error(err))

require("dotenv").config()
const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const userRoutes = require("./routes/userRoutes")
const browserRoute = require("./routes/browserRoute")
const whiteList = require("./routes/whiteList")
const ipBlacklist = require("./routes/ipBlacklist")
const blacklistRoute = require("./routes/blacklistRoute")
const emailRoute = require("./routes/emailRoute")
const shopRoutes = require("./routes/shopRoutes")
const productRoutes = require("./routes/productRoutes")
const mongoose = require("mongoose")
const dbConfig = require("./config/dbConfig")
const cors = require("cors")
const app = express()
const verifyToken = require("./middlewares/verifyToken")
const helmet = require("helmet")
const port = process.env.PORT || 8000
const routeVersion = process.env.ROUTE_VERSION || "vHU6wxhS396wxhS39wxhS39"
const path = require("path")

app.use(cors()) // Allow all origins, adjust as needed
app.use(helmet()) // for security headers
app.use(express.json())
app.set("trust proxy", "loopback")

const rateLimit = require("express-rate-limit")
const blockedIpModel = require("./models/blockedIpModel")
const trackApiActivity = require("./middlewares/trackApiActivity")
const socket = require("./socket")

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 8000, // limit each IP
})
app.use(express.json({ limit: "300mb", strict: true }))

app.use(limiter)

mongoose
  .connect(dbConfig.url)
  .then(() => {
    console.log("MongoDB connected")
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
  })

app.use("/" + routeVersion + "/api", async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  if (!ip) return res.status(400).json({ message: "Dirección IP no encontrada" })
  const blockedIps = await blockedIpModel.find({ ip_address: ip })
  if (blockedIps.length > 0) {
    return res.status(503).json({ message: "Su cuenta ha sido bloqueada por actividades sospechosas." })
  }
  next()
})

app.use("/" + routeVersion + "/api/users", userRoutes)
app.use("/" + routeVersion + "/api/products", productRoutes)
app.get("/" + routeVersion + "/api/verify-token", verifyToken, trackApiActivity, (req, res) => {
  res.json({ message: "success", user: req.user })
})
app.use("/" + routeVersion + "/api/shops", shopRoutes)
app.use("/" + routeVersion + "/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // your frontend
  res.setHeader("Access-Control-Allow-Headers", "Range")
  res.setHeader("Access-Control-Expose-Headers", "Content-Range, Accept-Ranges")
  res.setHeader("Accept-Ranges", "bytes")
  next()
})
app.use("/" + routeVersion + "/uploads", express.static(path.join(__dirname, "../uploads")))
app.use("/" + routeVersion + "/logos", express.static(path.join(__dirname, "../logos")))
app.use("/" + routeVersion + "/ads", express.static(path.join(__dirname, "../ads")))
app.use("/" + routeVersion + "/api/whitelist", whiteList)
app.use("/" + routeVersion + "/api/ipblacklist", ipBlacklist)
app.use("/" + routeVersion + "/api/browser", browserRoute)
app.use("/" + routeVersion + "/api/blacklist", blacklistRoute)
app.use("/" + routeVersion + "/api/email", emailRoute)

const memberMiddleware = (authHeader) => {
  const token = authHeader?.split(" ")[1]
  if (!token) return console.log({ message: "Access Denied" })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded, " - empty")
  } catch (err) {
    console.log(err.message || "ERROR ")
  }
}

app.use((req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  console.log("404 for:", req.originalUrl, ip)
  // memberMiddleware(req?.headers?.authorization)
  res.status(404).json({ error: true, message: "Technical Error!. Please try again later!", d: req.protocol + "://" + req.get("host") + req.originalUrl })
})

// module.exports = app;

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*" } })

socket(io)

server.listen(port, "0.0.0.0", () => {
  console.log("Server running on port: " + port)
})
