const mongoese = require("mongoose")

const emailSchema = new mongoese.Schema({
  title: String,
  sender: String,
  time: String,
  body: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

const EmailModel = mongoese.model("emails_receiver", emailSchema)
module.exports = EmailModel
