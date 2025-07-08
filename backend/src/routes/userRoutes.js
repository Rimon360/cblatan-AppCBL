const express = require("express");
const { registerUser, loginUser, getUsers, deleteUser, getProtectedData, lockUser, pingPong } = require("../controllers/userController");
const { authMiddleware, adminMiddleware, memberMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/lock", adminMiddleware, lockUser);
router.post("/ping", memberMiddleware, pingPong);
router.get("/:isActivity", getUsers);
router.get("/protected", authMiddleware, getProtectedData);
router.delete("/:id", deleteUser);
router.post("/dashboard", authMiddleware);


module.exports = router;
