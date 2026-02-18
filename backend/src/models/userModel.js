const mongoose = require("mongoose")
const getPeruTime = require("../utils/util").getPeruTime
const date = new Date()
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  support_status: { type: String, default: 'none', enum:['none', 'pending', 'solved', 'rejected'] },
  username: { type: String, required: true },
  email_verified: { type: Boolean, default: false },
  otp: { type: String, default: null },
  otp_received_time: { type: Number, default: 0 },
  otp_failed_count: { type: Number, default: 0 },
  ip_address: {
    type: String,
  },
  verified_ip: {
    type: String,
    default: "",
  },
  ip_address_history: {
    type: String,
  },
  is_locked: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "Inactive",
  },
  last_ping_timestamp: {
    type: Date,
    default: Date.now(),
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
  wasap: {
    type: String,
    default: "",
  },
  payment_method: {
    type: String,
    default: "",
  },
  first_ip: {
    type: String,
    default: "",
  },
  nstbrowser_email: {
    type: String,
    default: "",
  },
  niche: {
    type: String,
    default: "",
  },
  affiliate: {
    type: String,
    default: "",
  },
  supervisor: {
    type: String,
    default: "",
  },
  observation: {
    type: String,
    default: "",
  },
  sub_start_date: {
    type: String,
    default: date.toISOString().split("T")[0],
  },
  sub_validity: {
    type: Number,
    default: 31,
  },
  profile_group: {
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "member", "appcbl_soft", "specific", "manager"],
    default: "member",
  },
  seq: { type: Number, default: 0 },
  created_by: String,
  createdAt: {
    type: Number,
    default: Date.now,
  },
})

const UserModel = mongoose.model("users", userSchema)
module.exports = UserModel
