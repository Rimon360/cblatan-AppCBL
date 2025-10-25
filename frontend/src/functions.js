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

export { decrypt, getDomain, isValidURL, checkValidity }
