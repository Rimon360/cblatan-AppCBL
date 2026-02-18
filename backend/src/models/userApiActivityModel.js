const mongoose = require("mongoose")

const apiActivitySchema = new mongoose.Schema({
  ip_address: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "",
  },
  peru_time: {
    type: String,
  },
  api_route: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const apiActivityModel = mongoose.model("apiactivity", apiActivitySchema)
module.exports = apiActivityModel
