const mongoose = require("mongoose")
const userUpdateParkedScheme = new mongoose.Schema({
  updated_data: {
    type: Object,
  },
  created_by: String,
  to: String,
  modification: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const userUpdateParked = mongoose.model("userUpdateParked", userUpdateParkedScheme)
module.exports = userUpdateParked
