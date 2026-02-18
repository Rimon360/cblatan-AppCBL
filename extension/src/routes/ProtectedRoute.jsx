import { useEffect, useState } from "react"
import axios from "../../axiosConfig"
import { Navigate, useNavigate } from "react-router-dom"
import { useGlobal } from "../context/globalContext"
import { toast } from "react-toastify"
import { getToken, removeToken } from "../funcitons"
const API_URL = import.meta.env.VITE_BACKEND_URL
function ProtectedRoute({ children }) {
  const [verified, setVerified] = useState(0)
  const { setState } = useGlobal()
  const navigate = useNavigate()
  useEffect(() => {
    ;(async () => {
      const token = await getToken()
      if (!token) return setVerified(false)
      axios
        .get(API_URL + "/api/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          let user = res.data.user
          if (user && user.email_verified) {
            res.data.user.token = token
            if (!["appcbl_soft", "admin", "specific", "member", "all_profile", "manager"].includes(user.role)) {
              toast.error("¡Aún no tienes permiso para utilizar este software!")
              setVerified(-1)
              return
            }
            setState(user)
            setVerified(1)
          } else if (user.email_verified == false) {
            setState(user)
            setVerified(1)
            navigate("/confirm-email")
            return
          } else if (user.verified === false) {
            setState(user)
            navigate("/confirm-email")
          } else {
            throw new Error("No token provided or email not verified!")
          }
        })
        .catch(async (e) => {
          toast.error(e?.response?.data.message || e.message || "User verification failed!")
          await removeToken()
          setVerified(-1)
        })
    })()
  }, [])

  if (verified === 0) return <div>Loading...</div>
  if (verified === -1) return <Navigate to="/login" />

  return children
}

export default ProtectedRoute
