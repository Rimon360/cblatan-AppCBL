const express = require("express");
const { createProduct, getProductByShopId, updateProductById, deleteProductById, getReports, resetWastage, getPasswordData, getImage, updateProductImageById, copyProductToSubtitle } = require("../controllers/productController");
const { memberMiddleware, adminMiddleware, ipTrackMiddleware, validateFields } = require("../middlewares/authMiddleware");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });
router.post("/create", adminMiddleware, upload.single('file'), validateFields, createProduct);
router.post("/copy", adminMiddleware, copyProductToSubtitle);
router.get("/get_report", getReports);
router.get("/reset_wastage", resetWastage);
router.get("/getpassworddata/:id", memberMiddleware, ipTrackMiddleware, getPasswordData);
router.post("/update", adminMiddleware, updateProductById);
router.post("/update/image", adminMiddleware, upload.single('file'), updateProductImageById);
router.delete("/delete", adminMiddleware, deleteProductById);
router.get("/:id", adminMiddleware, getProductByShopId);


module.exports = router;
