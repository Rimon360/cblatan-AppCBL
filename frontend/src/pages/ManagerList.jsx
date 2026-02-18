import { useEffect, useState } from "react"
import axios from "../../axiosConfig"
import { Navigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useGlobal } from "../context/GlobalStete"

const ManagerList = () => {
  const [users, setManager] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredManager, setFilteredManager] = useState([])
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
      .get(BACKEND_URL + "/api/users/manager/get", { headers: { Authorization: "Bearer " + token } })
      .then((response) => {
        setManager(response.data || [])
        setFilteredManager(
          users.filter(
            (manager) =>
              manager?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              manager?.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              manager?.role?.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        )
      })
      .catch((error) => {
        console.error("Error fetching users:", error)
      })
  }, [refresh])

  useEffect(() => {
    setFilteredManager(
      users.filter(
        (manager) =>
          manager?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          manager?.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          manager?.role?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }, [users, searchTerm])

  const handleResetManager = async () => {
    if (!confirm("Are you sure?")) return
    try {
      let res = await axios.post(BACKEND_URL + "/api/users/api_activity/reset", {}, { headers: { Authorization: "Bearer " + token } })
      toast.success(`${res.data.message} Data has been deleted`)
      setRefresh((prev) => !prev)
    } catch (error) {
      toast.error(error.message)
    }
  }
  const [selectedCourses, setSelectedCourses] = useState([])
  const [selectUsers, setSelectedUsers] = useState([])
  const [selectedManager, setSelectedManager] = useState()
  const handleManagerClick = async (email) => {
    try {
      let res = await axios.get(BACKEND_URL + "/api/users/manager/users/" + email, { headers: { Authorization: "Bearer " + token } })
      setSelectedUsers(res.data)
      setSelectedManager(email)
      setSelectedCourses([])
    } catch (error) {
      toast.error(error.message)
    }
  }

  const [selectedUser, setSelectedUser] = useState()
  const handleUserClick = async (id) => {
    try {
      setSelectedUser(id)
      let res = await axios.get(BACKEND_URL + "/api/users/manager/course/" + id, { headers: { Authorization: "Bearer " + token } })
      setSelectedCourses(res.data)
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
            placeholder="Search manager"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.trim())}
            className="p-2 sticky top-0 mb-4 w-full border border-gray-300 bg-white z-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <hr />
          <div className="p-1 rounded-sm  overflow-auto max-h-[300px] bg-gray-950/40">
            <p className="p-2 bg-gray-950 rounded-sm mb-1">Listas de administradores</p>
            <ul>
              {filteredManager.length > 0 ? (
                filteredManager.map((manager, i) => {
                  return (
                    <li
                      key={manager.email}
                      onClick={() => handleManagerClick(manager.email)}
                      className={`p-2 mb-1 bg-gray-950/35 rounded-md cursor-pointer  ${manager.email == selectedManager ? "!bg-blue-500/50" : ""} hover:border-1 hover:border-blue-500 hover:border-dotted`}
                    >
                      <p>
                        {filteredManager.length - i} - {manager.email}
                      </p>
                    </li>
                  )
                })
              ) : (
                <p colSpan="10" className="text-center py-4 text-green-500/50">
                  Emtpy
                </p>
              )}
            </ul>
          </div>
          <div className=" p-1 rounded-sm mt-2 overflow-auto max-h-[300px] bg-gray-950/40">
            <p className="p-2 bg-gray-950 rounded-sm mb-1">Listas de clientes</p>
            <ul>
              {selectUsers.length > 0 ? (
                selectUsers.map((user, i) => {
                  return (
                    <li
                      key={user.email}
                      onClick={() => handleUserClick(user._id)}
                      className={`p-2 mb-1 bg-gray-950/35 rounded-md cursor-pointer  ${user._id == selectedUser ? "!bg-blue-500/50" : ""} hover:border-1 hover:border-blue-500 hover:border-dotted`}
                    >
                      <p>
                        {selectUsers.length - i} - {user.email}
                      </p>
                    </li>
                  )
                })
              ) : (
                <p colSpan="10" className="text-center py-4 text-green-500/50">
                  Emtpy
                </p>
              )}
            </ul>
          </div>
          <div className=" p-1 rounded-sm mt-2 overflow-auto max-h-[300px] bg-gray-950/40">
            <p className="p-2 bg-gray-950 rounded-sm mb-1">Listas de cursos</p>
            <ul>
              {selectedCourses.length > 0 ? (
                selectedCourses.map((course, i) => {
                  return (
                    <li key={course._id} className="p-2 mb-1 bg-gray-950/35 rounded-md  hover:border-1  ">
                      <p>
                        {selectedCourses.length - i} - {course.shop_name}
                      </p>
                    </li>
                  )
                })
              ) : (
                <p colSpan="10" className="text-center py-4 text-green-500/50">
                  Emtpy
                </p>
              )}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

export default ManagerList
