const mongoose = require("mongoose")

const browsingHistorySchema = new mongoose.Schema({
  email: {
    type: String,
    default: null,
  },
  ip: {
    type: String,
  },
  ip_blocked: { type: Boolean, default: false },
  is_locked: { type: Boolean, default: false },
  user_id: {
    type: String,
  },
  role: {
    type: String,
  },
  browsed_url: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})
const BrowsingHistoryModel = mongoose.model("browsingHistory", browsingHistorySchema)
module.exports = BrowsingHistoryModel
