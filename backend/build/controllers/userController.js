"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var UserModel = require("../models/userModel");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var _require = require("../utils/util"),
  seq = _require.seq;
module.exports.registerUser = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _req$body, email, usagsLimit, password, role, userExists, solt, hashedPassword, random, user, _email, _role, _id, createdAt, ip_address, _seq;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _req$body = req.body, email = _req$body.email, usagsLimit = _req$body.usagsLimit, password = _req$body.password, role = _req$body.role;
          if (!role) role = "member";
          if (!(!email || !password)) {
            _context.n = 1;
            break;
          }
          return _context.a(2, res.status(400).json({
            message: "Email and password are required"
          }));
        case 1:
          _context.n = 2;
          return UserModel.findOne({
            email: email
          });
        case 2:
          userExists = _context.v;
          if (!userExists) {
            _context.n = 3;
            break;
          }
          return _context.a(2, res.status(400).json({
            message: "User already exists"
          }));
        case 3:
          _context.n = 4;
          return bcrypt.genSalt(10);
        case 4:
          solt = _context.v;
          _context.n = 5;
          return bcrypt.hash(password, solt);
        case 5:
          hashedPassword = _context.v;
          // create user
          random = seq();
          _context.n = 6;
          return UserModel.create({
            seq: random,
            email: email,
            ip_address: null,
            usags_limit: usagsLimit,
            password: hashedPassword,
            role: role
          });
        case 6:
          user = _context.v;
          if (user) {
            _email = user.email, _role = user.role, _id = user._id, createdAt = user.createdAt, ip_address = user.ip_address, _seq = user.seq;
            res.status(200).json({
              message: "User registered successfully",
              user: {
                email: _email,
                role: _role,
                _id: _id,
                createdAt: createdAt,
                ip_address: ip_address,
                seq: _seq
              },
              token: generateToken(user._id)
            });
          }
        case 7:
          return _context.a(2);
      }
    }, _callee);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.loginUser = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$body2, email, password, ip, user, isMatch, currentIP, token, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
          _context2.p = 1;
          _context2.n = 2;
          return UserModel.findOne({
            email: email
          });
        case 2:
          user = _context2.v;
          if (user) {
            _context2.n = 3;
            break;
          }
          return _context2.a(2, res.status(400).json({
            message: "Invalid credentials"
          }));
        case 3:
          _context2.n = 4;
          return bcrypt.compare(password.trim(), user.password);
        case 4:
          isMatch = _context2.v;
          if (isMatch) {
            _context2.n = 5;
            break;
          }
          return _context2.a(2, res.status(400).json({
            message: "Invalid credentials"
          }));
        case 5:
          if (!(user.is_locked == true)) {
            _context2.n = 6;
            break;
          }
          return _context2.a(2, res.status(200).json({
            error: true,
            message: "Sorry, your account has been locked by admin!"
          }));
        case 6:
          // check ip
          currentIP = user.ip_address == 'null' ? null : user.ip_address;
          if (!(user.role !== 'admin' && currentIP && currentIP.trim() != ip.trim())) {
            _context2.n = 7;
            break;
          }
          return _context2.a(2, res.json({
            error: true,
            message: "Sorry, this account is already in use"
          }));
        case 7:
          if (currentIP) {
            _context2.n = 8;
            break;
          }
          _context2.n = 8;
          return UserModel.updateOne({
            _id: user._id
          }, {
            $set: {
              ip_address: ip,
              status: "Active"
            }
          });
        case 8:
          token = jwt.sign({
            _id: user._id,
            email: user.email,
            role: user.role
          }, process.env.JWT_SECRET || "abc123", {
            expiresIn: "30d"
          });
          return _context2.a(2, res.json({
            token: token
          }));
        case 9:
          _context2.p = 9;
          _t = _context2.v;
          console.error("Error logging in:", _t);
          res.status(500).json({
            message: "Error logging in",
            error: _t
          });
        case 10:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 9]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// Generate jwt
var generateToken = function generateToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET || "abc123", {
    expiresIn: "30d"
  });
};
exports.getUsers = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var isActivity, users, _t2;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          isActivity = req.params.isActivity;
          _context3.p = 1;
          _context3.n = 2;
          return UserModel.find().sort({
            createdAt: -1
          });
        case 2:
          users = _context3.v;
          if (!(isActivity == 'true')) {
            _context3.n = 4;
            break;
          }
          _context3.n = 3;
          return UserModel.find().sort({
            last_ping_timestamp: -1
          });
        case 3:
          users = _context3.v;
        case 4:
          res.json(users);
          _context3.n = 6;
          break;
        case 5:
          _context3.p = 5;
          _t2 = _context3.v;
          res.status(500).json({
            message: _t2.message
          });
        case 6:
          return _context3.a(2);
      }
    }, _callee3, null, [[1, 5]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
exports.deleteUser = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var deletedUser, _t3;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.p = 0;
          _context4.n = 1;
          return UserModel.findByIdAndDelete(req.params.id);
        case 1:
          deletedUser = _context4.v;
          if (deletedUser) {
            _context4.n = 2;
            break;
          }
          return _context4.a(2, res.status(404).json({
            message: "User not found"
          }));
        case 2:
          res.json({
            message: "User deleted successfully"
          });
          _context4.n = 4;
          break;
        case 3:
          _context4.p = 3;
          _t3 = _context4.v;
          res.status(500).json({
            message: _t3.message
          });
        case 4:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 3]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
exports.lockUser = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var _req$body3, id, value, lockUser, _t4;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _req$body3 = req.body, id = _req$body3.id, value = _req$body3.value;
          _context5.p = 1;
          _context5.n = 2;
          return UserModel.updateOne({
            _id: id
          }, {
            $set: {
              is_locked: value
            }
          });
        case 2:
          lockUser = _context5.v;
          if (lockUser) {
            _context5.n = 3;
            break;
          }
          return _context5.a(2, res.status(404).json({
            message: "User not found"
          }));
        case 3:
          res.json({
            message: "User lock status updated successfully"
          });
          _context5.n = 5;
          break;
        case 4:
          _context5.p = 4;
          _t4 = _context5.v;
          res.status(500).json({
            message: _t4.message
          });
        case 5:
          return _context5.a(2);
      }
    }, _callee5, null, [[1, 4]]);
  }));
  return function (_x9, _x0) {
    return _ref5.apply(this, arguments);
  };
}();
exports.pingPong = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var _id, lockUser, _t5;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          _id = req.user._id;
          _context6.p = 1;
          _context6.n = 2;
          return UserModel.updateOne({
            _id: _id
          }, {
            $set: {
              last_ping_timestamp: Date.now()
            }
          });
        case 2:
          lockUser = _context6.v;
          if (lockUser) {
            _context6.n = 3;
            break;
          }
          return _context6.a(2, res.status(404).json({
            message: "User not found"
          }));
        case 3:
          res.json({
            message: "PONG"
          });
          _context6.n = 5;
          break;
        case 4:
          _context6.p = 4;
          _t5 = _context6.v;
          res.status(500).json({
            message: _t5.message
          });
        case 5:
          return _context6.a(2);
      }
    }, _callee6, null, [[1, 4]]);
  }));
  return function (_x1, _x10) {
    return _ref6.apply(this, arguments);
  };
}();

// Get protected data (requires JWT)
exports.getProtectedData = function (req, res) {
  res.json({
    message: "This is protected data",
    user: req.user
  });
};

// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await UserModel.findOne({ email, password });
//         if (!user) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }
//         res.status(200).json({ message: "Login successful", user });
//     } catch (error) {
//         res.status(500).json({ message: "Error logging in", error });
//     }
// };