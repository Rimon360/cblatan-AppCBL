const express = require("express")
const router = express.Router()
const { adminMiddleware } = require("../middlewares/authMiddleware")
const IpModel = require("../models/ipModel")

router.post("/", adminMiddleware, async (req, res) => {
  const { ip_address } = req.body
  const ip_array = ip_address.split(",")
  const formatedIp = []
  for (const ip of ip_array) {
    if (!ip) continue
    formatedIp.push({ ip_address: ip.trim() })
  }

  const whitelist = await IpModel.insertMany(formatedIp)

  if (whitelist) return res.status(200).json({ message: "success", whitelist })
  res.status(400).json({ message: "error" })
})
router.delete("/", adminMiddleware, async (req, res) => {
  const { id } = req.body
  const whitelist = await IpModel.deleteOne({ _id: id })
  if (whitelist) return res.status(200).json({ message: "success" })
  res.status(400).json({ message: "error" })
})
router.get("/", adminMiddleware, async (req, res) => {
  const whitelist = await IpModel.find().sort({ createdAt: -1 })
  if (whitelist) return res.status(200).json({ whitelist })
  res.status(400).json({ message: "error" })
})

module.exports = router
