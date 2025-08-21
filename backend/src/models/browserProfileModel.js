const mongoese = require("mongoose");


const BrowserProfileSchema = new mongoese.Schema({
    profileName: { type: String },
    profileUniqueName: { type: String },
    profileVersion: { type: String, default: "1.0" },
    proxy: {
        type: String
    },
    extensionUniqueName: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const BrowserProfileModel = mongoese.model('browserProfiles', BrowserProfileSchema)
module.exports = BrowserProfileModel