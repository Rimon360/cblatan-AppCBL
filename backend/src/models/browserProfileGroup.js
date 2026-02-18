const mongoese = require("mongoose");


const ProfileGroupSchema = new mongoese.Schema({
    name: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const ProfileGroupModel = mongoese.model('profile_groups', ProfileGroupSchema)
module.exports = ProfileGroupModel