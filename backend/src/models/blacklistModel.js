const mongoese = require("mongoose")

const BlacklistSchema = new mongoese.Schema({
  blacklistUrl: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const toolBlockedScheme = new mongoese.Schema({
  isBlockedForAll: Boolean,
  username_or_email: String,
  tool_url: String,
  createdAt: { type: Date, default: Date.now },
})
const toolBlockedListModel = mongoese.model("toolblokedlists", toolBlockedScheme)
const blacklistModel = mongoese.model("blacklistUrl", BlacklistSchema)
module.exports = { blacklistModel, toolBlockedListModel }
