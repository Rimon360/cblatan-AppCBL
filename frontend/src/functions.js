
function encrypt(text, key) {
    return btoa(key + btoa(text))
}

function decrypt(encryptedText, key) {
    return atob(atob(encryptedText).replace(key, ''))
}
const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

const getDomain = (url) => {
    if (!url) return console.log("URL param can not be undifined")
    if (!isValidURL(url)) return console.log("Invalid Url")
    return (new URL(url)).hostname
}

export { encrypt, decrypt, getDomain, isValidURL }