const express = require("express");
const router = express.Router();
const { uniqueString } = require("../functions");
const { createBrowserProfile, getBrowserProfile, deleteBrowserProfile, updateBrowserProfile } = require("../controllers/browserController");
const { authMiddleware, adminMiddleware, memberMiddleware } = require("../middlewares/authMiddleware");

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: 'extensionsData/',
    filename: (_, file, cb) => cb(null, uniqueString() + path.extname(file.originalname)),
});

const upload = multer({ storage });
router.post("/create", upload.single('file'), createBrowserProfile);
router.get("/get", getBrowserProfile);
router.post("/update", upload.single('file'), updateBrowserProfile);
router.post("/delete", deleteBrowserProfile);

module.exports = router;
