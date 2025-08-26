const fs = require("fs");
const express = require("express");
const router = express.Router();
const { uniqueString } = require("../functions");
const { createBrowserProfile, getBrowserProfile, deleteBrowserProfile, updateBrowserProfile } = require("../controllers/browserController");
const { authMiddleware, adminMiddleware, memberMiddleware } = require("../middlewares/authMiddleware");
const { moveFolder, zipFolder } = require('../utils/util')
const unzipper = require("unzipper")


const multer = require('multer');
const path = require('path');
const BrowserProfileModel = require("../models/browserProfileModel");

const extensionStorage = multer.diskStorage({
    destination: 'extensionsData/',
    filename: (req, file, cb) => {
        cb(null, uniqueString() + path.extname(file.originalname))
    },
});

const syncProfileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'syncPath/';
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
});


const extensionUpload = multer({ storage: extensionStorage });
const syncProfileUpload = multer({ storage: syncProfileStorage });


router.post("/create", adminMiddleware, extensionUpload.single('file'), createBrowserProfile);
router.get("/get", memberMiddleware, getBrowserProfile);
router.get("/download", memberMiddleware, async (req, res) => {
    const filePath = req.query.filepath + '.zip';
    const filename = req.query.filepath.split('/').at(-1);

    if (!fs.existsSync(filePath)) {
        await new Promise(rs => {
            let count = 0;
            let int = setInterval(() => {
                if (fs.existsSync(filePath)) { clearInterval(int); rs(); }
                if (count > 3 && !fs.existsSync(filePath)) { clearInterval(int); res.status(200).json({ error: true, message: "Profile not found" }) }
                count++
            }, 500)
        })
    }


    res.setHeader("Content-Disposition", `attachment; filename="${filename}.zip"`);
    res.setHeader("Content-Type", "application/octet-stream");

    const stat = fs.statSync(filePath);
    res.setHeader("Content-Length", stat.size);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
});
router.post("/update", adminMiddleware, extensionUpload.single('file'), updateBrowserProfile);
router.post("/delete", adminMiddleware, deleteBrowserProfile);
router.post("/getversion", (req, res) => {
    (async () => {
        const { profileUniqueName } = req.body;
        try {
            const result = await BrowserProfileModel.findOne({ profileUniqueName });
            res.status(200).json({ version: result.profileVersion.toString() })
        } catch (error) {
            res.status(200).json({ error: true, message: "Server error" })
        }
    })()
});
router.post("/sync", adminMiddleware, syncProfileUpload.single('file'), async (req, res) => {
    const fileZipName = req.file.filename; // zip file name 
    const profileVersion = req.body.profileVersion// || Date.now()  
    let isError = false;
    try {
        await BrowserProfileModel.updateOne({ profileUniqueName: fileZipName }, { $set: { profileVersion } });
    } catch (error) {
        isError = true;
    }
    res.status(200).json({ error: isError, message: 'success' })
});

module.exports = router;
