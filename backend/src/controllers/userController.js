const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { seq } = require("../utils/util");
module.exports.registerUser = async (req, res) => {
  let { email, usagsLimit, password, role, client } = req.body;
  if (!role) role = "member";
  if (client) role = "member";
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  // check if user exists
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  // hash password
  const solt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, solt);
  // create user
  const random = seq();
  const user = await UserModel.create({
    seq: random,
    email,
    ip_address: null,
    usags_limit: usagsLimit,
    password: hashedPassword,
    role,
  });
  if (user) {
    const { email, role, _id, createdAt, ip_address, seq } = user;
    res.status(200).json({
      message: "User registered successfully",
      user: { email, role, _id, createdAt, ip_address, seq },
      token: generateToken(user),
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  if (!ip) return res.status(400).json({ message: "IP address not found" });
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.is_locked == true) {
      return res.status(200).json({ error: true, message: "Sorry, your account has been locked by admin!" });
    }

    // check ip
    const currentIP = user.ip_address == 'null' ? null : user.ip_address;
    if (user.role !== 'admin' && currentIP && currentIP.trim() != ip.trim()) {

      return res.json({ error: true, message: "Sorry, this account is already in use" })

    } else if (!currentIP) {
      await UserModel.updateOne({ _id: user._id }, { $set: { ip_address: ip, status: "Active" } })
    }


    const token = generateToken(user)

    return res.json({ token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Error logging in", error: err });
  }
};

// Generate jwt
const generateToken = (user) => {
  return jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || "abc123", { expiresIn: "30d" });
};

exports.getUsers = async (req, res) => {
  const { isActivity } = req.params;
  try {
    let users = await UserModel.find().sort({ createdAt: -1 });
    if (isActivity == 'true') {
      users = await UserModel.find().sort({ last_ping_timestamp: -1 });
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.lockUser = async (req, res) => {
  const { id, value } = req.body;
  try {
    const lockUser = await UserModel.updateOne({ _id: id }, { $set: { is_locked: value } });

    if (!lockUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User lock status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.pingPong = async (req, res) => {
  const { _id } = req.user;
  try {
    const lockUser = await UserModel.updateOne({ _id }, { $set: { last_ping_timestamp: Date.now() } });
    if (!lockUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "PONG" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get protected data (requires JWT)
exports.getProtectedData = (req, res) => {
  res.json({ message: "This is protected data", user: req.user });
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
