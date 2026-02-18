const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  shop_name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: "title"
  },
  seq: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const subtitleSchema = new mongoose.Schema({
  subtitle: {
    type: String,
    required: true
  },
  shop_id: {
    type: String,
    default: "title"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const assignedShopSchema = new mongoose.Schema({
  shop_id: {
    type: String,
    ref: "shops",
  },
  checked: {
    type: Boolean,
    default: false
  },
  expires: {
    type: String
  },
  user_id: {
    type: String,
    ref: "users",
  },
  seq: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const shopsModel = mongoose.model("shops", shopSchema);
const assignModel = mongoose.model("assigned_shops", assignedShopSchema);
const subtitleModel = mongoose.model("subtitles", subtitleSchema);
module.exports = { shopsModel, assignModel, subtitleModel };