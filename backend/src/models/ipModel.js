const mongoese = require("mongoose");


const IpSchema = new mongoese.Schema({
    ip_address: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const IpModel = mongoese.model('whitelists', IpSchema)
module.exports = IpModel