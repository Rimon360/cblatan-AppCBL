const express = require("express")
const {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
  getProtectedData,
  lockUser,
  pingPong,
  resetIpHistory,
  updateUser,
  browserHistoryController,
  changeEmail,
  sendOTP,
  verifyOTP,
  checkEmail,
  changePassword,
  getBrowserHistory,
  deleteBrowserHistory,
  resetBrowserHistory,
  getApiActivity,
  resetApiActivity
} = require("../controllers/userController")
const { authMiddleware, adminMiddleware, memberMiddleware } = require("../middlewares/authMiddleware")
const rateLimit = require("express-rate-limit")
const router = express.Router()

// Example: stricter limiter for login route
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, please try again later.",
})
const registerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many register attempts, please try again after 24 hours.",
})

router.get("/get-api-activity", adminMiddleware, getApiActivity)
router.post("/api_activity/reset", adminMiddleware, resetApiActivity)
router.post("/register", registerLimiter, registerUser)
router.post("/update", updateUser)
router.post("/login", loginLimiter, loginUser)
router.post("/lock", adminMiddleware, lockUser)
router.post("/ping", memberMiddleware, pingPong)
router.post("/resetactivity", adminMiddleware, resetIpHistory)
router.post("/rrrrresetfactivity45453643rFD6533FFd653", resetIpHistory)
router.get("/:isActivity", adminMiddleware, getUsers) // was memberMiddleware
router.get("/protected", authMiddleware, getProtectedData)
router.delete("/:id", deleteUser)
router.post("/dashboard", authMiddleware)
router.post("/history", browserHistoryController)
router.post("/history/get", adminMiddleware, getBrowserHistory)
router.post("/history/delete", adminMiddleware, deleteBrowserHistory)
router.post("/history/resethistory", adminMiddleware, resetBrowserHistory)
router.post("/change-email", changeEmail)
router.post("/send-otp", memberMiddleware, sendOTP)
router.post("/verify-otp", memberMiddleware, verifyOTP)
router.post("/verifyotp", verifyOTP)
router.post("/check-email", checkEmail)
router.post("/change-password", changePassword)

module.exports = router
