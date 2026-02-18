import { useNavigate, NavLink } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "../../axiosConfig"
import { toast } from "react-hot-toast"
import { IoArrowBack, IoArrowForward } from "react-icons/io5"
import { useGlobal } from "../context/globalContext"
import { maskEmail, validateEmail } from "../util"
import { getToken } from "../funcitons"
const API_URL = import.meta.env.VITE_BACKEND_URL

function ConfirmEmail() {
  const [otp, setOTP] = useState("")
  const { state } = useGlobal()
  const navigate = useNavigate()

  useEffect(() => {
    if (!state.email) {
      return navigate("/login")
    }
  }, [])

  const handleSendOTP = async (e) => {
    if (!validateEmail(state.email)) {
      return toast.error("Correo electrónico no válido")
    }
    if (!state.email || (!state.token && !(await getToken()))) {
      return toast.error("Token invalid")
    }

    try {
      const response = await axios.post(API_URL + "/api/users/send-otp", {}, { headers: { Authorization: "Bearer " + (state.token || (await getToken())) } })
      if (response.data.message == "success") {
        navigate("/verify-email")
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
      <div className="p-2 bg-blue-950/50 w-[380px] mb-1 rounded-xl">
        <NavLink to="/login" className="!text-blue-500 text-2xl flex items-center  ">
          <IoArrowBack /> <small>Acceso</small>
        </NavLink>
      </div>
      <div className="p-2 bg-blue-950/50 w-[380px] mb-10 rounded-xl">
        <NavLink to="/verify-email" className="!text-blue-500 text-2xl flex items-center justify-end  ">
          <small>Ya tengo OTP</small> <IoArrowForward />
        </NavLink>
      </div>
      <div className="form w-full max-w-sm p-6 bg-gray-900 rounded-2xl shadow-lg border border-blue-900">
        <h2 className="mb-7 text-center text-2xl font-semibold text-gray-500 ">¿ESTA ES TU CORREO ELECTRÓNICO VÁLIDO?</h2>
        <h2 className="text-sm text-center bg-gray-950 text-white p-2 rounded-xl"> {state.email}</h2>
        <br />
        <button onClick={handleSendOTP} type="submit" className="w-full !bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition">
          <span className="flex items-center gap-1 justify-center">Enviar OTP</span>
        </button>
        <div>
          <p className="text-center text-gray-600 mt-4">
            ¿No lo reconoció? &nbsp;
            <NavLink to="/change-email" className="!text-blue-500 hover:underline">
              Cambiar correo electrónico
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  )
}

export default ConfirmEmail
