const mongoese = require("mongoose");


const BrowserProfileSchema = new mongoese.Schema({
    profileName: { type: String },
    profileUniqueName: { type: String },
    profileVersion: { type: Number, default: Date.now() },
    group: {
        type: String
    },
    proxy: {
        type: String
    },
    extensionUniqueName: {
        type: String,
        default: null
    },
    startups: { type: String, default: '' },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const BrowserProfileModel = mongoese.model('browserProfiles', BrowserProfileSchema)
module.exports = BrowserProfileModel