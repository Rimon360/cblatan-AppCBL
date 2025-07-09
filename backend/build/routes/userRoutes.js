"use strict";

var express = require("express");
var _require = require("../controllers/userController"),
  registerUser = _require.registerUser,
  loginUser = _require.loginUser,
  getUsers = _require.getUsers,
  deleteUser = _require.deleteUser,
  getProtectedData = _require.getProtectedData,
  lockUser = _require.lockUser,
  pingPong = _require.pingPong;
var _require2 = require("../middlewares/authMiddleware"),
  authMiddleware = _require2.authMiddleware,
  adminMiddleware = _require2.adminMiddleware,
  memberMiddleware = _require2.memberMiddleware;
var router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/lock", adminMiddleware, lockUser);
router.post("/ping", memberMiddleware, pingPong);
router.get("/:isActivity", memberMiddleware, getUsers);
router.get("/protected", authMiddleware, getProtectedData);
router["delete"]("/:id", deleteUser);
router.post("/dashboard", authMiddleware);
module.exports = router;