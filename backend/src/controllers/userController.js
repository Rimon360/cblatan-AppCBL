require("dotenv").config()
const UserModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const productModel = require("../models/productModel")
const { seq, getPeruTime, getPort, sendOtpEmail, isUrlSuspicious } = require("../utils/util")
const { decrypt } = require("../hash_functions.js")
const BrowsingHistoryModel = require("../models/browsingHistoryModel")
const blockedIpModel = require("../models/blockedIpModel.js")
const userApiActivityModel = require("../models/userApiActivityModel.js")
const { assignModel, shopsModel } = require("../models/shopModel.js")
const userUpdateParked = require("../models/userUpdateParkedModel.js")
module.exports.registerUser = async (req, res) => {
  let {
    usagsLimit,
    email,
    username,
    wasap,
    paymentMethod,
    nstbrowserEmail,
    // dicloakEmail,
    // subscripitonTerm,
    profileGroup,
    niche,
    affiliate,
    supervisor,
    observation,
    subStartDate,
    subValidity,
    password,
    role,
    client,
  } = req.body
  const authHeader = req.headers.authorization
  let created_by = "own_or_admin"
  // let email_verified = false
  let email_verified = true;
  if (authHeader) {
    const token = authHeader?.split(" ")[1]
    const user = jwt.verify(token, process.env.JWT_SECRET)
    if (user?.role == "admin") email_verified = true
    created_by = user.email
  }
  if (password.length < 8) {
    return res.status(403).json({ message: "La longitud de la contraseña debe ser >= 8" })
  }

  role = decrypt(role)

  if (role === false) role = "i64V1k5uSiNAT9mlf6uw+Q==:tSXIZwCmgdx4uGtMar/5Mg=="

  if (!role) role = "member"
  if (client) role = "member"
  if (!email || !password || !username) {
    return res.status(400).json({ message: "Faltan campos obligatorios. Por favor, rellene los campos obligatorios." })
  }
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  if (!ip) return res.status(400).json({ message: "Dirección IP no encontrada" })
  // check if user exists
  const userExists = await UserModel.findOne({ email })
  if (userExists) {
    return res.status(409).json({ message: "El correo electrónico ya está registrado. ¡Intenta con otro!" })
  }
  const isUsernameTaken = await UserModel.findOne({ username })
  if (isUsernameTaken) {
    return res.status(409).json({ message: "El nombre de usuario ya está en uso. ¡Intenta con otro!" })
  }
  // hash password
  const solt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, solt)
  // create user
  const random = seq()
  const user = await UserModel.create({
    email_verified,
    created_by,
    seq: random,
    first_ip: ip,
    email,
    username,
    wasap,
    payment_method: paymentMethod,
    nstbrowser_email: nstbrowserEmail,
    // dicloak_email: dicloakEmail,
    // subscription_term: subscripitonTerm,
    profile_group: profileGroup,
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
  })
  if (user) {
    const { email, role, _id, createdAt, ip_address, seq } = user
    res.status(200).json({
      message: "Usuario registrado correctamente",
      user: { email, role, _id, createdAt, ip_address, seq },
      token: generateToken({ email, role, _id, createdAt, ip_address, seq }),
    })
  }
}
module.exports.changePassword = async (req, res) => {
  let { email, password } = req.body

  if (!email || !password) {
    return res.status(403).json({ message: "Information missing" })
  }

  if (password.length < 8) {
    return res.status(403).json({ message: "La longitud de la contraseña debe ser >= 8" })
  }

  // hash password
  const solt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, solt)
  // create user
  const updated = await UserModel.updateOne(
    { email },
    {
      password: hashedPassword,
    },
  )

  if (updated.modifiedCount > 0) {
    res.status(200).json({ message: "success" })
  } else {
    return res.status(400).json({
      message: "No se puede actualizar la contraseña",
    })
  }
}
module.exports.updateUser = async (req, res) => {
  let {
    id,
    usagsLimit,
    email,
    wasap,
    paymentMethod,
    created_by,
    nstbrowserEmail,
    // dicloakEmail,
    // subscripitonTerm,
    profileGroup,
    niche,
    affiliate,
    supervisor,
    username,
    observation,
    subStartDate,
    subValidity,
    role,
    client,
  } = req.body
  role = decrypt(role)
  if (role === false) role = "i64V1k5uSiNAT9mlf6uw+Q==:tSXIZwCmgdx4uGtMar/5Mg=="
  if (!role) role = "member"
  if (client) role = "member"
  if (!email || !username) {
    return res.status(400).json({ message: "Faltan campos obligatorios. Por favor, rellene los campos obligatorios." })
  }
  // check if user exists
  const userExists = await UserModel.findOne({ email })
  if (!userExists) {
    return res.status(409).json({ message: "Usuario no encontrado" })
  }
  const userCreatedbyExists = await UserModel.findOne({ email: created_by })
  if (!userCreatedbyExists && created_by !== "own_or_admin") {
    return res.status(409).json({ message: "El administrador no existe. Intente cambiar su correo electrónico." })
  }
  const isUsernameTaken = await UserModel.find({ username })
  if (isUsernameTaken.length > 0 && userExists.username !== username) {
    return res.status(409).json({ message: "El nombre de usuario ya está en uso. ¡Intenta con otro!" })
  }
  const user = await UserModel.updateOne(
    { _id: id },
    {
      $set: {
        email,
        username,
        wasap,
        created_by,
        payment_method: paymentMethod,
        nstbrowser_email: nstbrowserEmail,
        // dicloak_email: dicloakEmail,
        // subscription_term: subscripitonTerm,
        profile_group: profileGroup,
        niche,
        affiliate,
        supervisor,
        observation,
        sub_start_date: subStartDate,
        sub_validity: subValidity,
        usags_limit: usagsLimit,
        role,
      },
    },
  )
  if (user) {
    const { email, role, _id, createdAt, ip_address, seq } = user
    res.status(200).json({
      message: "User updated successfully",
    })
  }
}
module.exports.changeEmail = async (req, res) => {
  let { email, changeto } = req.body

  let reuslt = await UserModel.find({ email })
  if (reuslt.length > 0) {
    let changeToResult = await UserModel.find({ email: changeto })
    if (changeToResult.length > 0) {
      return res.status(409).json({ message: "La usuario ya existe", error: true })
    }
    let updateStatus = await UserModel.updateOne({ email }, { $set: { email: changeto } })
    if (updateStatus.modifiedCount > 0) {
      return res.status(200).json({ message: "success" })
    } else {
      return res.status(500).json({ message: "Something unknown", error: true })
    }
  } else {
    return res.status(200).json({ message: "User not exists", error: true })
  }
}
module.exports.checkEmail = async (req, res) => {
  let { email } = req.body

  let result = await UserModel.findOne({ email })

  if (result) {
    let otpTimePassedSeconds = (Date.now() - result.otp_received_time || 70 * 1000) / 1000 // seconds

    let otpResendingSeconds = 60 // 1 minute;
    if (otpResendingSeconds > otpTimePassedSeconds) {
      // havent passed 1 minute yet;
      return res.status(403).json({ message: "Espere 30s para reenviar OTP", error: true })
    }
    let otp = await sendOtpEmail(email)
    if (!otp) {
      return res.status(403).json({ message: "No se pudo enviar OTP" })
    }
    let currentTime = Date.now()
    let updateStatus = await UserModel.updateOne({ email }, { $set: { otp_received_time: currentTime, otp, otp_failed_count: 0 } })
    if (updateStatus.modifiedCount > 0) {
      return res.status(200).json({ message: "success", email })
    } else {
      return res.status(500).json({ message: "Algo desconocido", error: true })
    }
  } else {
    return res.status(404).json({ message: "La usuario no existe", error: true })
  }
}
module.exports.sendOTP = async (req, res) => {
  let user = req.user

  let result = await UserModel.findOne({ email: user.email })

  if (result) {
    let otpTimePassedSeconds = (Date.now() - result.otp_received_time || 70 * 1000) / 1000 // seconds

    let otpResendingSeconds = 30 // 1 minute;
    if (otpResendingSeconds > otpTimePassedSeconds) {
      // havent passed 1 minute yet;
      return res.status(403).json({ message: "Espere 30s para reenviar OTP", error: true })
    }
    let OTP = await sendOtpEmail(user.email) // testing only mode
    if (!OTP) {
      return res.status(403).json({ message: "No se pudo enviar OTP" })
    }
    let currentTime = Date.now()

    let updateStatus = await UserModel.updateOne({ email: user.email }, { $set: { otp: OTP, otp_received_time: currentTime, otp_failed_count: 0 } })
    if (updateStatus.modifiedCount > 0) {
      return res.status(200).json({ message: "success" })
    } else {
      return res.status(500).json({ message: "Something unknown", error: true })
    }
  } else {
    return res.status(200).json({ message: "User not exists", error: true })
  }
}
module.exports.verifyOTP = async (req, res) => {
  const { otp, email } = req.body
  let user = req?.user
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  if (!user) user = { email }

  const result = await UserModel.findOne({ email: user.email })
  const ipHistory = result.verified_ip + ip + ","
  if (result) {
    let storedOTP = result.otp
    let failed_count = result.otp_failed_count
    let isOTPExpired = (Date.now() - result.otp_received_time) / 1000 > 15 * 60 // if greater than 5 minute then expired;
    if (isOTPExpired) {
      return res.status(408).json({ message: "El OTP ha expirado, por favor reenvíelo!", error: true })
    }
    if (failed_count > 2) {
      return res.status(429).json({ message: "Se alcanzó el máximo de intentos. Por favor, vuelva a enviar un nuevo OTP." })
    }
    if (storedOTP === otp) {
      await UserModel.updateOne({ email: user.email }, { $set: { otp: 0, email_verified: true, otp_failed_count: 0, verified_ip: ipHistory } })
      let updateUser = await UserModel.findOne({ email: user.email })

      const token = generateToken(updateUser)
      return res.status(200).json({ message: "success", token })
    } else {
      failed_count++
      await UserModel.updateOne({ email: user.email }, { $set: { otp_failed_count: failed_count } })
      return res.status(403).json({ message: "OTP no coincide", error: true })
    }
  } else {
    return res.status(404).json({ message: "Usuario no encontrado", error: true })
  }
}
exports.loginUser = async (req, res) => {
  const { email, password } = req.body
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  if (!ip) return res.status(400).json({ message: "IP address not found" })
  try {
    const user = await UserModel.findOne({ $or: [{ email }, { username: email }] })

    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" })
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" })
    }
    if (user.is_locked == true) {
      return res.status(503).json({ error: true, message: "Lo sentimos, ¡su cuenta ha sido bloqueada por el administrador!" })
    }

    // check ip
    let ipHistory = !user.ip_address_history ? "" : user.ip_address_history
    if (!ipHistory.includes(ip)) ipHistory += ip + " (" + getPeruTime() + "),"
    await UserModel.updateOne({ _id: user._id }, { $set: { ip_address: ip, ip_address_history: ipHistory, status: "Active" } })

    const token = generateToken(user)

    return res.json({ token })
  } catch (err) {
    console.error("Error logging in:", err)
    res.status(500).json({ message: "Error logging in", error: err })
  }
}

