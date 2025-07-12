"use strict";

var express = require("express");
var _require = require("../controllers/productController"),
  createProduct = _require.createProduct,
  getProductByShopId = _require.getProductByShopId,
  updateProductById = _require.updateProductById,
  deleteProductById = _require.deleteProductById,
  getReports = _require.getReports,
  resetWastage = _require.resetWastage,
  getPasswordData = _require.getPasswordData,
  getImage = _require.getImage;
var _require2 = require("../middlewares/authMiddleware"),
  memberMiddleware = _require2.memberMiddleware,
  adminMiddleware = _require2.adminMiddleware,
  ipTrackMiddleware = _require2.ipTrackMiddleware,
  validateFields = _require2.validateFields;
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function filename(_, file, cb) {
    return cb(null, Date.now() + '-' + file.originalname);
  }
});
var upload = multer({
  storage: storage
});
router.post("/create", adminMiddleware, upload.single('file'), validateFields, createProduct);
router.get("/image/:file_path", getImage);
router.get("/get_report", getReports);
router.get("/reset_wastage", resetWastage);
router.get("/getpassworddata/:id", memberMiddleware, ipTrackMiddleware, getPasswordData);
router.post("/update", memberMiddleware, updateProductById);
router["delete"]("/delete", adminMiddleware, deleteProductById);
router.get("/:id", adminMiddleware, getProductByShopId);
module.exports = router;