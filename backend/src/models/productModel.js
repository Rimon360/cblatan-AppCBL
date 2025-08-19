const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  course_name: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  file_path: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  seq: { type: Number, default: 0 },
  shop_id: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("products", productSchema);
module.exports = UserModel; 