// Generate jwt
const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role, profile_group: user.profile_group, email_verified: user.email_verified },
    process.env.JWT_SECRET || "qieroiqrjo45Ooisadfgoioioia2403287LKFJdfklasdfl:asdlfkj",
    {
      expiresIn: "7d",
    },
  )
}

exports.getUsers = async (req, res) => {
  try {
    const { isActivity } = req.params
    const { q, loadall } = req.query
    const { email, role } = req.user
    const searchQuery = [{ ip_address: { $regex: q || "", $options: "i" } }, { email: { $regex: q || "", $options: "i" } }, { username: { $regex: q || "", $options: "i" } }]
    let filterBy = { $or: searchQuery }
    if (role === "manager") filterBy = { created_by: email, $or: searchQuery }
    let users = []
    if (loadall == "true") {
      users = await UserModel.find(filterBy).sort({ createdAt: -1 })
    } else {
      users = await UserModel.find(filterBy).sort({ createdAt: -1 }).limit(100)
    }
    if (isActivity == "true") {
      users = await UserModel.find().sort({ last_ping_timestamp: -1 })
    }
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
exports.getUsersByOwner = async (req, res) => {
  const { created_by } = req.params
  try {
    let users = await UserModel.find({ created_by }).sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
exports.getUsersCourseByUserId = async (req, res) => {
  const { user_id } = req.params
  try {
    let course = await assignModel.distinct("shop_id", { user_id })
    let shop = await shopsModel.find({ _id: { $in: course } }, { shop_name: 1 })
    res.json(shop)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
exports.getManagers = async (req, res) => {
  try {
    let managers = await UserModel.find({ role: "manager" }).sort({ createdAt: -1 })
    res.json(managers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id)

    if (!deletedUser) return res.status(404).json({ message: "User not found" })
    res.json({ message: "Usuario eliminada exitosamente" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
exports.lockUser = async (req, res) => {
  const { id, value } = req.body
  try {
    const lockUser = await UserModel.updateOne({ _id: id }, { $set: { is_locked: value } })
    await BrowsingHistoryModel.updateMany({ user_id: id }, { $set: { is_locked: value } })
    if (!lockUser) return res.status(404).json({ message: "Usuario no encontrado" })
    res.json({ message: "Estado de bloqueo de usuario actualizado correctamente" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.pingPong = async (req, res) => {
  const { _id } = req.user
  const authHeader = req.headers.authorization
  const token = authHeader?.split(" ")[1]
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
  if (!ip) return res.status(400).json({ message: "Dirección IP no encontrada" })
  if (!token) return res.status(401).json({ message: "Falta de token de autorización" })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    let user = await UserModel.findOne({ email: decoded.email })
    let ipHistory = !user.ip_address_history ? "" : user.ip_address_history
    if (!ipHistory.includes(ip)) ipHistory += ip + " (" + getPeruTime() + "),"
    await UserModel.updateOne({ _id: user._id }, { $set: { ip_address: ip, ip_address_history: ipHistory, status: "Active" } })

    if (user.is_locked == true) {
      return res.status(503).json({ error: true, message: "¡La cuenta ha sido bloqueada por Admin!" })
    }
    // if (user.ip_address != ip) {
    //   // check if the incomming ip is on the ip_adress list or not
    //   return res.status(401).json({ error: true, message: "Sesión expirada, ¡inicie sesión nuevamente!" })
    // }

    const lockUser = await UserModel.updateOne({ _id }, { $set: { last_ping_timestamp: Date.now() } })
    if (!lockUser) return res.status(404).json({ message: "Usuario no encontrado" })
    res.json({ message: "PONG" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
exports.resetIpHistory = async (req, res) => {
  await UserModel.updateMany({}, { $set: { ip_address_history: "", first_ip: "", ip_address: "" } })
  await productModel.updateMany({}, { $set: { active_users: [] } })
  res.status(200).json({ message: "success" })
}
// Get protected data (requires JWT)
exports.getProtectedData = (req, res) => {
  res.json({ message: "Estos son datos protegidos", user: req.user })
}
exports.browserHistoryController = async (req, res) => {
  try {
    const { url } = req.body
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
    if (!ip) return res.status(403).json()

    if (!isUrlSuspicious(url)) return res.status(200).json(false)

    const users = await UserModel.find({ ip_address: new RegExp(ip) })
    for (const user of users) {
      const ipHistory = await BrowsingHistoryModel.findOne({ ip: new RegExp(ip), browsed_url: url })
      if (ipHistory) return res.status(200).json("e")
      await BrowsingHistoryModel.insertOne({ email: user.email, ip, browsed_url: url, role: user.role, user_id: user._id })
    }

    return res.status(200).json()
  } catch (error) {
    return res.status(400).json()
  }
}
exports.getBrowserHistory = async (req, res) => {
  const history = await BrowsingHistoryModel.find().sort({ createdAt: -1 })
  return res.status(200).json(history)
}
exports.deleteBrowserHistory = async (req, res) => {
  const { id } = req.body
  const history = await BrowsingHistoryModel.deleteOne({ _id: id })
  if (history.deletedCount) {
    return res.status(200).json({ message: "success" })
  }
  return res.status(400).json({ message: "Failed to delete" })
}
exports.resetBrowserHistory = async (req, res) => {
  try {
    const history = await BrowsingHistoryModel.deleteMany()
    if (history.deletedCount) {
      return res.status(200).json({ message: history.deletedCount })
    } else {
      return res.status(200).json({ message: history.deletedCount || 0 })
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to delete" })
  }
}
exports.resetApiActivity = async (req, res) => {
  try {
    const history = await userApiActivityModel.deleteMany()
    if (history.deletedCount) {
      return res.status(200).json({ message: history.deletedCount })
    } else {
      return res.status(200).json({ message: history.deletedCount || 0 })
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to delete" })
  }
}
exports.getApiActivity = async (req, res) => {
  const api_activity = await userApiActivityModel.find({}).sort({ createdAt: -1 }).limit(300)

  return res.status(200).json({ api_activity })
}
exports.parkUpdateUserForAdminApproval = async (req, res) => {
  // userUpdateParked
  try {
    const { created_by, modification, updated_data, to } = req.body
    await userUpdateParked.insertOne({ created_by, modification, updated_data, to })
    res.status(200).json()
  } catch (error) {
    res.status(403).json({ error: error.message })
  }
}
exports.getParkedRequests = async (req, res) => {
  // userUpdateParked
  try {
    let result = await userUpdateParked.find({}, { modification: 1, created_by: 1, createdAt: 1, to: 1 })
    res.status(200).json(result)
  } catch (error) {
    res.status(403).json({ error: error.message })
  }
}
exports.approveParkedRequest = async (req, res) => {
  // userUpdateParked
  try {
    const { id } = req.body
    let result = await userUpdateParked.findOne({ _id: id }) 

    let userData = result.updated_data

    let mod = await UserModel.updateOne({ email: userData.email }, { $set: { sub_start_date: userData.subStartDate, sub_validity: userData.subValidity } })
    await userUpdateParked.deleteOne({ _id: id })

    res.status(200).json({ message: `Approved ${mod.modifiedCount}` })
  } catch (error) {
    res.status(403).json({ error: error.message })
  }
}
exports.deleteParkedRequest = async (req, res) => {
  // userUpdateParked
  try {
    const { id } = req.body
    let result = await userUpdateParked.deleteOne({ _id: id })
    res.status(200).json({ message: "Deleted" })
  } catch (error) {
    res.status(403).json({ error: error.message })
  }
}
