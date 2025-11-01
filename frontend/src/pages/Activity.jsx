import { useEffect, useState } from "react"
import { RiDeleteBin6Line } from "react-icons/ri"
import { TiUserAdd } from "react-icons/ti"
import axios from "../../axiosConfig"
import { Navigate, Link } from "react-router-dom"
import { registerURL, usersUrl, usersLockingUrl } from "../routes/Url"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import { FaExternalLinkAlt } from "react-icons/fa"
import { useGlobal } from "../context/GlobalStete"
import { FaLockOpen } from "react-icons/fa"
import { FaLock } from "react-icons/fa6"

const Activity = () => {
  const [email, setEmail] = useState("")
  const [usageLimit, setUsageLimit] = useState(1)
  const [password, setPassword] = useState("")
  const [userrole, setRole] = useState("member")
  const [users, setActivity] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [filteredActivity, setFilteredActivity] = useState([])
  const { current_user } = useGlobal()
  const [refresh, setRefresh] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now())
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
      .get(usersUrl + "/true", { headers: { Authorization: "Bearer " + token } })
      .then((response) => {
        setActivity(response.data)
        setFilteredActivity(
          users.filter(
            (user) =>
              user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user?.seq?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user?.ip_address?.toLowerCase().includes(searchTerm.toLowerCase())
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
      const res = await fetch(`${usersUrl}/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data) {
        setActivity(users.filter((u) => u._id !== id))
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
        setActivity((prev) => [...prev, response.data.user])
      })
      .catch((error) => {
        toast.error(error.response.data.message)
        console.error("Error creating user:", error)
      })
  }

  useEffect(() => {
    setFilteredActivity(
      users.filter(
        (user) =>
          user?.email?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          user?.seq?.toString().includes(searchTerm.toLowerCase().trim()) ||
          user?.ip_address_history?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          user?.ip_address?.toLowerCase().includes(searchTerm.toLowerCase().trim())
      )
    )
  }, [users, searchTerm])

  const handleLockingUser = async (id, oldValue) => {
    try {
      let res = await axios.post(usersLockingUrl, { id: id, value: !oldValue }, { headers: { Authorization: "Bearer " + token } })
      if (res && res.status === 200) {
        setActivity((prev) => prev.map((user) => (user._id === id ? { ...user, is_locked: !oldValue } : user)))
      }
    } catch (error) {
      toast.error(error)
    }
  }
  const handleResetActivity = async () => {
    try {
      let res = await axios.post(usersUrl + "/resetactivity", {}, { headers: { Authorization: "Bearer " + token } })
      toast.success("Activity reseted")
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <>
      <section className="users ">
        <div className="users-container ">
          <input
            type="search"
            placeholder="Search user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 sticky top-0 mb-4 w-full border border-gray-300 bg-white z-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <hr />
          <small>Last updated at {new Date(lastUpdate).toLocaleString()} </small>
          <button onClick={handleResetActivity} className={`px-2 py-2 text-white rounded flex items-center justify-center bg-red-500  gap-2 hover:bg-red-600`}>
            Reset
          </button>
          <div className=" overflow-auto">
            <table className="w-full max-h-300 overflow-auto mt-4 text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">#</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">IP address</th>
                  <th className="p-2">IP history</th>
                  {/* <th className="p-2">Current Usags</th>*/}
                  <th className="p-2">Last ping time</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Lock user</th>
                  <th className="p-2">Created at</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivity.length > 0 ? (
                  filteredActivity.map((user, i) => {
                    if (user.role == "admin") return
                    let lastActive = user.last_ping_timestamp
                    let readAbleDate = new Date(lastActive).toLocaleString()
                    let lastActiveSeconds = Math.floor((Date.now() - lastActive) / 1000)
                    if (lastActiveSeconds > 1751920500) readAbleDate = "N/A"
                    if (lastActiveSeconds > 120) {
                      user.status = "Inactive"
                    } else {
                      user.status = "Active"
                    }

                    return (
                      <tr key={user._id} className="hover:bg-gray-100">
                        <td className="p-2">{filteredActivity.length - i}</td>
                        <td className="p-2 text-blue-500 select-all">
                          <a href={`mailto:${user.email}`} target="_blank" rel="noopener noreferrer">
                            {user.email}
                          </a>
                        </td>
                        <td className="p-2">{user.ip_address || "N/A"}</td>
                        <td>
                          <div className="!max-w-[500px] !max-h-[100px] overflow-auto   break-words">{user.ip_address_history || "N/A"}</div>
                        </td>
                        <td className="p-2 text-blue-400">{readAbleDate}</td>
                        <td className={user?.status == "Active" ? "p-2 text-green-500" : "p-2 text-red-500"}>{user?.status || "Inactive"}</td>
                        <td className="p-2">{user.role}</td>
                        <td>
                          <div className=" flex items-center justify-center">
                            <button
                              onClick={() => {
                                handleLockingUser(user._id, user.is_locked)
                              }}
                              className={`px-2 py-2 text-green-400 rounded flex items-center justify-center ${user?.is_locked ? "bg-red-100 text-red-400" : "bg-green-100 "} gap-2 hover:bg-green-200`}
                            >
                              {user?.is_locked ? (
                                <>
                                  <FaLock />
                                </>
                              ) : (
                                <>
                                  <FaLockOpen />
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="p-2 text-blue-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      Empty
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

export default Activity
