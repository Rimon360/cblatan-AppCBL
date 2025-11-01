import { useEffect, useState } from "react"
import { RiDeleteBin6Line } from "react-icons/ri"
import { TiUserAdd } from "react-icons/ti"
import axios from "../../axiosConfig"
import { Navigate, Link } from "react-router-dom"
import { ipBlacklistURL, registerURL, usersHistoryUrl, usersLockingUrl } from "../routes/Url"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import { GoBlocked } from "react-icons/go"
import { useGlobal } from "../context/GlobalStete"
import { FaLockOpen } from "react-icons/fa"
import { FaLock } from "react-icons/fa6"
import { MdBlockFlipped } from "react-icons/md"

const History = () => {
  const [email, setEmail] = useState("")
  const [usageLimit, setUsageLimit] = useState(1)
  const [password, setPassword] = useState("")
  const [userrole, setRole] = useState("member")
  const [users, setHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [filteredHistory, setFilteredHistory] = useState([])
  const { current_user } = useGlobal()
  const [refresh, setRefresh] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
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
      .post(usersHistoryUrl + "/get", {}, { headers: { Authorization: "Bearer " + token } })
      .then((response) => {
        setHistory(response.data)
        setFilteredHistory(
          users.filter(
            (history) =>
              history?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              history?.seq?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              history?.browsed_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              history?.ip?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      })
      .catch((error) => {
        console.error("Error fetching users:", error)
      })
  }, [refresh])

  const openModal = (id, name) => {
    Swal.fire({
      title: "Are you sure to delete (" + name + ")",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(id)
      }
    })
  }

  const confirmDelete = async (id) => {
    try {
      const res = await fetch(`${usersHistoryUrl}/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data) {
        setHistory(users.filter((u) => u._id !== id))
      } else {
        toast.error("Failed to delete the uses")
      }
    } catch (err) {
      toast.error("Delete error", err)
      console.error("Delete error:", err)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (email.trim() === "") {
      toast.error("Email should not be empty")
      return
    }
    if (usageLimit === "" || usageLimit < 1) {
      toast.error("usageLimit should not be empty")
      return
    }
    if (password.length < 3) {
      toast.error("Password length should be >= 4")
      return
    }

    axios
      .post(registerURL, {
        usageLimit,
        email,
        password,
        role: userrole,
      })
      .then((response) => {
        setEmail("")
        setUsageLimit(1)
        setPassword("")
        setHistory((prev) => [...prev, response.data.history])
      })
      .catch((error) => {
        toast.error(error.response.data.message)
        console.error("Error creating history:", error)
      })
  }

  useEffect(() => {
    setFilteredHistory(
      users.filter(
        (history) =>
          history?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          history?.seq?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          history?.browsed_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          history?.ip?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [users, searchTerm])

  const handleLockingUser = async (id, oldValue) => {
    try {
      let res = await axios.post(usersLockingUrl, { id: id, value: !oldValue }, { headers: { Authorization: "Bearer " + token } })
      if (res && res.status === 200) {
        setHistory((prev) => prev.map((history) => (history._id === id ? { ...history, is_locked: !oldValue } : history)))
        setRefresh((prev) => !prev)
      }
    } catch (error) {
      toast.error(error)
    }
  }
  const handleResetHistory = async () => {
    if (!confirm("Are you sure?")) return
    try {
      let res = await axios.post(usersHistoryUrl + "/resethistory", {}, { headers: { Authorization: "Bearer " + token } })
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
  const handleBLockingIp = async (ip_address, isAdd) => {
    try {
      let res
      if (isAdd) {
        res = await axios.post(ipBlacklistURL, { ip_address }, { headers: { Authorization: "Bearer " + token } })
      } else {
        res = await axios.delete(ipBlacklistURL, { data: { ip_address }, headers: { Authorization: "Bearer " + token } })
      }
      if (res.status === 200) {
        toast.success("Success")
        setRefresh((prev) => !prev)
        return
      }
    } catch (error) {
      toast.error(error.response.data.message || error.message || "Failed to add blacklist")
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
            Reset History
          </button>
          <div className=" overflow-auto">
            <table className="w-full max-h-300 overflow-auto mt-4 text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">#</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">IP address</th>
                  <th className="p-2">Visited to</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Lock account</th>
                  <th className="p-2">Block IP</th>
                  <th className="p-2">Delete</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((history, i) => {
                    return (
                      <tr key={history._id} className="hover:bg-gray-100">
                        <td className="p-2">{filteredHistory.length - i}</td>
                        <td className="p-2 text-green-400 select-all">{history.email}</td>
                        <td className="p-2">{history.ip || "N/A"}</td>
                        <td>
                          <div className="!max-w-[300px] !max-h-[100px] overflow-auto  break-words">{history.browsed_url || "N/A"}</div>
                        </td>
                        <td className="p-2 text-red-500">🚫Suspicious</td>
                        <td className="p-2">{history.role || "N/A"}</td>
                        <td>
                          <div className=" flex items-center justify-center">
                            {history.user_id ? (
                              <button
                                onClick={() => {
                                  handleLockingUser(history.user_id, history.is_locked)
                                }}
                                className={`px-2 py-2 text-green-400 rounded flex items-center justify-center ${history?.is_locked ? "  text-red-400" : "bg-blue-800/50 "} gap-2 hover:bg-blue-800`}
                              >
                                {history?.is_locked ? <FaLock /> : <FaLockOpen />}
                              </button>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </td>
                        <td className="p-2 text-blue-400">
                          <div className=" flex items-center justify-center">
                            <button
                              onClick={() => {
                                handleBLockingIp(history.ip, !history?.ip_blocked)
                              }}
                              className={`px-2 py-2 text-green-400 rounded flex items-center justify-center ${history?.ip_blocked ? "  text-red-400" : "bg-blue-800/50 "} gap-2 hover:bg-blue-800`}
                            >
                              {history?.ip_blocked ? "Obstruida" : "Bloquear"}
                            </button>
                          </div>
                        </td>
                        <td className="p-2 text-blue-400">
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
                        </td>
                        <td className="p-2 text-blue-400">{new Date(history.createdAt).toLocaleDateString()}</td>
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

export default History
