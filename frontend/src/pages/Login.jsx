import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "../../axiosConfig"
import { Toaster, toast } from "react-hot-toast"
import { loginUrl } from "../routes/Url"
import { MdLockPerson } from "react-icons/md";
function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      return toast.error("Fill all fields")
    }

    try {
      const response = await axios.post(loginUrl, { email: username, password })
      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        navigate("/dashboard/users")
      } else {
        toast.error("Credenciales inválidas")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something error happened")
      console.error("Something error happened:", err)
    }
  }

  return (
    <section className="login-section w-full h-screen flex items-center justify-center bg-gradient-to-br right-section">
      <div className="form w-full max-w-sm p-6 bg-gray-950/40 rounded-2xl shadow-lg    ">
        <h2 className="mb-6 flex justify-center text-8xl font-semibold text-blue-700">
        <MdLockPerson />
        </h2> 
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            Login
          </button>
        </form>
      </div>
    </section>
  )
}

export default Login
