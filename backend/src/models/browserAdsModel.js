const mongoese = require("mongoose");


const AdsSchema = new mongoese.Schema({
    name: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const AdsModel = mongoese.model('ads', AdsSchema)
module.exports = AdsModel