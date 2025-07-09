"use strict";

var express = require("express");
var _require = require("../controllers/shopController"),
  createShop = _require.createShop,
  getAllShop = _require.getAllShop,
  assignShop = _require.assignShop,
  unassignShop = _require.unassignShop,
  getAssignedShops = _require.getAssignedShops,
  getShopByUserId = _require.getShopByUserId,
  deleteShop = _require.deleteShop,
  getUserByShopId = _require.getUserByShopId;
var _require2 = require("../middlewares/authMiddleware"),
  adminMiddleware = _require2.adminMiddleware,
  memberMiddleware = _require2.memberMiddleware;
var router = express.Router();
router.post("/create", adminMiddleware, createShop);
router.post("/assign", adminMiddleware, assignShop);
router.get("/getassignedshops/:user_id", adminMiddleware, getAssignedShops);
router["delete"]("/unassign", adminMiddleware, unassignShop);
router["delete"]("/delete", adminMiddleware, deleteShop);
router.get("/", getAllShop);
router.get("/member/:id", memberMiddleware, getShopByUserId);
router.get("/getuserbyshopid/:shop_id", getUserByShopId);
module.exports = router;