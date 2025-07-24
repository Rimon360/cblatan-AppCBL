const express = require("express");
const { createShop, getAllShop, assignShop, unassignShop, getAssignedShops, getShopByUserId, deleteShop, getUserByShopId, createSubtitle, getSubtitle, updateShop, updateSubtitle, deleteSubtitle } = require("../controllers/shopController");
const { adminMiddleware, memberMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", adminMiddleware, createShop);
router.post("/create_subtitle", adminMiddleware, createSubtitle);
router.get("/subtitle/:id", adminMiddleware, getSubtitle);
router.post("/update", adminMiddleware, updateShop);
router.post("/subtitle/update", adminMiddleware, updateSubtitle);
router.post("/assign", adminMiddleware, assignShop);
router.get("/getassignedshops/:user_id", adminMiddleware, getAssignedShops);
router.delete("/unassign", adminMiddleware, unassignShop);
router.delete("/delete", adminMiddleware, deleteShop);
router.delete("/subtitle", adminMiddleware, deleteSubtitle);
router.get("/", getAllShop);
router.get("/member/:id", memberMiddleware, getShopByUserId);
router.get("/getuserbyshopid/:shop_id", getUserByShopId);
module.exports = router;
