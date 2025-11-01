require("dotenv").config()
const express = require("express")
const userRoutes = require("./routes/userRoutes")
const browserRoute = require("./routes/browserRoute")
const whiteList = require("./routes/whiteList")
const ipBlacklist = require("./routes/ipBlacklist")
const blacklistRoute = require("./routes/blacklistRoute")
const shopRoutes = require("./routes/shopRoutes")
const productRoutes = require("./routes/productRoutes")
const mongoose = require("mongoose")
const dbConfig = require("./config/dbConfig")
const cors = require("cors")
const app = express()
const verifyToken = require("./middlewares/verifyToken")
const helmet = require("helmet")
const port = process.env.PORT || 8000
const path = require("path")

app.use(cors()) // Allow all origins, adjust as needed
app.use(helmet()) // for security headers
app.use(express.json())
app.set("trust proxy", "loopback")

const rateLimit = require("express-rate-limit")
const blockedIpModel = require("./models/blockedIpModel")

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000, // limit each IP
})

app.use(limiter)

mongoose
  .connect(dbConfig.url)
  .then(() => {
    console.log("MongoDB connected")
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
  })

app.use("/api", async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  if (!ip) return res.status(400).json({ message: "Dirección IP no encontrada" })
  const blockedIps = await blockedIpModel.find({ ip_address: ip })
  if (blockedIps.length > 0) {
    return res.status(503).json({ message: "Su cuenta ha sido bloqueada por actividades sospechosas." })
  }
  next()
})

app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.get("/api/verify-token", verifyToken, (req, res) => {
  res.json({ message: "success", user: req.user })
})
app.use("/api/shops", shopRoutes)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))
app.use("/logos", express.static(path.join(__dirname, "../logos")))
app.use("/ads", express.static(path.join(__dirname, "../ads")))
app.use("/api/whitelist", whiteList)
app.use("/api/ipblacklist", ipBlacklist)
app.use("/api/browser", browserRoute)
app.use("/api/blacklist", blacklistRoute)
app.use((req, res) => {
  console.log("404 for:", req.originalUrl)
  res.status(404).json({ error: true, message: "Technical Error!. Please try again later!", d: req.protocol + "://" + req.get("host") + req.originalUrl })
})

// module.exports = app;

app.listen(port, "0.0.0.0", () => {
  console.log("Server running on port: " + port)
})
