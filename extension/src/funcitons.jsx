import axios from "axios"
import { toast } from "react-hot-toast"
import { registerURL, loginUrl, productsURL } from "./routes/Url"

let isProduction = 1
const login = async (user) => {
  if (!user.password || !user.email) {
    return { status: 403, message: "Please fill in all fields" }
  }
  let username = user.email
  let password = user.password
  try {
    const response = await axios.post(loginUrl, { email: username, password })
    if (response.status === 200 && response.data.token) {
      await setToken(response.data.token)
      return response
    } else if (response.data.error) {
      removeToken("token")
      remove("product")
      toast.warn(response.data.message)
      return
    } else {
      toast.error("Credenciales inválidas")
      return
    }
  } catch (err) {
    console.error(err)
    toast.error(err.response.data.message || "Something unknown happend. Please try again later!")
  }
}
const register = async (user) => {
  if (!user.password || !user.email) {
    return { status: 403, message: "Please fill in all fields" }
  }
  let username = user.email
  let password = user.password
  try {
    const response = await axios.post(registerURL, { email: username, password, role: "i64V1k5uSiNAT9mlf6uw+Q==:tSXIZwCmgdx4uGtMar/5Mg==" })
    if (response.status === 200 && response.data.token) {
      await setToken(response.data.token)
      return response
    } else if (response.data.error) {
      removeToken("token")
      remove("product")
      toast.warn(response.data.message)
      return
    } else {
      toast.error("Please try again later!")
      return
    }
  } catch (err) {
    console.error(err)
    toast.error(err.response.data.message || "Something unknown happend. Please try again later!")
  }
}

const logout = () => {
  removeToken()
  window.location.href = "/login"
}

const sanitizeString = (str) => {
  return str.replace(
    /[&<>"'`=\/]/g,
    (s) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "`": "&#x60;",
        "=": "&#x3D;",
        "/": "&#x2F;",
      }[s])
  )
}
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

const getToken = async () => {
  if (isProduction) {
    return (await chrome?.storage?.local.get("token"))?.["token"] || null
  } else {
    return localStorage.getItem("token")
  }
}
const setToken = async (token) => {
  if (isProduction) {
    await chrome?.storage?.local.set({ token })
  } else {
    localStorage.setItem("token", token)
  }
}
const removeToken = async () => {
  if (isProduction) {
    await chrome.storage.local.remove("token")
  } else {
    localStorage.removeItem("token")
  }
}
const windowTrackKey = "windowTrackList"
const handleWebsiteLogin = async (d, e, k, proxy, pid) => {
  if (window.chrome) {
    let incognitoList = ["hotmart.com", "www.hotmart.com", "labs.google", "www.labs.google", "gemini.google.com", "www.gemini.google.com", "skool.com", "www.skool.com"]
    let hasIncognitoPermission = await chrome.extension.isAllowedIncognitoAccess()
    let extensionId = chrome.runtime.id
    try {
      let res = false
      if (proxy && proxy.trim()) {
        res = await chrome.runtime.sendMessage({ ref: "set_proxy", proxy })
        if (res == true) {
          toast.success("¡Ya estás listo!, redireccionando al sitio....")
        } else {
          await chrome.runtime.sendMessage({ ref: "reset_proxy" })
          toast.error("¡Error al configurar el proxy!, redireccionando al sitio....")
        }
        await new Promise((rs) => setTimeout(rs, 1000))
      } else {
        await chrome.runtime.sendMessage({ ref: "reset_proxy" })
      }
      await chrome.storage.local.set({ product: { d, e, k, t: Date.now() } })

      if (incognitoList.includes(getDomain(d))) {
        await closeAllIncognitoTabs(d)

        // if (hasIncognitoPermission) {
        //   chrome.windows.create({ url: d, incognito: true })
        // } else {
        //   let exUrl = `chrome://extensions/?id=${extensionId}`
        //   chrome.tabs.create({ url: exUrl })
        //   let count = 0
        //   let int = setInterval(async () => {
        //     count++
        //     if (count >= 30) {
        //       clearInterval(int)
        //     }
        //     if (await chrome.extension.isAllowedIncognitoAccess()) {
        //       clearInterval(int)
        //       chrome.windows.create({ url: d, incognito: true })
        //     }
        //   }, 1000)
        // }
      }
      // chrome.tabs.create({ url: d })
      chrome.windows.create({ url: d }, async (win) => {
        const windowId = win.id
        await addWindowOnTrackList(windowId, pid)
      })
      await addActivityStatus(pid)
    } catch (error) {
      toast.error("ERROR: " + error.message)
    }
  }
  return false
}

