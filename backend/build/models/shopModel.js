"use strict";

var mongoose = require("mongoose");
var shopSchema = new mongoose.Schema({
  shop_name: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    "default": 0
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var assignedShopSchema = new mongoose.Schema({
  shop_id: {
    type: String,
    ref: "shops"
  },
  user_id: {
    type: String,
    ref: "users"
  },
  seq: {
    type: Number,
    "default": 0
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var shopsModel = mongoose.model("shops", shopSchema);
var assignModel = mongoose.model("assigned_shops", assignedShopSchema);
module.exports = {
  shopsModel: shopsModel,
  assignModel: assignModel
};