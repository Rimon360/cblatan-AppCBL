const mongoese = require("mongoose");


const LogosSchema = new mongoese.Schema({
    name: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const LogosModel = mongoese.model('logos', LogosSchema)
module.exports = LogosModel