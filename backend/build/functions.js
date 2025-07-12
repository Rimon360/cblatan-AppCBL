"use strict";

var crypto = require("crypto");
var secret = process.env.CRYPTO_KEY;
var key = crypto.createHash("sha256").update(secret).digest(); // 32-byte key
var iv = Buffer.alloc(16, 0); // constant IV (not secure for real-world use)

function encrypt(text) {
  var cipher = crypto.createCipheriv("aes-256-ctr", key, iv);
  var encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher["final"]()]);
  return encrypted.toString("base64");
}
function decrypt(encryptedBase64) {
  var decipher = crypto.createDecipheriv("aes-256-ctr", key, iv);
  var decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedBase64, "base64")), decipher["final"]()]);
  return decrypted.toString("utf8");
}
module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
};