import { useEffect, useState } from "react"
import { RiDeleteBin6Line } from "react-icons/ri"
import axios from "../../axiosConfig"
import { Navigate } from "react-router-dom"
import { usersHistoryUrl } from "../routes/Url"
import toast from "react-hot-toast"
import { useGlobal } from "../context/GlobalStete"

const ApiActivity = () => {
  const [users, setHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredHistory, setFilteredHistory] = useState([])
  const { current_user } = useGlobal()
  const [refresh, setRefresh] = useState(false)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((prev) => !prev)
    }, 30 * 1000) // 60 seconds
    return () => clearInterval(interval)
  }, [])

  const token = localStorage.getItem("token")
  const role = current_user.role
  if (role !== "admin") {
    return <Navigate to={"/"} />
  }
  useEffect(() => {
    axios
      .get(BACKEND_URL + "/api/users/get-api-activity", { headers: { Authorization: "Bearer " + token } })
      .then((response) => {
        setHistory(response.data?.api_activity || [])
        setFilteredHistory(
          users.filter(
            (history) =>
              history?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              history?.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              history?.role?.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        )
      })
      .catch((error) => {
        console.error("Error fetching users:", error)
      })
  }, [refresh])

  useEffect(() => {
    setFilteredHistory(
      users.filter(
        (history) =>
          history?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          history?.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          history?.role?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }, [users, searchTerm])

  const handleResetHistory = async () => {
    if (!confirm("Are you sure?")) return
    try {
      let res = await axios.post(BACKEND_URL + "/api/users/api_activity/reset", {}, { headers: { Authorization: "Bearer " + token } })
      toast.success(`${res.data.message} Data has been deleted`)
      setRefresh((prev) => !prev)
    } catch (error) {
      toast.error(error.message)
    }
  }
  const handleDeleteHistory = async (id) => {
    try {
      let res = await axios.post(usersHistoryUrl + "/delete", { id }, { headers: { Authorization: "Bearer " + token } })
      setRefresh((prev) => !prev)
      toast.success(res.data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <>
      <section className="users p-6">
        <div className="users-container mt-6">
          <input
            type="search"
            placeholder="Search history"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.trim())}
            className="p-2 sticky top-0 mb-4 w-full border border-gray-300 bg-white z-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <hr />
          <button onClick={handleResetHistory} className={`px-2 py-2 text-white rounded flex items-center justify-center bg-red-500  gap-2 hover:bg-red-600`}>
            Reset
          </button>
          <div className=" overflow-auto">
            <table className="w-full max-h-300 overflow-auto mt-4 text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">#</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">IP address</th>
                  <th className="p-2">Action route</th>
                  {/* <th className="p-2">Delete</th> */}
                  <th className="p-2">Peru Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((history, i) => {
                    return (
                      <tr key={history._id} className="hover:bg-gray-100">
                        <td className="p-2">{filteredHistory.length - i}</td>
                        <td className="p-2 text-green-400 select-all">{history.email}</td>
                        <td className="p-2">{history.role || "N/A"}</td>

                        <td>
                          <div className="!max-w-[300px] !max-h-[100px] overflow-auto  break-words">{history.ip_address || "N/A"}</div>
                        </td>
                        <td>
                          <div className="!max-w-[300px] !max-h-[100px] overflow-auto  break-words">{history.api_route || "N/A"}</div>
                        </td>
                        {/* <td className="p-2 text-blue-400">
                          <div className=" flex items-center justify-center">
                            <button
                              onClick={() => {
                                handleDeleteHistory(history._id)
                              }}
                              className={`px-2 py-2 text-red-400 bg-blue-800/50 hover:bg-red-500 hover:text-white rounded flex items-center justify-center `}
                            >
                              <RiDeleteBin6Line />
                            </button>
                          </div>
                        </td> */}
                        <td className="p-2 text-blue-400">{history.peru_time}</td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-4 text-green-500/50">
                      ¡Estáis todos a salvo!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}

export default ApiActivity
