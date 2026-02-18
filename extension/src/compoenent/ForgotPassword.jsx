import { useNavigate, NavLink } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "../../axiosConfig"
import { toast } from "react-hot-toast"
import { IoArrowBack } from "react-icons/io5"
import { validateEmail } from "../util"
import { useGlobal } from "../context/globalContext"
const API_URL = import.meta.env.VITE_BACKEND_URL

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const { setState } = useGlobal()
  const navigate = useNavigate()

  const handleEmailCheck = async (e) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      return toast.error("Correo electrónico no válido")
    }

    try {
      const response = await axios.post(API_URL + "/api/users/check-email", { email })
      if (response.data.message == "success") {
        setState({ email: response.data.email })
        navigate("/verify-otp")
      } else {
        toast.error("El correo electrónico o la contraseña son incorrectos")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something error happened")
      console.error("Something error happened:", err)
    }
  }
  const [showPassword, setShowPassword] = useState(false)
  return (
    <section className=" w-full h-[95vh] flex flex-col items-center justify-center">
      <div className="p-2 bg-blue-950/50 w-[380px] mb-10 rounded-xl">
        <NavLink to="/login" className="!text-blue-500 text-2xl flex items-center  ">
          <IoArrowBack /> <small>Acceso</small>
        </NavLink>
      </div>
      <div className="form w-full max-w-sm p-6 bg-gray-900 rounded-2xl shadow-lg border border-blue-900">
        <h2 className="mb-7 text-center text-2xl font-semibold text-gray-500 ">Ingrese su correo electrónico de cuenta</h2>
        <form onSubmit={handleEmailCheck} className="flex flex-col  !gap-4 ">
          <input className="w-full bg-gray-950" type="email" onInput={(e) => setEmail(e.target.value)} placeholder="Introduce tu correo electrónico" />
          <button type="submit" className="w-full !bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition">
            <span className="flex items-center gap-1 justify-center">Enviar OTP</span>
          </button>
        </form>
        <div>
          <p className="text-center text-gray-600 mt-4">
            Sé mi contraseña! &nbsp;
            <NavLink to="/login" className="!text-blue-500 hover:underline">
              Acceso
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword
