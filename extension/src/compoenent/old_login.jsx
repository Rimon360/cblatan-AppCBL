import { login } from "../funcitons"
import { toast } from "react-toastify"
import { useState, useEffect } from "react"
import { Navigate, NavLink, useNavigate } from "react-router-dom"
import axios from "../../axiosConfig"
import { useGlobal } from "../context/globalContext"
import { verifyTokenURL } from "../routes/Url"
import { getToken, setToken, removeToken, remove } from "../funcitons"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { state, setState } = useGlobal()
  const [loginClicked, setLoginClicked] = useState(false)

  useEffect(() => {
    ;(async () => {
      let token = await getToken()
      if (token) {
        try {
          let decodedToken = await axios.get(verifyTokenURL, { headers: { Authorization: "Bearer " + token } })
          if (decodedToken.status === 200 && decodedToken.data.user) {
            setState(decodedToken.data.user)
            setIsLoggedIn(true)
          }
        } catch (error) {
          toast.error(error.response?.data.message || error.response?.data || error?.message || "La sesión ha expirado. Por favor, vuelve a iniciar sesión.")
          await removeToken()
          await remove("product")
        }
      }
    })()
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard")
      return
    }
  }, [isLoggedIn])
  const [isShowPassword, setIsShowPassword] = useState(false)
  const handleViewPassword = () => {
    setIsShowPassword(!isShowPassword)
  }
  return (
    <div className="min-h-screen flex items-center flex-col justify-center gap-5 bg-radial from-gray-900 to-gray-950 to-90%">
      <div>
        <img crossOrigin="anonymous" className="w-[250px] h-auto rounded-xl" src="/logo.png" alt="Logo" />
      </div>
      <div className="bg-gray-800 p-8 rounded-2xl   w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">Acceso</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setLoginClicked(true)
            return login({ email, password })
              .then((response) => {
                if (response?.status === 200) {
                  navigate("/dashboard")
                  localStorage.setItem("token", response.data.token)
                }
                setLoginClicked(false)
              })
              .catch((error) => {
                toast.error(error.response?.data?.message || error.response.data || "Login failed. Please try again.")
                setLoginClicked(false)
              })
          }}
          className="space-y-4"
        >
          <input
            value={email}
            type="email"
            onInput={(event) => {
              setEmail(event.target.value)
            }}
            placeholder="Correo electrónico"
            className=" placeholder:text-gray-400 w-full p-2 border   outline-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2 justify-between">
            <input
              value={password}
              onInput={(event) => {
                setPassword(event.target.value)
              }}
              type={isShowPassword ? "text" : "password"}
              placeholder="Contraseña"
              className=" placeholder:text-gray-400 w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" className="bg-blue-500/40 flex items-center justify-center text-blue-500 text-xl w-[50px] rounded-md" onClick={handleViewPassword}>
              {isShowPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <br />
          <button disabled={loginClicked} type="submit" className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200">
            Iniciar sesión
          </button>
        </form>
        {/* 
                <div>
                    <p className="text-center text-gray-600 mt-4">
                        Don't have an account? <NavLink to="/register" className="text-blue-600 hover:underline">Register</NavLink>
                    </p>
                </div> */}
      </div>
    </div>
  )
}

export default Login