const addWindowOnTrackList = async (winId, pid) => {
  let oldData = (await chrome.storage.local.get(windowTrackKey))[windowTrackKey] || []
  oldData.push({ [winId]: pid })
  await chrome.storage.local.set({ [windowTrackKey]: oldData })
}
const addActivityStatus = async (id) => {
  let token = await getToken()
  let country = Intl.DateTimeFormat().resolvedOptions().timeZone
  await axios.post(productsURL + "/activitystatus/add", { id, country }, { headers: { Authorization: "Bearer " + token } })
}
const closeAllIncognitoTabs = async (d) => {
  let tabs = await chrome.tabs.query({})
  for (const tab of tabs) {
    if (getDomain(tab.url).includes(getDomain(d))) {
      await chrome.tabs.remove(tab.id)
      let domain = getRootDomain(tab.url)
      deleteCookiesRoot(domain)
    }
  }
  await new Promise((rs) => setTimeout(rs, 200))
}
function getRootDomain(url) {
  const host = new URL(url).hostname
  const parts = host.split(".")

  // brand TLDs you may extend
  const brandTLDs = ["google"]

  const tld = parts[parts.length - 1]

  // If brand TLD → return last 2 parts (labs.google → google)
  if (brandTLDs.includes(tld)) {
    return parts.slice(-1).join(".")
  }

  // normal domains
  if (parts.length <= 2) return host
  return parts.slice(-2).join(".")
}

function deleteCookiesRoot(rootDomain) {
  chrome.cookies.getAll({}, (cookies) => {
    cookies
      .filter((c) => c.domain.includes(rootDomain))
      .forEach((c) => {
        chrome.cookies.remove({
          url: (c.secure ? "https://" : "http://") + c.domain + c.path,
          name: c.name,
        })
      })
  })
}

const remove = async (key) => {
  if (isProduction) {
    return await chrome.storage.local.remove(key)
  } else {
    return localStorage.removeItem(key)
  }
}
function disableInspect() {
  console.log("Disabling inspect element...")
  const preventInspect = (e) => {
    e.preventDefault()
    return false
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "F12" || (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) || (e.ctrlKey && e.key === "U")) preventInspect(e)
  })

  document.addEventListener("contextmenu", preventInspect)
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > 200) window.close() // likely devtools open
  }, 1000)
}
async function decrypt(encryptedB64) {
  const keyStr = import.meta.env.VITE_CRYPTO_KEY
  const key = await crypto.subtle.importKey("raw", await crypto.subtle.digest("SHA-256", new TextEncoder().encode(keyStr)), { name: "AES-CTR" }, false, ["decrypt"])

  const iv = new Uint8Array(16) // same constant IV
  const encrypted = Uint8Array.from(atob(encryptedB64), (c) => c.charCodeAt(0))

  const decrypted = await crypto.subtle.decrypt({ name: "AES-CTR", counter: iv, length: 64 }, key, encrypted)

  return new TextDecoder().decode(decrypted)
}
export { logout, login, getDomain, getToken, setToken, removeToken, isValidURL, handleWebsiteLogin, remove, register, decrypt, disableInspect }
