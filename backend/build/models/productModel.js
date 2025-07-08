"use strict";

var mongoose = require("mongoose");
var productSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    "default": 0
  },
  shop_id: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var UserModel = mongoose.model("products", productSchema);
module.exports = UserModel;