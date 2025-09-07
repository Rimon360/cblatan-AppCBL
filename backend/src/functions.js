const crypto = require("crypto");

const secret = process.env.CRYPTO_KEY;
const key = crypto.createHash("sha256").update(secret).digest(); // 32-byte key
const iv = Buffer.alloc(16, 0); // constant IV (not secure for real-world use)

function encrypt(text) {
    const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);
    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    return encrypted.toString("base64");
}

function decrypt(encryptedBase64) {
    const decipher = crypto.createDecipheriv("aes-256-ctr", key, iv);
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedBase64, "base64")),
        decipher.final(),
    ]);
    return decrypted.toString("utf8");
}
function checkValidity(startDateStr, validityDays) {
    const [d, m, y] = startDateStr.split('/').map(Number);
    const startDate = new Date(y, m - 1, d);
    if (isNaN(startDate) || isNaN(validityDays)) return false;

    const now = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setDate(startDate.getDate() + validityDays);

    if (now > expiryDate) return false;

    const diffTime = expiryDate - now;
    let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let hours = Math.ceil(diffTime / (1000 * 60 * 60));
    let seconds = Math.ceil(diffTime / (1000));
    return { days, seconds, hours };
}
function uniqueString() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
function getRandomInRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports = { encrypt, decrypt, checkValidity, uniqueString,getRandomInRange };

