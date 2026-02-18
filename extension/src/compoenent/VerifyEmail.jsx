import { useNavigate, NavLink } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "../../axiosConfig"
import { toast } from "react-hot-toast"
import { IoArrowBack } from "react-icons/io5"
import { useGlobal } from "../context/globalContext"
import { maskEmail } from "../util"
import { getToken, setToken } from "../funcitons"
const API_URL = import.meta.env.VITE_BACKEND_URL

function VerifyEmail() {
  const [otp, setOTP] = useState("")
  const { state, setState } = useGlobal()
  const navigate = useNavigate()

  useEffect(() => {
    if (!state.email) {
      return navigate("/login")
    }
  }, [])

  const [isDisabled, setIsDisabled] = useState(true)
  let [timer, setTimer] = useState(30)
  const [updateTimer, setUpdateTimer] = useState(Date.now())
  useEffect(() => {
    let count = 30
    let int = setInterval(() => {
      count--
      setTimer(count)
      if (count < 1) {
        clearInterval(int)
        setIsDisabled(false)
      }
    }, 1000)
  }, [updateTimer])

  const handleResendOTP = async () => {
    setIsDisabled(true)
    setTimer(30)
    setUpdateTimer(Date.now())
    if (!state.email || !state.token) {
      return toast.error("Token invalid")
    }

    try {
      const response = await axios.post(API_URL + "/api/users/send-otp", {}, { headers: { Authorization: "Bearer " + state.token } })
      if (response.data.message == "success") {
        toast.success("OTP sent successfully")
      } else {
        toast.error("OTP sending failed!")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something error happened")
      console.error("Something error happened:", err)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (!state.token) state.token = await getToken()
    try {
      const response = await axios.post(API_URL + "/api/users/verify-otp", { otp }, { headers: { Authorization: "Bearer " + state.token } })
      if (response.data.message == "success") { 
        await setToken(response.data.token);
        toast.success("OTP Verified")
        navigate("/dashboard")
      } else if (response.data.message == "not_matched") {
        toast.error("OTP is wrong")
      } else if (response.data.message == "expired") {
        toast.error("OTP has been Expired!")
      } else {
        toast.error("Something error happened")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something error happened")
      console.error("Something error happened:", err)
    }
  }
  return (
    <section className=" w-full h-[95vh] flex flex-col items-center justify-center">
      <div className="p-2 bg-blue-950/50 w-[380px] mb-10 rounded-xl">
        <NavLink to="/confirm-email" className="!text-blue-500 text-2xl flex items-center  ">
          <IoArrowBack />
        </NavLink>
      </div>
      <div className="form w-full max-w-sm p-6 bg-gray-900 rounded-2xl shadow-lg border border-blue-900">
        <h2 className="mb-7 text-center text-2xl font-semibold text-gray-500 ">Ingrese 6 dígitos OTP</h2>
        <form onSubmit={handleVerifyOTP} className="space-y-6 flex flex-col">
          <div className="flex flex-col gap-2 w-full">
            <span className=" text-center text-green-400">Enviado a: {maskEmail(state?.email || "")}</span>
            <span className="text-yellow-300 text-center">Mira tu bandeja de entrada/carpeta de correo no deseado</span>
            <label className="text-gray-400">
              <input autoFocus type="text" maxLength={6} pattern="\d{6}" value={otp} onChange={(e) => setOTP(e.target.value)} placeholder="------" required className="w-full px-4 py-2 text-center bg-gray-950" />
            </label>
          </div>
          <button type="submit" className="w-full !bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition">
            Verificar
          </button>
        </form>
        <br />
        <button
          onClick={handleResendOTP}
          disabled={isDisabled}
          type="submit"
          className="w-full  hover:!bg-blue-950  text-blue-500 !p-1 !bg-transparent !border-none rounded-lg hover:underline transition"
        >
          <span className="flex items-center gap-1 justify-center"> {timer > 0 ? `Re-send in ${timer}s` : `Reenviar OTP`}</span>
        </button>
        <div>
          <p className="text-center text-gray-600 mt-4">
            No tengo una cuenta? &nbsp;
            <NavLink to="/change-email" className="!text-blue-500 hover:underline">
              Cambiar correo electrónico
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  )
}

export default VerifyEmail
