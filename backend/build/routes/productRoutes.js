"use strict";

var express = require("express");
var _require = require("../controllers/productController"),
  createProduct = _require.createProduct,
  getProductByShopId = _require.getProductByShopId,
  updateProductById = _require.updateProductById,
  deleteProductById = _require.deleteProductById,
  getReports = _require.getReports,
  resetWastage = _require.resetWastage,
  getPasswordData = _require.getPasswordData;
var _require2 = require("../middlewares/authMiddleware"),
  memberMiddleware = _require2.memberMiddleware,
  adminMiddleware = _require2.adminMiddleware,
  ipTrackMiddleware = _require2.ipTrackMiddleware;
var router = express.Router();
router.get("/get_report", getReports);
router.get("/reset_wastage", resetWastage);
router.get("/getpassworddata/:id", memberMiddleware, ipTrackMiddleware, getPasswordData);
router.post("/create", adminMiddleware, createProduct);
router.post("/update", memberMiddleware, updateProductById);
router["delete"]("/delete", adminMiddleware, deleteProductById);
router.get("/:id", memberMiddleware, getProductByShopId);
module.exports = router;