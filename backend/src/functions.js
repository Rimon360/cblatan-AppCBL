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

module.exports = { encrypt, decrypt };