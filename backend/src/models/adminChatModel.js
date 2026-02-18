const mongoose = require("mongoose")

const adminChatModelSchema = new mongoose.Schema({
  sender: String,
  avatar: String,
  content: String,
  content_type: { type: String, default: "txt", enum: ["txt", "img", "video", "url"] }, 
  roomId: String,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const adminChatModel = mongoose.model("adminChatModel", adminChatModelSchema)
module.exports = adminChatModel
