import Swal from "sweetalert2"
import { useGlobal } from "./context/globalContext"
import toast from "react-hot-toast"

const humanDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const openModal = async (name) => {
  return Swal.fire({
    title: "Are you sure to delete (" + name + ")",
    color: "white",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    background: "oklch(21% 0.034 264.665)",
    confirmButtonColor: "green",
  })
}
const register = async (user) => {
  const API_URL = import.meta.env.VITE_API_URL
  if (!user.password || !user.email) {
    return { status: 403, message: "Please fill in all fields" }
  }
  let username = user.email
  let password = user.password
  try {
    const response = await axios.post(API_URL + "/api/users/register", { email: username, password, client: true })
    if (response.status === 200 && response.data.token) {
      localStorage.setItem("token", response.data.token)
      return response
    } else if (response.data.error) {
      removeToken("token")
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

const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
function maskEmail(email) {
  const [name, domain] = email.split("@")
  if (name.length <= 4) return email // too short to mask properly
  const masked = name.slice(0, 2) + "*".repeat(name.length - 4) + name.slice(-2)
  return masked + "@" + domain
}
function checkPasswordStrength(password) {
  const strength = {
    0: "Very Weak",
    1: "Weak",
    2: "Medium",
    3: "Strong",
    4: "Very Strong",
  }

  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  return strength[score] || "Too Short"
}
export { humanDate, openModal, register, validateEmail, maskEmail, checkPasswordStrength }
