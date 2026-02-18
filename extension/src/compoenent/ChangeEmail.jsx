import { useNavigate, NavLink } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "../../axiosConfig"
import { toast } from "react-hot-toast"
import { MdEmail } from "react-icons/md"
import { IoArrowBack } from "react-icons/io5"
import { validateEmail } from "../util"

import { useGlobal } from "../context/globalContext"

const API_URL = import.meta.env.VITE_BACKEND_URL

function ChangeEmail() {
  const [email, setEmail] = useState("")
  const { state } = useGlobal()
  const navigate = useNavigate()
  useEffect(() => {
    if (!state.email) {
      return navigate("/login")
    }
  }, [])
  const handleEmailChange = async (e) => {
    e.preventDefault() 
    if (!state.email) {
      toast.error("Email is missing, start from begining")
      setTimeout(() => {
        navigate("/login")
      }, 3000)
      return
    }
    if (!validateEmail(email)) {
      return { status: 403, message: "El correo electrónico no es correcto." }
    }
    try {
      const response = await axios.post(API_URL + "/api/users/change-email", { email: state.email, changeto: email })
      if (response.data.message == "success") {
        toast.success("Email has been changed")
        navigate("/login")
        return
      }
      toast.error(response.data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Something error happened")
      console.error("Something error happened:", err)
    }
  }
  return (
    <section className=" w-full h-[95vh] flex flex-col items-center justify-center">
      <div className="p-2 bg-blue-950/50 w-[380px] mb-10 rounded-xl">
        <NavLink to="/confirm-email" className="!text-blue-500 text-2xl flex items-center  ">
          <IoArrowBack /> <small>Confirmación de correo electrónico</small>
        </NavLink>
      </div>
      <div className="form w-full max-w-sm p-6 bg-gray-900 rounded-2xl shadow-lg border border-blue-900">
        <h2 className="mb-7 text-center text-2xl font-semibold text-gray-500 ">Introduzca un correo electrónico válido</h2>
        <form onSubmit={handleEmailChange} className="space-y-6 flex flex-col">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-gray-400">
              <span className="flex items-center gap-1">
                <MdEmail /> Correo electrónico:
              </span>
              <input autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" required className="w-full px-4 py-2  " />
            </label>
          </div>
          <button type="submit" className="w-full !bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition">
            <span className="flex items-center gap-1 justify-center">Submit & Login</span>
          </button>
        </form>
        <div>
          <p className="text-center text-gray-600 mt-4">
            Ya tengo una cuenta? &nbsp;
            <NavLink to="/login" className="!text-blue-500 hover:underline">
              login
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  )
}

export default ChangeEmail
