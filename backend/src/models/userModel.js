const mongoose = require("mongoose");
const getPeruTime = require("../utils/util").getPeruTime;
const date = new Date();
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
  wasap: {
    type: String,
    default: '',
  },
  payment_method: {
    type: String,
    default: '',
  },
  first_ip: {
    type: String,
    default: '',
  },
  nstbrowser_email: {
    type: String,
    default: '',
  },
  // dicloak_email: {
  //   type: String,
  //   default: '',
  // },
  // subscription_term: {
  //   type: String,
  //   default: '',
  // },
  niche: {
    type: String,
    default: '',
  },
  affiliate: {
    type: String,
    default: '',
  },
  supervisor: {
    type: String,
    default: '',
  },
  observation: {
    type: String,
    default: '',
  },
  sub_start_date: {
    type: String,
    default: date.toISOString().split('T')[0],
  },
  sub_validity: {
    type: Number,
    default: 31,
  },
  role: {
    type: String,
    enum: ["admin", "member","appcbl_soft",'specific'],
    default: "member",
  },
  seq: { type: Number, default: 0 },
  createdAt: {
    type: Number,
    default: Date.now,
  }
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
