const adminChatModel = require("../models/adminChatModel")
const supportChatModel = require("../models/supportChatModel")
const UserModel = require("../models/userModel")

// by ws
module.exports.insertGroupConversation = async (data) => {
  try {
    await adminChatModel.insertOne(data)
  } catch (err) {
    console.log(err.message)
  }
}
// by ws
module.exports.insertPrivateConversation = async (data, user) => {
  try { 
    if (!["admin"].includes(user.role)) {
      let oldStatus = await UserModel.find({ _id: user.id }, { support_status: 1 }) 
      
      if (oldStatus.support_status == "none" || !oldStatus.support_status) {
        await UserModel.updateOne({ _id: user.id }, { $set: { support_status: "pending" } })
      }
    }
    await supportChatModel.insertOne(data)
  } catch (err) {
    console.log(err.message)
  }
}
module.exports.getGroupConversation = async (req, res) => {
  try {
    const from = new Date(Date.now() - 24 * 60 * 60 * 1000)
    let result = await adminChatModel.find({ createdAt: { $gte: from } }).limit(300)
    res.status(200).json(result)
  } catch (err) {
    console.log(err.message)
    res.status(403).json({ error: true, message: err.message })
  }
}
module.exports.getPrivateConversation = async (req, res) => {
  try {
    const { toUserId } = req.params
    const from = new Date(Date.now() - 24 * 60 * 60 * 1000)
    let result = await supportChatModel.find({ to: toUserId, createdAt: { $gte: from } }).limit(300)
    res.status(200).json(result)
  } catch (err) {
    console.log(err.message)
    res.status(403).json({ error: true, message: err.message })
  }
}
module.exports.getChatPrivateUsers = async (req, res) => {
  try {
    // const from = new Date(Date.now() - 24 * 60 * 60 * 1000)
    let result = await UserModel.find({ support_status: { $ne: "none" } }, { email: 1, role: 1, support_status: 1, username: 1, last_ping_timestamp: 1 })

    res.status(200).json(result)
  } catch (err) {
    res.status(403).json({ error: true, message: err.message })
  }
}

module.exports.handlePrivateChatFileUploading = async (req, res) => {
  try {
    let filename = req.file?.filename
    res.status(200).json(filename)
  } catch (error) {
    res.status(403).json({ error: true, message: err.message })
  }
}
module.exports.handleUserSupportStatusChange = async (req, res) => {
  try {
    let { _id, support_status } = req.body
    let mod = await UserModel.updateOne({ _id }, { $set: { support_status } })
    res.status(200).json(mod.modifiedCount)
  } catch (error) {
    res.status(403).json({ error: true, message: err.message })
  }
}
