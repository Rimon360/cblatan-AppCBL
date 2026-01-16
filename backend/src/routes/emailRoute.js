const express = require("express")
const router = express.Router()
const { adminMiddleware, memberMiddleware } = require("../middlewares/authMiddleware")
const emailModel = require("../models/emailModel")
const emailActivityModel = require("../models/emailActivityModel")

router.post("/add/dns_email_add", async (req, res) => {
  try {
    const { title, sender, time, body } = req.body
    console.log(req.body)

    if (!title || !sender || !time || !body) throw new Error("All fields are extremely required")
    let emailInsert = await emailModel.insertOne({ title, sender, time, body })
    if (emailInsert) return res.status(200).json({ message: "success" })
  } catch (error) {
    res.status(400).json({ message: error.message || "Controller Error" })
  }
})

router.patch("/mark-read", memberMiddleware, async (req, res) => {
  const { emailId } = req.body
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  const { email_body, email_title } = req.body
  const { email } = req.user
  const user_email = email

  if (!ip || !email_body || !email_title || !user_email) throw new Error("All fields are extremely required")
  await emailActivityModel.insertOne({ ip, email_body, email_title, user_email })

  let updated = await emailModel.updateOne({ _id: emailId }, { $set: { isRead: true } })
  if (updated.modifiedCount > 0) return res.status(200).json({ message: "success" })
  res.status(404).json([])
})
router.get("/get", memberMiddleware, async (req, res) => {
  let emailList = await emailModel.find().sort({ createdAt: -1 }).limit(25)
  //   if (emailList.length < 20) emailList = await emailModel.find({}).sort({ createdAt: -1 })
  if (emailList) return res.status(200).json({ emailList })
  res.status(200).json([])
})
router.get("/email_activity/get", adminMiddleware, async (req, res) => {
  const email_activity = await emailActivityModel.find({}).sort({ createdAt: -1 }).limit(400)
  if (email_activity) return res.status(200).json({ email_activity })
  res.status(200).json([])
})

module.exports = router
