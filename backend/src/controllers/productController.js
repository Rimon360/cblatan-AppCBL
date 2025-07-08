const productModel = require("../models/productModel");
const { assignModel } = require("../models/shopModel");
const { seq, getDate, prependToFile } = require("../utils/util");
const { encrypt, decrypt } = require("../functions");
const mongoose = require("mongoose");


module.exports.createProduct = async (req, res) => {
  const { shop_id, domain, email, password } = req.body;
  let hashedPassword = encrypt(password, process.env.CRYPTO_KEY);
  if (!shop_id || !domain || !email || !password) {
    return res.status(400).json({ message: "Domain, Email/username or password is required!" });
  }
  const products = await productModel.create({
    seq: seq(),
    domain,
    email,
    password: hashedPassword,
    shop_id,
  });
  if (products) {
    res.status(200).json({
      message: "credential created successfully",
      products,
    });
  }
};

module.exports.getReports = async (req, res) => {
  const products = await productModel.aggregate([
    {
      $addFields: {
        shop_id_obj: { $toObjectId: "$shop_id" },
      },
    },
    {
      $group: {
        _id: "$shop_id_obj",
        products: { $push: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "shops",
        localField: "_id",
        foreignField: "_id",
        as: "shop",
      },
    },
    {
      $unwind: "$shop",
    },
    {
      $project: {
        shop_id: "$_id",
        shop_name: "$shop.shop_name",
        products: 1,
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    products,
  });
};
module.exports.getPasswordData = async (req, res) => {
  const { id } = req.params
  const products = await assignModel.aggregate([
    { $match: { user_id: id } },
    {
      $lookup: {
        from: "products",
        localField: "shop_id",
        foreignField: "shop_id",
        as: "products"
      }
    },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "shops",
        let: { shopId: "$shop_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$shopId" }] }
            }
          }
        ],
        as: "shop"
      }
    }
    ,
    { $unwind: "$shop" },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$products", { shop_name: "$shop.shop_name" }]
        }
      }
    },
    {
      $project: {
        k: "$password",
        e: "$email",
        d: "$domain",
        l: "$shop_name"
      }
    },
    {
      $project: {
        createdAt: 0,
        shop_id: 0,
        seq: 0,
        __v: 0,
        _id: 0 // include or exclude fields as needed
      }
    }])

  res.status(200).json({
    products,
  });
};

module.exports.getProductByShopId = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Credentials id is required" });
  }
  const products = await productModel.find({ shop_id: id }).sort({ product_name: 1 });
  res.status(200).json({
    products,
  });
};
module.exports.updateProductById = async (req, res) => {
  try {
    const { id, wastage, baked } = req.body;
    const username = req?.user?.username || "--";

    const products = await productModel.updateOne({ _id: id }, { $set: { wastage, baked } });
    const data = await productModel.aggregate([
      {
        $addFields: {
          shop_id: { $toObjectId: "$shop_id" },
        },
      },
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }, // replace with actual ID
      },
      {
        $lookup: {
          from: "shops",
          localField: "shop_id",
          foreignField: "_id",
          as: "shops",
        },
      },
      { $unwind: "$shops" },
      {
        $project: {
          product_name: 1,
          seq: 1,
          shop_name: "$shops.shop_name",
        },
      },
    ]);

    let logData = `${getDate()};${data[0].shop_name};${username};${data[0].seq};${data[0].product_name};${baked};${wastage}\n`;

    prependToFile("../backend", logData);


    res.status(200).json({
      message: "success",
      products,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports.resetWastage = async (req, res) => {
  try {
    await productModel.updateMany({}, { $set: { wastage: 0, baked: 0 } });
    res.status(200).json({
      message: "success",
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
module.exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Product id is required" });
    }
    const products = await productModel.deleteOne({ _id: id });
    if (!products) {
      return res.status(400).json({ message: "Deletation failed!" });
    }
    res.status(200).json({
      message: "Product has been deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
