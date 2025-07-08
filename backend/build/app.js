"use strict";

require("dotenv").config();
var express = require("express");
var userRoutes = require("./routes/userRoutes");
var shopRoutes = require("./routes/shopRoutes");
var productRoutes = require("./routes/productRoutes");
var mongoose = require("mongoose");
var dbConfig = require("./config/dbConfig");
var cors = require("cors");
var app = express();
var verifyToken = require("./middlewares/verifyToken");
app.use(cors());
app.use(express.json());
var port = process.env.PORT || 8000;
mongoose.connect(dbConfig.url).then(function () {
  console.log("MongoDB connected");
})["catch"](function (err) {
  console.error("MongoDB connection error:", err);
});
app.use("/api/users", userRoutes);
app.use('/api/products', productRoutes);
app.get("/api/verify-token", verifyToken, function (req, res) {
  res.json({
    message: "success",
    user: req.user
  });
});
app.use('/api/shops', shopRoutes);
app.use(function (req, res) {
  res.status(404).json({
    message: "Route Not Exists"
  });
});

// module.exports = app;

app.listen(port, function () {
  return console.log("Server running on port 3000");
});