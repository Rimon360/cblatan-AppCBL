const express = require("express")
const router = express.Router()
const { adminMiddleware, memberMiddleware } = require("../middlewares/authMiddleware")
const emailModel = require("../models/emailModel")
const emailActivityModel = require("../models/emailActivityModel")
const multer = require("multer")
const upload = multer()
const { simpleParser } = require("mailparser")
router.post("/add/dns_email_add", upload.any(), async (req, res) => {
  try {
    // const sender = req.body.from
    // const title = req.body.subject
    // const body = req.body.text || req.body.html // Plain text or HTML body

    // const headers = req.body.headers
    // const dateMatch = headers.match(/^Date: (.*)$/m)
    // const time = dateMatch ? dateMatch[1] : new Date().toISOString()

    const raw = req.body.email // full raw MIME

    const parsed = await simpleParser(raw)

    const title = parsed.subject
    const sender = parsed.from?.text
    const time = parsed.date
    const body = parsed.html || parsed.textAsHtml

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
router.post("/email_activity/reset", adminMiddleware, async (req, res) => {
  const email_activity = await emailActivityModel.deleteMany({})
  if (email_activity) return res.status(200).json([])
  res.status(200).json([])
})

module.exports = router
