const mongoese = require("mongoose")

const AdsSchema = new mongoese.Schema({
  name: { type: String },
  ads_location: { type: String, default: "none" },
  ads_url:String,
  ads_title: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const AdsModel = mongoese.model("ads", AdsSchema)
module.exports = AdsModel
