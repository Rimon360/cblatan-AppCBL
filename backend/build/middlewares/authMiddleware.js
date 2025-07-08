"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var jwt = require("jsonwebtoken");
var UserModel = require("../models/userModel");
var authMiddleware = function authMiddleware(req, res, next) {
  var _req$header;
  var token = (_req$header = req.header("Authorization")) === null || _req$header === void 0 ? void 0 : _req$header.split(" ")[1];
  if (!token) {
    return res.status(403).json({
      message: "Access denied"
    });
  }
  try {
    var decoded = jwt.verify(token, "abc123");
    req.user = decoded; // User information from decoded token
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Invalid token"
    });
  }
};
var adminMiddleware = function adminMiddleware(req, res, next) {
  var authHeader = req.headers.authorization;
  var token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
  if (!token) return res.status(401).json({
    message: "Access Denied"
  });
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded && decoded.role === "admin") {
      req.user = decoded;
      next();
    } else {
      res.status(403).json({
        message: "Only admin can access this route"
      });
    }
  } catch (_unused) {
    res.status(403).json({
      message: "Invalid Token"
    });
  }
};
var memberMiddleware = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res, next) {
    var authHeader, token, decoded, user, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          authHeader = req.headers.authorization;
          token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
          if (token) {
            _context.n = 1;
            break;
          }
          return _context.a(2, res.status(401).json({
            message: "Access Denied"
          }));
        case 1:
          _context.p = 1;
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          _context.n = 2;
          return UserModel.findOne({
            email: decoded.email,
            _id: decoded._id
          });
        case 2:
          user = _context.v;
          if (!(user.is_locked == true)) {
            _context.n = 3;
            break;
          }
          return _context.a(2, res.status(200).json({
            error: true,
            message: "Sorry, your account has been locked by admin!"
          }));
        case 3:
          if (user && decoded && decoded.role === "member" || decoded.role === "admin") {
            req.user = decoded;
            next();
          } else {
            res.status(403).json({
              message: "Only admin or member can access this route"
            });
          }
          _context.n = 5;
          break;
        case 4:
          _context.p = 4;
          _t = _context.v;
          res.status(403).json({
            message: "Invalid Token"
          });
        case 5:
          return _context.a(2);
      }
    }, _callee, null, [[1, 4]]);
  }));
  return function memberMiddleware(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var ipTrackMiddleware = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res, next) {
    var authHeader, token, ip, decoded, user, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          authHeader = req.headers.authorization;
          token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
          ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
          if (token) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2, res.status(401).json({
            message: "Authorization token missing"
          }));
        case 1:
          _context2.p = 1;
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded.role === 'admin') {
            req.user = decoded;
            next();
          }
          if (!(decoded && decoded.role === "member" || decoded.role === "admin")) {
            _context2.n = 6;
            break;
          }
          _context2.n = 2;
          return UserModel.findOne({
            email: decoded.email,
            _id: decoded._id
          });
        case 2:
          user = _context2.v;
          if (!(user && user.ip_address && user.ip_address != 'null' && user.ip_address == ip || user.ip_address == null)) {
            _context2.n = 4;
            break;
          }
          if (!(user.ip_address == null)) {
            _context2.n = 3;
            break;
          }
          _context2.n = 3;
          return UserModel.updateOne({
            _id: user._id
          }, {
            $set: {
              ip_address: ip,
              status: "Active"
            }
          });
        case 3:
          req.user = decoded;
          next();
          return _context2.a(2);
        case 4:
          if (user) {
            _context2.n = 5;
            break;
          }
          res.status(403).json({
            error: true,
            message: "Account not exists"
          });
          return _context2.a(2);
        case 5:
          res.status(200).json({
            error: true,
            message: "Sorry, the account is already in use!"
          });
          _context2.n = 7;
          break;
        case 6:
          res.status(403).json({
            error: true,
            message: "Only admin or member can access this route"
          });
        case 7:
          _context2.n = 9;
          break;
        case 8:
          _context2.p = 8;
          _t2 = _context2.v;
          res.status(403).json({
            error: true,
            message: "Invalid Token"
          });
        case 9:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 8]]);
  }));
  return function ipTrackMiddleware(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
module.exports = {
  authMiddleware: authMiddleware,
  adminMiddleware: adminMiddleware,
  memberMiddleware: memberMiddleware,
  ipTrackMiddleware: ipTrackMiddleware
};