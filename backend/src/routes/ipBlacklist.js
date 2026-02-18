const express = require("express")
const router = express.Router()
const { adminMiddleware } = require("../middlewares/authMiddleware")
const blockedIpModel = require("../models/blockedIpModel")
const BrowsingHistoryModel = require("../models/browsingHistoryModel")

router.post("/", adminMiddleware, async (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  const { ip_address } = req.body
  const ip_array = ip_address.split(",")
  const formatedIp = []
  if (ip === ip_address) {
    return res.status(409).json({ message: "No puedes bloquear tu IP" })
  }
  for (const ip of ip_array) {
    if (!ip) continue
    formatedIp.push({ ip_address: ip.trim() })
  }

  const ipBlacklist = await blockedIpModel.insertMany(formatedIp)
  await BrowsingHistoryModel.updateMany({ ip: ip_address }, { $set: { ip_blocked: true } })

  if (ipBlacklist) return res.status(200).json({ message: "success", ipBlacklist })
  res.status(400).json({ message: "error" })
})
router.delete("/", adminMiddleware, async (req, res) => {
  const { id, ip_address } = req.body
  let ipBlacklist
  if (ip_address) {
    ipBlacklist = await blockedIpModel.deleteOne({ ip_address }) 
  } else {
    ipBlacklist = await blockedIpModel.deleteOne({ _id: id })
  }
  if (ipBlacklist.deletedCount) { 
    let mod = await BrowsingHistoryModel.updateMany({ ip: ip_address }, { $set: { ip_blocked: false } }) 
    return res.status(200).json({ message: "success" })
  }
  res.status(200).json({ message: "error" })
})
router.get("/", adminMiddleware, async (req, res) => {
  const ipBlacklist = await blockedIpModel.find().sort({ createdAt: -1 })
  if (ipBlacklist) return res.status(200).json({ ipBlacklist })
  res.status(400).json({ message: "error" })
})

module.exports = router
