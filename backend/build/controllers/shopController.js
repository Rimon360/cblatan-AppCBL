"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var _require = require("../models/shopModel"),
  shopsModel = _require.shopsModel,
  assignModel = _require.assignModel;
var productModel = require("../models/productModel");
var _require2 = require("../utils/util"),
  seq = _require2.seq;
var UserModel = require("../models/userModel");
module.exports.createShop = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var shop_name, shops, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.p = 0;
          shop_name = req.body.shop_name;
          if (shop_name) {
            _context.n = 1;
            break;
          }
          return _context.a(2, res.status(400).json({
            message: "title is required"
          }));
        case 1:
          _context.n = 2;
          return shopsModel.create({
            shop_name: shop_name,
            seq: seq()
          });
        case 2:
          shops = _context.v;
          res.status(200).json({
            message: "Title created successfully",
            shops: shops
          });
          _context.n = 4;
          break;
        case 3:
          _context.p = 3;
          _t = _context.v;
          res.status(500).json({
            message: "Server error",
            error: _t.message
          });
        case 4:
          return _context.a(2);
      }
    }, _callee, null, [[0, 3]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
module.exports.assignShop = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var _req$body, shop_id, user_id, shop, shops;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _req$body = req.body, shop_id = _req$body.shop_id, user_id = _req$body.user_id;
          if (!(shop_id.length < 1)) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, res.status(400).json({
            message: "Group id cant be empty"
          }));
        case 1:
          if (user_id) {
            _context3.n = 2;
            break;
          }
          return _context3.a(2, res.status(400).json({
            message: "user id is required"
          }));
        case 2:
          _context3.n = 3;
          return assignModel.find({
            _id: {
              $in: shop_id
            }
          });
        case 3:
          shop = _context3.v;
          shops = [];
          shop_id.forEach(/*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(id) {
              var random, tmp;
              return _regenerator().w(function (_context2) {
                while (1) switch (_context2.n) {
                  case 0:
                    if (shop.includes(id)) {
                      _context2.n = 2;
                      break;
                    }
                    random = seq();
                    _context2.n = 1;
                    return assignModel.create({
                      seq: random,
                      shop_id: id,
                      user_id: user_id
                    });
                  case 1:
                    tmp = _context2.v;
                    if (tmp) {
                      shops.push(tmp);
                    }
                  case 2:
                    return _context2.a(2);
                }
              }, _callee2);
            }));
            return function (_x5) {
              return _ref3.apply(this, arguments);
            };
          }());
          res.status(200).json({
            message: "Group assigned successfully",
            shops: shops
          });
        case 4:
          return _context3.a(2);
      }
    }, _callee3);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
module.exports.unassignShop = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var _req$body2, shop_id, user_id;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _req$body2 = req.body, shop_id = _req$body2.shop_id, user_id = _req$body2.user_id;
          if (!(shop_id.length < 1)) {
            _context5.n = 1;
            break;
          }
          return _context5.a(2, res.status(400).json({
            message: "Group id cant be empty"
          }));
        case 1:
          if (user_id) {
            _context5.n = 2;
            break;
          }
          return _context5.a(2, res.status(400).json({
            message: "user id is required"
          }));
        case 2:
          shop_id.forEach(/*#__PURE__*/function () {
            var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(shop_id) {
              return _regenerator().w(function (_context4) {
                while (1) switch (_context4.n) {
                  case 0:
                    _context4.n = 1;
                    return assignModel.findOneAndDelete({
                      shop_id: shop_id,
                      user_id: user_id
                    });
                  case 1:
                    return _context4.a(2);
                }
              }, _callee4);
            }));
            return function (_x8) {
              return _ref5.apply(this, arguments);
            };
          }());
          res.status(200).json({
            message: "Group unassigned successfully"
          });
        case 3:
          return _context5.a(2);
      }
    }, _callee5);
  }));
  return function (_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();
module.exports.deleteShop = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var id, deleted, assignDeleted, assignProduct;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          id = req.body.id;
          if (id) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2, res.status(400).json({
            message: "Group id is required"
          }));
        case 1:
          _context6.n = 2;
          return shopsModel.deleteOne({
            _id: id
          });
        case 2:
          deleted = _context6.v;
          _context6.n = 3;
          return assignModel.deleteMany({
            shop_id: id
          });
        case 3:
          assignDeleted = _context6.v;
          _context6.n = 4;
          return productModel.deleteMany({
            shop_id: id
          });
        case 4:
          assignProduct = _context6.v;
          res.status(200).json({
            message: "Group deleted successfully",
            deleted: deleted,
            assignDeleted: assignDeleted,
            assignProduct: assignProduct
          });
        case 5:
          return _context6.a(2);
      }
    }, _callee6);
  }));
  return function (_x9, _x0) {
    return _ref6.apply(this, arguments);
  };
}();
module.exports.getAssignedShops = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
    var user_id, shops;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          user_id = req.params.user_id;
          if (user_id) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2, res.status(400).json({
            message: "user id is required"
          }));
        case 1:
          _context7.n = 2;
          return assignModel.find({
            user_id: user_id
          }).distinct("shop_id").sort({
            createdAt: -1
          });
        case 2:
          shops = _context7.v;
          if (shops) {
            _context7.n = 3;
            break;
          }
          return _context7.a(2, res.status(200).json({
            message: "No Group assigned",
            shops: []
          }));
        case 3:
          res.status(200).json({
            shops: shops
          });
        case 4:
          return _context7.a(2);
      }
    }, _callee7);
  }));
  return function (_x1, _x10) {
    return _ref7.apply(this, arguments);
  };
}();
module.exports.getAllShop = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
    var shops;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          _context8.n = 1;
          return shopsModel.find().sort({
            _id: 1
          });
        case 1:
          shops = _context8.v;
          res.status(200).json({
            shops: shops
          });
        case 2:
          return _context8.a(2);
      }
    }, _callee8);
  }));
  return function (_x11, _x12) {
    return _ref8.apply(this, arguments);
  };
}();
module.exports.getShopByUserId = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(req, res) {
    var id, shopsId, shops;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          id = req.params.id;
          _context9.n = 1;
          return assignModel.find({
            user_id: id
          }).distinct("shop_id");
        case 1:
          shopsId = _context9.v;
          if (!(shopsId.length < 1)) {
            _context9.n = 2;
            break;
          }
          return _context9.a(2, res.status(200).json({
            message: "No Group assigned yet",
            shops: []
          }));
        case 2:
          _context9.n = 3;
          return shopsModel.find({
            _id: {
              $in: shopsId
            }
          }).sort({
            createdAt: -1
          });
        case 3:
          shops = _context9.v;
          res.status(200).json({
            shops: shops
          });
        case 4:
          return _context9.a(2);
      }
    }, _callee9);
  }));
  return function (_x13, _x14) {
    return _ref9.apply(this, arguments);
  };
}();
module.exports.getUserByShopId = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
    var shop_id, user_ids, users;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          shop_id = req.params.shop_id;
          _context0.n = 1;
          return assignModel.find({
            shop_id: shop_id
          }).distinct("user_id");
        case 1:
          user_ids = _context0.v;
          if (!(user_ids.length < 1)) {
            _context0.n = 2;
            break;
          }
          return _context0.a(2, res.status(200).json({
            message: "No Group assigned yet",
            users: []
          }));
        case 2:
          _context0.n = 3;
          return UserModel.find({
            _id: {
              $in: user_ids
            }
          }).sort({
            username: 1
          });
        case 3:
          users = _context0.v;
          res.status(200).json({
            users: users
          });
        case 4:
          return _context0.a(2);
      }
    }, _callee0);
  }));
  return function (_x15, _x16) {
    return _ref0.apply(this, arguments);
  };
}();