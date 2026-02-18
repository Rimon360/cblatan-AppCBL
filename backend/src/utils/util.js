require("dotenv").config()
const fs = require("fs")
const fsx = require("fs-extra")
const nodemailer = require("nodemailer")
const archiver = require("archiver")
const path = require("path")
const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

let seq = (min = 10000000, max = 99999999) => Math.floor(Math.random() * (max - min + 1)) + min

let prependToFile = (filePath, data) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true })
    }
    const logFile = filePath.endsWith("/") ? filePath + "track.csv" : filePath + "/track.csv"
    const existingData = fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8") : ""
    const newData = data + existingData
    fs.writeFileSync(logFile, newData, "utf8")
  } catch (error) {
    console.error("Error prepending to file:", error)
  }
}

module.exports.getDate = () => {
  return new Date().toISOString().replace(/T/, "; ").replace(/:/g, "-").split(".")[0]
}

const sendEmail = async (subject, text, attachmentPath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  })

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject,
    text,
    attachments: [
      {
        path: attachmentPath,
      },
    ],
  }

  await transporter.sendMail(mailOptions)
}

async function moveFolder(src, dest) {
  await fsx.copy(src, dest, { overwrite: true })
  await fsx.remove(src)
}

async function zipFolder(folder, dest) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(dest)
    const archive = archiver("zip", { zlib: { level: 9 } })
    output.on("close", () => resolve())
    archive.on("error", (err) => reject(err))
    archive.pipe(output)
    const folderName = path.basename(folder)
    archive.directory(folder, folderName)
    archive.finalize()
  })
}
function getPort(min = 40000, max = 60000) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function sendOtpEmail(toEmail) {
  let otp = getPort(111111, 999999)
  const msg = {
    to: toEmail,
    from: process.env.FROM_EMAIL,
    subject: "Kaizen OTP Code",
    html: `
      <div style="font-family:Arial,sans-serif; text-align:center; padding:20px;">
        <h2>Kaizen</h2>
        <p style="font-size:22px;">Use the OTP below to verify your account:</p>
        <div style="font-size:36px; font-weight:bold; color:#2b6cb0; margin:20px 0;">
          ${otp}
        </div>
        <p>This code will expire in 15 minutes.</p>
      </div>
    `,
  }

  try {
    await sgMail.send(msg)
    return otp
  } catch (error) { 
    return false
  }
}

function isUrlSuspicious(url) {
  const suspiciousString = [
      "reset-password",
      "account",
      "setting",
      "account-password",
      "mail/Trash",
      "mail/recovery",
      "security",
      "systemOrigin=club-new",
      "categories",
      "systemOrigin=hub",
      "documents",
      "personal-information",
      "purchase",
      "configuracion",
      "profile",
      "forgot",
      "forget",
      "logout",
      "edit",
  ]
  for (const s of suspiciousString) {
    if (url && url.includes(s)) {
      return true
    }
  }
  return false
}

exports.getPeruTime = () => new Date().toLocaleString("en-US", { timeZone: "America/Lima" })
module.exports.sendEmail = sendEmail
module.exports.prependToFile = prependToFile
module.exports.zipFolder = zipFolder
module.exports.seq = seq
module.exports.moveFolder = moveFolder
module.exports.getPort = getPort
module.exports.sendOtpEmail = sendOtpEmail
module.exports.isUrlSuspicious = isUrlSuspicious
