import { useNavigate, NavLink } from "react-router-dom"
import { useState } from "react"
import axios from "../../axiosConfig"
import { toast } from "react-hot-toast"
import { IoKey } from "react-icons/io5"
import { FaEyeSlash } from "react-icons/fa"
import { FaRegEye } from "react-icons/fa"

import { useGlobal } from "../context/globalContext"
import { checkPasswordStrength } from "../util"
const API_URL = import.meta.env.VITE_BACKEND_URL

function ChangePassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { state } = useGlobal()
  const navigate = useNavigate() 

  if (!state.email) {
    return toast.error("Correo electrónico no encontrado")
  }
  const passwordVerified = () => {
    if (password !== confirmPassword) {
      toast.error("La contraseña no coincide")
      return false
    }

    if (password.length < 8) {
      toast.error("La longitud de la contraseña debe ser >= 8")
      return false
    }

    if (passwordStrength.includes("Weak")) {
      toast.error("La contraseña es muy débil, elija una contraseña segura")
      return false
    }

    return true
  }
  const [passwordStrength, setPassordStrength] = useState("")
  const handlePasswordEnter = (v) => {
    setPassword(v)
    setPassordStrength(checkPasswordStrength(v))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!passwordVerified()) return

    try {
      const response = await axios.post(API_URL + "/api/users/change-password", { email: state.email, password })
      if (response.data.message == "success") {
        toast.success("La contraseña ha sido cambiada exitosamente, por favor ingresa nuevamente!")
        navigate("/login")
      } else {
        toast.error("El correo electrónico o la contraseña son incorrectos")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Ocurrió un error")
      console.error("Ocurrió un error:", err)
    }
  }
  const [showPassword, setShowPassword] = useState(false)
  return (
    <section className=" w-full h-[95vh] flex items-center justify-center">
      <div className="form w-full max-w-sm p-6 bg-gray-900 rounded-2xl shadow-lg border border-blue-900">
        <h2 className="mb-7 text-center text-2xl font-semibold text-gray-500 ">Introduzca una nueva contraseña</h2>
        <form onSubmit={handleLogin} className="space-y-6 flex flex-col">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-gray-400">
              <span className="flex items-center gap-1">
                <IoKey /> Contraseña:
              </span>
              <input autoFocus type="text" value={password} onChange={(e) => handlePasswordEnter(e.target.value)} placeholder="Introducir contraseña" required className="w-full px-4 py-2  " />
            </label>
            <label className="text-gray-400">
              <span className="flex items-center gap-1">
                <IoKey /> confirmar Contraseña
              </span>
              <div className="flex gap-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Escriba la contraseña otra vez"
                  required
                  className="w-full "
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaRegEye /> : <FaEyeSlash />}
                </button>
              </div>
            </label>
          </div>
          {passwordStrength && (
            <span className={`${passwordStrength === "Very Weak" ? "text-red-500" : passwordStrength == "Very Strong" ? "text-green-400" : "text-yellow-500"}`}>{passwordStrength}</span>
          )}
          <button type="submit" className="w-full !bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition">
            <span className="flex items-center gap-1 justify-center">Entregar</span>
          </button>
        </form>
        <div>
          <p className="text-center text-gray-600 mt-4">
            Sé mi contraseña &nbsp;
            <NavLink to="/login" className="!text-blue-500 hover:underline">
              Acceso
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  )
}

export default ChangePassword
