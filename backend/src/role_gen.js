require("dotenv").config()
const crypto = require("crypto")

const ALGO = "aes-256-cbc"
const SECRET_KEY = process.env.ROLE_SECRET_KEY 
const KEY = crypto.createHash("sha256").update(SECRET_KEY).digest() // 32 bytes
const IV = crypto.randomBytes(16) // 16 bytes IV

const encrypt = (text) => { 
  if (SECRET_KEY === null) return false
  const cipher = crypto.createCipheriv(ALGO, KEY, IV)
  let encrypted = cipher.update(text, "utf8", "base64")
  encrypted += cipher.final("base64")
  return IV.toString("base64") + ":" + encrypted
} 