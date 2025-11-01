const mongoose = require("mongoose")

const blockedIpSchema = new mongoose.Schema({
  ip_address: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const blockedIpModel = mongoose.model("blockedIp", blockedIpSchema)
module.exports = blockedIpModel
