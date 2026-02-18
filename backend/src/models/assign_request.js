const mongoose = require("mongoose")

const assignRequestSchema = new mongoose.Schema({
  requested_by_email: String,
  requested_for_email: String,
  course_name: String,
  shop_id: {
    type: String,
    ref: "shops",
  },
  checked: {
    type: Boolean,
    default: false,
  },
  expires: { type: String },
  user_id: {
    type: String,
    ref: "users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const assignRequestModel = mongoose.model("assign_request", assignRequestSchema)
module.exports = assignRequestModel
