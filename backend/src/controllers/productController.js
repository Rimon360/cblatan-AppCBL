const productModel = require("../models/productModel");
const { assignModel } = require("../models/shopModel");
const { seq, getDate, prependToFile } = require("../utils/util");
const { encrypt, decrypt } = require("../functions");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require('path');

module.exports.createProduct = async (req, res) => {
  const file_path = req?.file?.path; // Assuming the file upload is handled by multer and file_path is available 
  console.log(req?.path);

  const { shop_id, domain, email, password, course_name } = req.body;
  let hashedPassword = encrypt(password, process.env.CRYPTO_KEY);

  const products = await productModel.create({
    seq: seq(),
    domain,
    course_name,
    file_path,
    email,
    password: hashedPassword,
    shop_id,
  });
  if (products) {
    const decryptedPassword = decrypt(products.password, process.env.CRYPTO_KEY);
    products.password = decryptedPassword;
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
    { $sort: { createdAt: -1 } },
    {
      $project: {
        k: "$password",
        e: "$email",
        d: "$domain",
        g: "$shop_name",
        c: "$course_name",
        m: "$file_path",
        t: "$createdAt"
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
  // if (!products || products.length === 0) {
  //   return res.status(404).json({ message: "No products found for this shop" });
  // }
  products.forEach((product, i) => {
    if (product.password) {
      const decryptedPassword = decrypt(product.password, process.env.CRYPTO_KEY);
      products[i].password = decryptedPassword;
    }
  });
  res.status(200).json({
    products,
  });
}

module.exports.updateProductById = async (req, res) => {
  try {
    const { id, password, ...updateData } = req.body;
    const decrypted = encrypt(password);
    updateData.password = decrypted;
    const result = await productModel.updateOne({ _id: id }, { $set: updateData });
    if (result.modifiedCount === 0) return res.status(400).json({ message: "Update failed!" });
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    const productData = await productModel.findOne({ _id: id });
    if (productData) {
      let media_path = productData.file_path;
      if (media_path) {
        const fs = require("fs");
        fs.unlink(media_path, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      }
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
