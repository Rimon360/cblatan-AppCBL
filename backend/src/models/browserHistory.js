const mongoese = require("mongoose")

const browserHistorySchema = new mongoese.Schema({
  userid: { type: String },
  history: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const browserHistory = mongoese.model("browser_history", browserHistorySchema)
module.exports = browserHistory
