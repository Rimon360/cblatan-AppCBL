const express = require("express");
const { createProduct, getProductByShopId, updateProductById, deleteProductById, getReports, resetWastage, getPasswordData } = require("../controllers/productController");
const { memberMiddleware, adminMiddleware, ipTrackMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/get_report", getReports);
router.get("/reset_wastage", resetWastage);
router.get("/getpassworddata/:id", memberMiddleware, ipTrackMiddleware, getPasswordData);
router.post("/create", adminMiddleware, createProduct);
router.post("/update", memberMiddleware, updateProductById);
router.delete("/delete", adminMiddleware, deleteProductById);
router.get("/:id", memberMiddleware, getProductByShopId);


module.exports = router;
