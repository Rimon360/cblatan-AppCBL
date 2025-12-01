const ENV = import.meta.env
const BASE_URL = ENV.VITE_BACKEND_URL
const loginUrl = BASE_URL + "/api/users/login"
const browserUrl = BASE_URL + "/api/browser"
const blacklistUrlPath = BASE_URL + "/api/blacklist"
const profileGroupDataURL = BASE_URL + "/api/browser/group/get"
const verifyTokenURL = BASE_URL + "/api/verify-token"
const usersUrl = BASE_URL + "/api/users"
const UserUpdateURL = BASE_URL + "/api/users/update"
const usersLockingUrl = BASE_URL + "/api/users/lock"
const usersHistoryUrl = BASE_URL + "/api/users/history"
const registerURL = usersUrl + "/register"
const shopCreateURL = BASE_URL + "/api/shops/create"
const shopsURL = BASE_URL + "/api/shops"
const saveShopSettingsURL = BASE_URL + "/api/shops/settings/save"
const shopDeleteURL = BASE_URL + "/api/shops/delete"
const memberShopsURL = BASE_URL + "/api/shops/member"
const assignURL = BASE_URL + "/api/shops/assign"
const unassignURL = BASE_URL + "/api/shops/unassign"
const getassignedshopsURL = BASE_URL + "/api/shops/getassignedshops"
const productsURL = BASE_URL + "/api/products"
const productCreateURL = BASE_URL + "/api/products/create"
const productUpdateURL = BASE_URL + "/api/products/update"
const productDeleteURL = BASE_URL + "/api/products/delete"
const whitelistURL = BASE_URL + "/api/whitelist"
const ipBlacklistURL = BASE_URL + "/api/ipblacklist"
export {
  ipBlacklistURL,
  shopDeleteURL,
  productDeleteURL,
  loginUrl,
  verifyTokenURL,
  usersUrl,
  registerURL,
  shopCreateURL,
  productCreateURL,
  shopsURL,
  productsURL,
  productUpdateURL,
  assignURL,
  unassignURL,
  getassignedshopsURL,
  memberShopsURL,
  usersLockingUrl,
  UserUpdateURL,
  whitelistURL,
  browserUrl,
  profileGroupDataURL,
  blacklistUrlPath,
  usersHistoryUrl,
  saveShopSettingsURL,
}
