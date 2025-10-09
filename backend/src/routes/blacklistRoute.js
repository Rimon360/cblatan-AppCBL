const express = require('express');
const router = express.Router();
const { adminMiddleware, memberMiddleware } = require("../middlewares/authMiddleware");
const blacklistModel = require("../models/blacklistModel")

router.post('/add', adminMiddleware, async (req, res) => {
    const { blacklistUrl } = req.body;
    const alreadyExist = await blacklistModel.find();
    let blacklist;
    if (alreadyExist.length > 0) {
        blacklist = await blacklistModel.updateMany({}, { $set: { blacklistUrl } })
    } else {
        blacklist = await blacklistModel.insertOne({ blacklistUrl })
    }

    if (blacklist) return res.status(200).json({ message: "success" });
    res.status(400).json({ message: "error" });

})

router.get('/get', async (req, res) => {
    const blacklistUrl = (await blacklistModel.findOne({}, { blacklistUrl: 1, _id: 0 }))
    if (blacklistUrl) return res.status(200).json({ blacklistUrl: atob(blacklistUrl.blacklistUrl) });
    res.status(200).json(blacklistUrl);

})

module.exports = router;