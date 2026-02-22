const mongose = require("mongoose")

const unreadCountScheme = new mongose.Schema({
  user_id: String,
  unread_count: Number,
})

const unreadCountModel = mongose.model("unreadBroadcastCount", unreadCountScheme)

module.exports =  unreadCountModel
