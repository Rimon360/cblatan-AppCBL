const mongoese = require("mongoose");


const BlacklistSchema = new mongoese.Schema({
    blacklistUrl: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const BlacklistUrl = mongoese.model('blacklistUrl', BlacklistSchema)
module.exports = BlacklistUrl