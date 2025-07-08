
function encrypt(text, key) {
    return btoa(key + btoa(text))
}

function decrypt(encryptedText, key) {
    return atob(atob(encryptedText).replace(key, ''))
}


module.exports = { encrypt, decrypt };