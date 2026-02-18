const isValidURL = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const getDomain = (url) => {
  if (!url) return console.log("URL param can not be undifined")
  if (!isValidURL(url)) return console.log("Invalid Url")
  return new URL(url).hostname
}
async function decrypt(encryptedB64) {
  const keyStr = import.meta.env.VITE_CRYPTO_KEY
  const key = await crypto.subtle.importKey("raw", await crypto.subtle.digest("SHA-256", new TextEncoder().encode(keyStr)), { name: "AES-CTR" }, false, ["decrypt"])

  const iv = new Uint8Array(16) // same constant IV
  const encrypted = Uint8Array.from(atob(encryptedB64), (c) => c.charCodeAt(0))

  const decrypted = await crypto.subtle.decrypt({ name: "AES-CTR", counter: iv, length: 64 }, key, encrypted)

  return new TextDecoder().decode(decrypted)
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
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
function getRandomDarkTransparentColor() {
  // Dark colors: RGB 0–100
  const r = Math.floor(Math.random() * 100)
  const g = Math.floor(Math.random() * 100)
  const b = Math.floor(Math.random() * 100)

  // Alpha 0.5–0.8 for transparency
  const a = (Math.random() * 0.3 + 0.5).toFixed(2)

  return `rgba(${r}, ${g}, ${b}, ${a})`
}
function generateRandomKey(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let key = ""
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}
const localTime = (iso) => {
  return new Date(iso).toLocaleString()
}
const isOnline = (pingTime) => {
  let now = +new Date()
  let dif = Math.floor((now - +new Date(pingTime || 0)) / 1e3)
  let maxLastPingSeconds = 120
  return dif < maxLastPingSeconds ? "online" : "idle"
}
const checkFileBeforeUploading = (sizeInBytes) => {
  let msg = { status: 1, msg: "" }
  const MAX_SIZE_MB = 300
  if (sizeInBytes > MAX_SIZE_MB * 1024 * 1024) {
    msg.status = 0
    msg.msg = `File too large. Max ${MAX_SIZE_MB} MB allowed`
  }

  return msg
}
let audio

function initNotificationSound() {
  audio = new Audio("/notify.wav")
  audio.load()
}
initNotificationSound()
function playNotificationSound() {
  if (!audio) return
  audio.currentTime = 0
  audio.play().catch(() => {})
}

export { decrypt, getDomain, isValidURL, checkValidity, getRandomDarkTransparentColor, generateRandomKey, localTime, isOnline, checkFileBeforeUploading, playNotificationSound }
