const mongoese = require("mongoose")

const emailActivitySchema = new mongoese.Schema({
  ip: String,
  user_email: String,
  email_body: String,
  email_title: String,
  createdAt: { type: Date, default: Date.now },
})

const emailActivityModel = mongoese.model("emails_activity", emailActivitySchema)
module.exports = emailActivityModel
