const express = require("express");
const { registerUser, loginUser, getUsers, deleteUser, getProtectedData, lockUser, pingPong, resetIpHistory, updateUser } = require("../controllers/userController");
const { authMiddleware, adminMiddleware, memberMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/update", updateUser);
router.post("/login", loginUser);
router.post("/lock", adminMiddleware, lockUser);
router.post("/ping", memberMiddleware, pingPong);
router.post("/resetactivity", adminMiddleware, resetIpHistory);
router.post("/rrrrresetfactivity45453643rFD6533FFd653", resetIpHistory);
router.get("/:isActivity", memberMiddleware, getUsers);
router.get("/protected", authMiddleware, getProtectedData);
router.delete("/:id", deleteUser);
router.post("/dashboard", authMiddleware);


module.exports = router;
