import { useNavigate, NavLink } from "react-router-dom"
import { useState } from "react"
import axios from "../../axiosConfig"
import { toast } from "react-hot-toast"
import { IoKey } from "react-icons/io5"
import { MdEmail } from "react-icons/md"
import { FaEyeSlash } from "react-icons/fa"
import { FaRegEye } from "react-icons/fa"
import { IoPersonAddOutline } from "react-icons/io5"
import { checkPasswordStrength, validateEmail } from "../util"
import logo from "../../public/logo.png"
import { setToken } from "../funcitons"
const API_URL = import.meta.env.VITE_BACKEND_URL

function Register() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [passwordStrength, setPassordStrength] = useState("")
  const handlePasswordEnter = (v) => {
    setPassword(v)
    setPassordStrength(checkPasswordStrength(v))
  }
  const passwordVerified = () => {
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
  const handleRegister = async (e) => {
    e.preventDefault()
    if (!passwordVerified()) return
    if (!validateEmail(email)) {
      return { status: 403, message: "El correo electrónico no es correcto." }
    }

    if (!email || !password || !username) {
      return { status: 403, message: "Por favor complete todos los campos" }
    }
    try {
      const response = await axios.post(API_URL + "/api/users/register", { email: email, password, username, client: true })
      if (response.status === 200 && response.data.token) {
        await setToken(response.data.token)
        navigate("/dashboard")
      } else if (response.data.error) {
        toast.warn(response.data.message)
        return
      } else {
        toast.error("Please try again later!")
        return
      }
    } catch (err) {
      toast.error(err.response.data.message || "Something unknown happend. Please try again later!")
    }
  }

  const [showPassword, setShowPassword] = useState(false)
  return (
    <section className=" w-full h-[95vh] flex items-center justify-center">
      <div className="form w-full max-w-sm p-6 bg-gray-900 rounded-2xl shadow-lg border border-blue-900">
        <div className="w-full flex justify-center">
          <img src={logo} alt="Logo" className="rounded-xl w-50" srcset="" />
        </div>
        <h2 className="mb-7 text-center text-2xl font-semibold text-gray-500 ">Registrar una cuenta</h2>
        <form onSubmit={handleRegister} className="space-y-6 flex flex-col">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-gray-400">
              <span className="flex items-center gap-1">
                <MdEmail /> Correo electrónico:
              </span>
              <input autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" required className="w-full px-4 py-2 bg-gray-950 " />
            </label>
            <label className="text-gray-400">
              <span className="flex items-center gap-1">
                <MdEmail /> Correo electrónico:
              </span>
              <input autoFocus type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="w-full px-4 py-2 bg-gray-950 " />
            </label>
            <label className="text-gray-400">
              <span className="flex items-center gap-1">
                <IoKey /> Contraseña
              </span>
              <div className="flex gap-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handlePasswordEnter(e.target.value)}
                  placeholder="Introducir contraseña"
                  required
                  className="w-full bg-gray-950"
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
            <span className="flex items-center gap-1 justify-center">
              Entregar <IoPersonAddOutline />
            </span>
          </button>
        </form>
        <div>
          <p className="text-center text-gray-600 mt-4">
            ¿Ya tienes una cuenta? &nbsp;
            <NavLink to="/login" className="!text-blue-500 hover:underline">
              Acceso
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Register
