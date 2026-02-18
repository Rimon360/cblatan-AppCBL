const crypto = require("crypto")

const secret = process.env.CRYPTO_KEY
const key = crypto.createHash("sha256").update(secret).digest() // 32-byte key
const iv = Buffer.alloc(16, 0) // constant IV (not secure for real-world use)

function encrypt(text) {
  const cipher = crypto.createCipheriv("aes-256-ctr", key, iv)
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()])
  return encrypted.toString("base64")
}

function decrypt(encryptedBase64) {
  const decipher = crypto.createDecipheriv("aes-256-ctr", key, iv)
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedBase64, "base64")), decipher.final()])
  return decrypted.toString("utf8")
}

function checkValidity(startDateStr, validityDays) {
  const [d, m, y] = startDateStr.split("/").map(Number)
  const startDate = new Date(y, m - 1, d)
  if (isNaN(startDate) || isNaN(validityDays)) return false

  const now = new Date()
  const expiryDate = new Date(startDate)
  expiryDate.setDate(startDate.getDate() + validityDays)

  if (now > expiryDate) return false

  const diffTime = expiryDate - now
  let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  let hours = Math.ceil(diffTime / (1000 * 60 * 60))
  let seconds = Math.ceil(diffTime / 1000)
  return { days, seconds, hours }
}
function checkDaysLeft(startDateStr, validityDays) {
  const [y, m, d] = startDateStr.split("-").map(Number)
  const startDate = new Date(y, m - 1, d)
  if (isNaN(startDate) || isNaN(validityDays)) return 0

  const now = new Date()
  const expiryDate = new Date(startDate.getTime() + validityDays * 24 * 60 * 60 * 1000)

  const diffTime = expiryDate - now
  if (diffTime <= 0) return 0

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function uniqueString() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
function getRandomInRange(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
const peruTime = () => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date())
}
function generateRandomKey(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let key = ""
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}
module.exports = { encrypt, decrypt, checkValidity, checkDaysLeft, uniqueString, getRandomInRange, peruTime,generateRandomKey }
