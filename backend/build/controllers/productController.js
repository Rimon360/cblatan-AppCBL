"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var productModel = require("../models/productModel");
var _require = require("../models/shopModel"),
  assignModel = _require.assignModel;
var _require2 = require("../utils/util"),
  seq = _require2.seq,
  getDate = _require2.getDate,
  prependToFile = _require2.prependToFile;
var _require3 = require("../functions"),
  encrypt = _require3.encrypt,
  decrypt = _require3.decrypt;
var mongoose = require("mongoose");
module.exports.createProduct = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$body, shop_id, domain, email, password, hashedPassword, products;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _req$body = req.body, shop_id = _req$body.shop_id, domain = _req$body.domain, email = _req$body.email, password = _req$body.password;
          hashedPassword = encrypt(password, process.env.CRYPTO_KEY);
          if (!(!shop_id || !domain || !email || !password)) {
            _context.n = 1;
            break;
          }
          return _context.a(2, res.status(400).json({
            message: "Domain, Email/username or password is required!"
          }));
        case 1:
          _context.n = 2;
          return productModel.create({
            seq: seq(),
            domain: domain,
            email: email,
            password: hashedPassword,
            shop_id: shop_id
          });
        case 2:
          products = _context.v;
          if (products) {
            res.status(200).json({
              message: "credential created successfully",
              products: products
            });
          }
        case 3:
          return _context.a(2);
      }
    }, _callee);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
module.exports.getReports = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var products;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return productModel.aggregate([{
            $addFields: {
              shop_id_obj: {
                $toObjectId: "$shop_id"
              }
            }
          }, {
            $group: {
              _id: "$shop_id_obj",
              products: {
                $push: "$$ROOT"
              }
            }
          }, {
            $lookup: {
              from: "shops",
              localField: "_id",
              foreignField: "_id",
              as: "shop"
            }
          }, {
            $unwind: "$shop"
          }, {
            $project: {
              shop_id: "$_id",
              shop_name: "$shop.shop_name",
              products: 1,
              _id: 0
            }
          }]);
        case 1:
          products = _context2.v;
          res.status(200).json({
            products: products
          });
        case 2:
          return _context2.a(2);
      }
    }, _callee2);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
module.exports.getPasswordData = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var id, products;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          id = req.params.id;
          _context3.n = 1;
          return assignModel.aggregate([{
            $match: {
              user_id: id
            }
          }, {
            $lookup: {
              from: "products",
              localField: "shop_id",
              foreignField: "shop_id",
              as: "products"
            }
          }, {
            $unwind: "$products"
          }, {
            $lookup: {
              from: "shops",
              "let": {
                shopId: "$shop_id"
              },
              pipeline: [{
                $match: {
                  $expr: {
                    $eq: ["$_id", {
                      $toObjectId: "$$shopId"
                    }]
                  }
                }
              }],
              as: "shop"
            }
          }, {
            $unwind: "$shop"
          }, {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: ["$products", {
                  shop_name: "$shop.shop_name"
                }]
              }
            }
          }, {
            $project: {
              k: "$password",
              e: "$email",
              d: "$domain",
              l: "$shop_name"
            }
          }, {
            $project: {
              createdAt: 0,
              shop_id: 0,
              seq: 0,
              __v: 0,
              _id: 0 // include or exclude fields as needed
            }
          }]);
        case 1:
          products = _context3.v;
          res.status(200).json({
            products: products
          });
        case 2:
          return _context3.a(2);
      }
    }, _callee3);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
module.exports.getProductByShopId = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var id, products;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          id = req.params.id;
          if (!id) {
            res.status(400).json({
              message: "Credentials id is required"
            });
          }
          _context4.n = 1;
          return productModel.find({
            shop_id: id
          }).sort({
            product_name: 1
          });
        case 1:
          products = _context4.v;
          res.status(200).json({
            products: products
          });
        case 2:
          return _context4.a(2);
      }
    }, _callee4);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
module.exports.updateProductById = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var _req$user, _req$body2, id, wastage, baked, username, products, data, logData, _t;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.p = 0;
          _req$body2 = req.body, id = _req$body2.id, wastage = _req$body2.wastage, baked = _req$body2.baked;
          username = (req === null || req === void 0 || (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.username) || "--";
          _context5.n = 1;
          return productModel.updateOne({
            _id: id
          }, {
            $set: {
              wastage: wastage,
              baked: baked
            }
          });
        case 1:
          products = _context5.v;
          _context5.n = 2;
          return productModel.aggregate([{
            $addFields: {
              shop_id: {
                $toObjectId: "$shop_id"
              }
            }
          }, {
            $match: {
              _id: new mongoose.Types.ObjectId(id)
            } // replace with actual ID
          }, {
            $lookup: {
              from: "shops",
              localField: "shop_id",
              foreignField: "_id",
              as: "shops"
            }
          }, {
            $unwind: "$shops"
          }, {
            $project: {
              product_name: 1,
              seq: 1,
              shop_name: "$shops.shop_name"
            }
          }]);
        case 2:
          data = _context5.v;
          logData = "".concat(getDate(), ";").concat(data[0].shop_name, ";").concat(username, ";").concat(data[0].seq, ";").concat(data[0].product_name, ";").concat(baked, ";").concat(wastage, "\n");
          prependToFile("../backend", logData);
          res.status(200).json({
            message: "success",
            products: products
          });
          _context5.n = 4;
          break;
        case 3:
          _context5.p = 3;
          _t = _context5.v;
          res.status(400).json({
            message: _t.message
          });
        case 4:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 3]]);
  }));
  return function (_x9, _x0) {
    return _ref5.apply(this, arguments);
  };
}();
module.exports.resetWastage = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var _t2;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          _context6.p = 0;
          _context6.n = 1;
          return productModel.updateMany({}, {
            $set: {
              wastage: 0,
              baked: 0
            }
          });
        case 1:
          res.status(200).json({
            message: "success"
          });
          _context6.n = 3;
          break;
        case 2:
          _context6.p = 2;
          _t2 = _context6.v;
          res.status(400).json({
            message: _t2.message
          });
        case 3:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 2]]);
  }));
  return function (_x1, _x10) {
    return _ref6.apply(this, arguments);
  };
}();
module.exports.deleteProductById = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
    var id, products, _t3;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          _context7.p = 0;
          id = req.body.id;
          if (id) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2, res.status(400).json({
            message: "Product id is required"
          }));
        case 1:
          _context7.n = 2;
          return productModel.deleteOne({
            _id: id
          });
        case 2:
          products = _context7.v;
          if (products) {
            _context7.n = 3;
            break;
          }
          return _context7.a(2, res.status(400).json({
            message: "Deletation failed!"
          }));
        case 3:
          res.status(200).json({
            message: "Product has been deleted successfully"
          });
          _context7.n = 5;
          break;
        case 4:
          _context7.p = 4;
          _t3 = _context7.v;
          res.status(400).json({
            message: _t3.message
          });
        case 5:
          return _context7.a(2);
      }
    }, _callee7, null, [[0, 4]]);
  }));
  return function (_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();