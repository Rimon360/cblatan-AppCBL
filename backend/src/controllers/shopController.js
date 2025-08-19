const { shopsModel, assignModel, subtitleModel } = require("../models/shopModel");
const productModel = require("../models/productModel");
const { seq } = require("../utils/util");
const UserModel = require("../models/userModel");
const fs = require('fs');
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
module.exports.createSubtitle = async (req, res) => {
  try {
    const { subtitle, shop_id } = req.body;
    if (!subtitle) {
      return res.status(400).json({ message: "subtitle is required" });
    }
    const shops = await subtitleModel.create({ subtitle, shop_id });
    res.status(200).json({ message: "Subtitle created successfully", shops });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
module.exports.getSubtitle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const subtitle = await subtitleModel.find({ shop_id: id });
    res.status(200).json({ message: "Subtitle created successfully", subtitle });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
module.exports.updateShop = async (req, res) => {
  try {
    const { shop_name, id } = req.body;
    if (!shop_name) {
      return res.status(400).json({ message: "Group title is required" });
    }
    if (!id) {
      return res.status(400).json({ message: "Shop id is missing" });
    }

    const shops = await shopsModel.updateOne({ _id: id }, { shop_name });
    res.status(200).json({ message: "Updated successfully", shops });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
module.exports.updateSubtitle = async (req, res) => {
  try {
    const { subtitle, id } = req.body;
    if (!subtitle) {
      return res.status(400).json({ message: "Group title is required" });
    }
    if (!id) {
      return res.status(400).json({ message: "Shop id is missing" });
    }

    const shops = await subtitleModel.updateOne({ _id: id }, { subtitle });
    res.status(200).json({ message: "Updated successfully", shops });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
module.exports.assignShop = async (req, res) => {
  const { shop_id, user_id } = req.body;
  if (shop_id.length < 1) {
    return res.status(400).json({ message: "Group id cant be empty" });
  }
  if (!user_id) {
    return res.status(400).json({ message: "user id is required" });
  }
  const shop = await assignModel.find({ _id: { $in: shop_id } });
  let shops = [];
  shop_id.forEach(async (id) => {
    if (!shop.includes(id)) {
      const random = seq();
      let tmp = await assignModel.create({
        seq: random,
        shop_id: id,
        user_id,
      });
      if (tmp) {
        shops.push(tmp);
      }
    }
  });
  res.status(200).json({ message: "Group assigned successfully", shops });

};
module.exports.unassignShop = async (req, res) => {
  const { shop_id, user_id } = req.body;
  if (shop_id.length < 1) {
    return res.status(400).json({ message: "Group id cant be empty" });
  }
  if (!user_id) {
    return res.status(400).json({ message: "user id is required" });
  }
  shop_id.forEach(async (shop_id) => {
    await assignModel.findOneAndDelete({ shop_id, user_id });
  });
  res.status(200).json({ message: "Group unassigned successfully" });
};
module.exports.deleteShop = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Group id is required" });
  }
  const deleted = await shopsModel.deleteOne({ _id: id });
  const subtitles = await subtitleModel.find({ shop_id: id });

  for (const s of subtitles) {
    let products = await productModel.find({ shop_id: s._id });
    for (const p of products) {
      fs.unlink(p.file_path, (err) => {
        console.log(err);
      })
    }
    await productModel.deleteMany({ shop_id: s._id });
  }

  const subtitleDeleted = await subtitleModel.deleteMany({ shop_id: id });


  const assignDeleted = await assignModel.deleteMany({ shop_id: id });
  const assignProduct = await productModel.deleteMany({ shop_id: id });
  res.status(200).json({ message: "Group deleted successfully", deleted, assignDeleted, assignProduct, subtitleDeleted });
};
module.exports.deleteSubtitle = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Group id is required" });
  }
  await subtitleModel.deleteOne({ _id: id });

  let products = await productModel.find({ shop_id: id });
  for (const p of products) {
    fs.unlink(p.file_path, (err) => {
      console.log(err);
    })
  }
  await productModel.deleteMany({ shop_id: id });

  const subtitleDeleted = await subtitleModel.deleteMany({ shop_id: id });


  const assignDeleted = await assignModel.deleteMany({ shop_id: id });
  const assignProduct = await productModel.deleteMany({ shop_id: id });
  res.status(200).json({ message: "Group deleted successfully", subtitleDeleted });
};
module.exports.getAssignedShops = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ message: "user id is required" });
  }
  const shops = await assignModel.find({ user_id }).distinct("shop_id").sort({ createdAt: -1 });
  if (!shops) {
    return res.status(200).json({ message: "No Group assigned", shops: [] });
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
    return res.status(200).json({ message: "No Group assigned yet", shops: [] });
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
    return res.status(200).json({ message: "No Group assigned yet", users: [] });
  }
  const users = await UserModel.find({ _id: { $in: user_ids } }).sort({ username: 1 });
  res.status(200).json({
    users,
  });
};
