const BrowserProfileModel = require("../models/browserProfileModel");
const { uniqueString } = require("../functions");
const fs = require("fs");
const path = require('path');
const { getPort } = require("../utils/util")
const rootPath = path.join(__dirname, "..", "..");

module.exports.createBrowserProfile = async (req, res) => {
    let extensionUniqueName = null;
    if (req.file) {
        extensionUniqueName = req?.file?.filename; // Assuming the file upload is handled by multer and file_path is available  
    }
    const { profileName, proxy, startups, group } = req.body;

    const src = path.join(rootPath, 'baseProfile.zip');
    const profileUniqueName = uniqueString() + '.zip';
    const moveto = path.join(rootPath, 'browserProfilesData', profileUniqueName);

    fs.copyFile(src, moveto, (err) => {
        if (err) throw err;
    })

    const profile = await BrowserProfileModel.create({
        profileName,
        profileUniqueName,
        extensionUniqueName,
        proxy,
        startups,
        group
    });
    if (profile) {
        res.status(200).json({
            message: "Profile created successfully",
            profile,
        });
        return
    }
    res.status(503).json({
        message: "Server error, unable to create browser profile",
        error: true,
    });
};
module.exports.updateBrowserProfile = async (req, res) => {
    let { id } = req.body;
    const oldProfile = await BrowserProfileModel.findOne({ _id: id })
    if (!oldProfile) {
        return res.status(200).json({ message: "Old Profile not found", error: true });
    }

    let extensionUniqueName = oldProfile.extensionUniqueName;
    if (req.file) {
        if (oldProfile.extensionUniqueName) {
            const oldExPath = path.join(rootPath, 'extensionsData', oldProfile.extensionUniqueName);
            fs.unlink(oldExPath, ()=>{});
        }
        extensionUniqueName = req?.file?.filename; // Assuming the file upload is handled by multer and file_path is available  
    }
    const { profileName, proxy, startups, group } = req.body;
    const profile = await BrowserProfileModel.updateOne(
        { _id: id },
        {
            $set: {
                profileName,
                extensionUniqueName,
                proxy,
                startups,
                group
            }
        });
    if (profile) {
        res.status(200).json({
            message: "Profile updated successfully"
        });
        return
    }
    res.status(503).json({
        message: "Server error, unable to create browser profile",
        error: true,
    });
};

module.exports.getBrowserProfile = async (req, res) => {

    const { user } = req;
    const role = user.role;
    let queryObj = { group: user.profile_group };
    if (!['admin', 'appcbl_soft', 'specific', 'member', 'all_profile', 'manager'].includes(role)) {
        res.status(200).json({
            message: "¡Aún no tienes permiso para utilizar este software!",
            error: true,
            profiles:[]
        });
        return;
    }
    if (role === 'admin'|| role == 'all_profile') queryObj = {};
    const profiles = await BrowserProfileModel.find(queryObj, { __v: 0 }).sort({ createdAt: -1 });
    if (profiles) {
        let tmp = profiles.map(profile => ({ ...profile.toObject(), port: getPort() }));
        res.status(200).json({
            profiles: tmp
        });
        return;
    }
    res.status(503).json({
        message: "Server error, unable to get profile data",
        error: true,
    });
}
module.exports.deleteBrowserProfile = async (req, res) => {
    const { id } = req.body;
    const profile = await BrowserProfileModel.findOne({ _id: id });
    const browserProfileDir = path.join(rootPath, 'browserProfilesData', profile.profileUniqueName);
    fs.unlink(browserProfileDir, (err) => { })
    fs.unlink(path.join(rootPath, 'syncPath', profile.profileUniqueName), (err) => { })
    if (profile.extensionUniqueName) {
        const extensionDir = path.join(rootPath, 'extensionsData', profile.extensionUniqueName);
        fs.unlink(extensionDir, (err) => { })
    }

    const profiles = await BrowserProfileModel.deleteOne({ _id: id });
    if (profiles) {
        res.status(200).json({ message: "Profile deleted successfully" });
        return;
    }
    res.status(503).json({
        message: "Server error, unable to delete profile",
        error: true,
    });
}