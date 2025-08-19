const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { seq, getPeruTime } = require("../utils/util");
module.exports.registerUser = async (req, res) => {
  let {

    usagsLimit,
    email,
    wasap,
    paymentMethod,
    nstbrowserEmail,
    dicloakEmail,
    subscripitonTerm,
    niche,
    affiliate,
    supervisor,
    observation,
    subStartDate,
    subValidity,
    password,
    role,
    client


  } = req.body;
  if (!role) role = "member";
  if (client) role = "member";
  if (!email || !password) {
    return res.status(400).json({ message: "Se requieren correo electrónico y contraseña" });
  }
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  if (!ip) return res.status(400).json({ message: "Dirección IP no encontrada" });
  // check if user exists
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "La usuario ya existe" });
  }
  // hash password
  const solt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, solt);
  // create user
  const random = seq();
  const user = await UserModel.create({
    seq: random,
    first_ip: ip,
    email,
    wasap,
    payment_method: paymentMethod,
    nstbrowser_email: nstbrowserEmail,
    dicloak_email: dicloakEmail,
    subscription_term: subscripitonTerm,
    niche,
    affiliate,
    supervisor,
    observation,
    sub_start_date: subStartDate,
    sub_validity: subValidity,
    ip_address: ip,
    usags_limit: usagsLimit,
    password: hashedPassword,
    role,
  });
  if (user) {
    const { email, role, _id, createdAt, ip_address, seq } = user;
    res.status(200).json({
      message: "Usuario registrado correctamente",
      user: { email, role, _id, createdAt, ip_address, seq },
      token: generateToken({ email, role, _id, createdAt, ip_address, seq }),
    });
  }
};
module.exports.updateUser = async (req, res) => {
  let {
    id,
    usagsLimit,
    email,
    wasap,
    paymentMethod,
    nstbrowserEmail,
    dicloakEmail,
    subscripitonTerm,
    niche,
    affiliate,
    supervisor,
    observation,
    subStartDate,
    subValidity,
    role,
    client
  } = req.body;
  if (!role) role = "member";
  if (client) role = "member";
  if (!email) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  // check if user exists
  const userExists = await UserModel.findOne({ email });
  if (!userExists) {
    return res.status(400).json({ message: "User not exists to make update" });
  }
  const user = await UserModel.updateOne({ _id: id }, {
    $set: {
      email,
      wasap,
      payment_method: paymentMethod,
      nstbrowser_email: nstbrowserEmail,
      dicloak_email: dicloakEmail,
      subscription_term: subscripitonTerm,
      niche,
      affiliate,
      supervisor,
      observation,
      sub_start_date: subStartDate,
      sub_validity: subValidity,
      usags_limit: usagsLimit,
      role,
    }
  });
  if (user) {
    const { email, role, _id, createdAt, ip_address, seq } = user;
    res.status(200).json({
      message: "User updated successfully",
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
      return res.status(503).json({ error: true, message: "Sorry, your account has been locked by admin!" });
    }

    // check ip
    let ipHistory = !user.ip_address_history ? '' : user.ip_address_history;
    if (!ipHistory.includes(ip)) ipHistory += ip + ' (' + getPeruTime() + '),'
    await UserModel.updateOne({ _id: user._id }, { $set: { ip_address: ip, ip_address_history: ipHistory, status: "Active" } })

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
    res.json({ message: "Usuario eliminada exitosamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.lockUser = async (req, res) => {
  const { id, value } = req.body;
  try {
    const lockUser = await UserModel.updateOne({ _id: id }, { $set: { is_locked: value } });

    if (!lockUser) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Estado de bloqueo de usuario actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.pingPong = async (req, res) => {
  const { _id } = req.user;
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  if (!ip) return res.status(400).json({ message: "Dirección IP no encontrada" });
  if (!token) return res.status(401).json({ message: "Falta de token de autorización" });
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await UserModel.findOne({ email: decoded.email });
    let ipHistory = !user.ip_address_history ? '' : user.ip_address_history;
    if (!ipHistory.includes(ip)) ipHistory += ip + ' (' + getPeruTime() + '),'
    await UserModel.updateOne({ _id: user._id }, { $set: { ip_address: ip, ip_address_history: ipHistory, status: "Active" } })

    if (user.is_locked == true) {
      return res.status(503).json({ error: true, message: "¡La cuenta ha sido bloqueada por Admin!" });
    }
    if (user.ip_address != ip) {
      return res.status(401).json({ error: true, message: "Sesión expirada, ¡inicie sesión nuevamente!" });
    }

    const lockUser = await UserModel.updateOne({ _id }, { $set: { last_ping_timestamp: Date.now() } });
    if (!lockUser) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "PONG" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.resetIpHistory = async (req, res) => {
  await UserModel.updateMany({}, { $set: { ip_address_history: '', first_ip: '', ip_address: '' } });
  res.status(200).json({ message: "success" });
}
// Get protected data (requires JWT)
exports.getProtectedData = (req, res) => {
  res.json({ message: "Estos son datos protegidos", user: req.user });
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
