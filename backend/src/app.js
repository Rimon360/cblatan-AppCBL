require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const whiteList = require('./routes/whiteList');
const shopRoutes = require("./routes/shopRoutes");
const productRoutes = require("./routes/productRoutes");
const mongoose = require("mongoose");
const dbConfig = require("./config/dbConfig");
const cors = require("cors");
const app = express();
const verifyToken = require("./middlewares/verifyToken");
const helmet = require("helmet");
const port = process.env.PORT || 8000;
const path = require('path');

app.use(cors()); // Allow all origins, adjust as needed
app.use(helmet()); // for security headers 
app.use(express.json());
app.set('trust proxy', 'loopback');

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100000, // limit each IP
});

app.use(limiter);

mongoose
  .connect(dbConfig.url)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


app.use("/api/users", userRoutes);
app.use('/api/products', productRoutes);
app.get("/api/verify-token", verifyToken, (req, res) => {
  res.json({ message: "success", user: req.user });
});
app.use('/api/shops', shopRoutes)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/whitelist', whiteList)

app.use((req, res) => {
  console.log('404 for:', req.originalUrl);
  res.status(404).json({ message: "Technical Error!. Please try again later!", d: req.protocol + "://" + req.get("host") + req.originalUrl });
});

// module.exports = app;


app.listen(port, "0.0.0.0", () => {
  console.log("Server running on port: " + port);
}); 