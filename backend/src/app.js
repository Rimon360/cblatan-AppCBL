require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const shopRoutes = require("./routes/shopRoutes");
const productRoutes = require("./routes/productRoutes");
const mongoose = require("mongoose");
const dbConfig = require("./config/dbConfig");
const cors = require("cors");
const app = express();
const verifyToken = require("./middlewares/verifyToken");

// app.set('trust proxy', true); // for Express
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;
mongoose
  .connect(dbConfig.url)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


app.use("/api/users", userRoutes);

app.use('/api/products', productRoutes)

app.get("/api/verify-token", verifyToken, (req, res) => {
  res.json({ message: "success", user: req.user });
});

app.use('/api/shops', shopRoutes)

app.use((req, res) => {
  res.status(404).json({ message: "Technical Error!. Please try again later!", d: req });
});

// module.exports = app;


app.listen(port, "0.0.0.0", () => {
  console.log("Server running on port: " + port);
}); 