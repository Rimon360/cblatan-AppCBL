const mongoose = require("mongoose")

const supportChatModelSchema = new mongoose.Schema({
  sender: String,
  to: String,
  avatar: String,
  content: String,
  content_type: { type: String, default: "txt" },
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const supportChatModel = mongoose.model("supportChatModel", supportChatModelSchema)
module.exports = supportChatModel
