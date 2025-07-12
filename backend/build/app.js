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
var helmet = require("helmet");
var port = process.env.PORT || 8000;
app.use(helmet()); // for security headers 
app.use(cors({
  origin: "*"
})); // Allow all origins, adjust as needed
app.use(express.json());
app.set('trust proxy', 'loopback');
var rateLimit = require('express-rate-limit');
var limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // 15 min
  max: 500 // limit each IP
});
app.use(limiter);
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
    message: "Technical Error!. Please try again later!",
    d: req.protocol + "://" + req.get("host") + req.originalUrl
  });
});

// module.exports = app;

app.listen(port, "0.0.0.0", function () {
  console.log("Server running on port: " + port);
});