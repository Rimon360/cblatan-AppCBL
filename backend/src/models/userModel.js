const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  ip_address: {
    type: String
  },
  ip_address_history: {
    type: String
  },
  is_locked: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: "Inactive"
  },
  last_ping_timestamp: {
    type: Number,
    default: 0
  },
  usags_limit: {
    type: Number,
    default: 1,
  },
  current_usags: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  seq: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
