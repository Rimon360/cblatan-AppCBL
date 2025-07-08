const { shopsModel, assignModel } = require("../models/shopModel");
const productModel = require("../models/productModel");
const { seq } = require("../utils/util");
const UserModel = require("../models/userModel");
module.exports.createShop = async (req, res) => {
  try {
    const { shop_name } = req.body;
    if (!shop_name) {
      return res.status(400).json({ message: "title is required" });
    }

    // const exists = await shopsModel.findOne({shop_name});
    // if (exists) {
    //   return res.status(400).json({message: "Title already exists"});
    // } 
    const shops = await shopsModel.create({ shop_name, seq: seq() });
    res.status(200).json({ message: "Title created successfully", shops });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
module.exports.assignShop = async (req, res) => {
  const { shop_id, user_id } = req.body;
  if (!shop_id) {
    return res.status(400).json({ message: "Credentials id is required" });
  }
  if (!user_id) {
    return res.status(400).json({ message: "user id is required" });
  }
  const shop = await assignModel.findById(shop_id);
  if (shop) {
    return res.status(404).json({ message: "Credentials already assigned" });
  }
  const random = seq();
  const shops = await assignModel.create({
    seq: random,
    shop_id,
    user_id,
  });
  if (!shops) {
    return res.status(400).json({ message: "Credentials not assigned" });
  }
  res.status(200).json({ message: "Credentials assigned successfully", shops });
};
module.exports.unassignShop = async (req, res) => {
  const { shop_id, user_id } = req.body;
  if (!shop_id) {
    return res.status(400).json({ message: "Credentials id is required" });
  }
  if (!user_id) {
    return res.status(400).json({ message: "user id is required" });
  }
  const deleted = await assignModel.findOneAndDelete({ shop_id, user_id });
  if (!deleted) {
    return res.status(404).json({ message: "Credentials not found" });
  }
  res.status(200).json({ message: "Credentials unassigned successfully" });
};
module.exports.deleteShop = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Credentials id is required" });
  }
  const deleted = await shopsModel.deleteOne({ _id: id });
  const assignDeleted = await assignModel.deleteMany({ shop_id: id });
  const assignProduct = await productModel.deleteMany({ shop_id: id });
  res.status(200).json({ message: "Credentials deleted successfully", deleted, assignDeleted, assignProduct });
};
module.exports.getAssignedShops = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ message: "user id is required" });
  }
  const shops = await assignModel.find({ user_id }).distinct("shop_id").sort({ createdAt: -1 });
  if (!shops) {
    return res.status(200).json({ message: "No Credentials assigned", shops: [] });
  }
  res.status(200).json({ shops });
};

module.exports.getAllShop = async (req, res) => {
  const shops = await shopsModel.find().sort({ _id: 1 });
  res.status(200).json({
    shops,
  });
};
module.exports.getShopByUserId = async (req, res) => {
  const { id } = req.params;
  const shopsId = await assignModel.find({ user_id: id }).distinct("shop_id");
  if (shopsId.length < 1) {
    return res.status(200).json({ message: "No Credentials assigned yet", shops: [] });
  }
  const shops = await shopsModel.find({ _id: { $in: shopsId } }).sort({ createdAt: -1 });
  res.status(200).json({
    shops,
  });
};
module.exports.getUserByShopId = async (req, res) => {
  const { shop_id } = req.params;
  const user_ids = await assignModel.find({ shop_id: shop_id }).distinct("user_id");
  if (user_ids.length < 1) {
    return res.status(200).json({ message: "No Credentials assigned yet", users: [] });
  }
  const users = await UserModel.find({ _id: { $in: user_ids } }).sort({ username: 1 });
  res.status(200).json({
    users,
  });
};
