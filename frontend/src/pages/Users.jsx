import { useEffect, useState } from "react"
import { RiDeleteBin6Line } from "react-icons/ri"
import { TiUserAdd } from "react-icons/ti"
import axios from "../../axiosConfig"
import { useNavigate, Link } from "react-router-dom"
import { registerURL, usersUrl, UserUpdateURL, profileGroupDataURL } from "../routes/Url"
import { MdOutlineDownloading } from "react-icons/md"
import { checkValidity } from "../functions"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import { FaExternalLinkAlt } from "react-icons/fa"
import { useGlobal } from "../context/GlobalStete"
import { format } from "date-fns"
import { CiEdit } from "react-icons/ci"
import { RxCross2, RxUpdate } from "react-icons/rx"
import { IoCheckmarkDone } from "react-icons/io5"
import { IoIosAdd, IoMdClose } from "react-icons/io"
import { useRef } from "react"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const Users = () => {
  const [email, setEmail] = useState("")

  // new entries started
  const [wasap, setWasap] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [nstbrowserEmail, setNstbrowserEmail] = useState("")
  const [username, setUsername] = useState("")
  // const [subscripitonTerm, setSubscripitonTerm] = useState("");
  const [niche, setNiche] = useState("")
  const [affiliate, setAffiliate] = useState("")
  const [supervisor, setSupervisor] = useState("")
  const [observation, setObservation] = useState("")
  const date = new Date()
  const [subStartDate, setSubStartDate] = useState(date.toISOString().split("T")[0])
  const [subValidity, setSubValidity] = useState(31)
  const [dataFirstId, setDataFirstId] = useState("")
  const [dataLastId, setDataLastId] = useState("")
  // new entries based on user requirements end

  const [usageLimit, setUsageLimit] = useState(1)
  const [password, setPassword] = useState("")
  const [userrole, setRole] = useState("mZw/EdNpH/RyHRg7UjfDTg==:u0vvoHU6wxhS39+VrCExow==")
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [created_by, setCreated_by] = useState("")
  const [profileGroup, setProfileGroup] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  const { current_user } = useGlobal()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const role = current_user.role
  if (!["admin", "manager"].includes(role)) {
    return (
      <h1 className="text-center text-red-500 mt-20">
        You are not authorized to access this page
        <br />
        return to{" "}
        <Link to={"/"} className="text-blue-500">
          Home
        </Link>
      </h1>
    )
    // return <Navigate to={"/"} />;
  }
  const [loadData, setLoadData] = useState(Date.now())
  useEffect(() => {
    axios
      .get(usersUrl + "/false", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setUsers(response.data)
        setFilteredUsers(response.data)
        setDataFirstId(response.data[0]._id)
        setDataLastId(response.data[response.data.length - 1]._id)
      })
      .catch((error) => {
        toast.error(error.response.data?.message)
        console.error("Error fetching users:", error)
      })
  }, [loadData])

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
        setUsers(users.filter((u) => u._id !== id))
      } else {
        toast.error("Failed to delete the uses")
      }
    } catch (err) {
      toast.error("Delete error", err)
      console.error("Delete error:", err)
    }
  }

  const [isSubscriptionChanged, setIsSubscriptionChanged] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (email.trim() === "") {
      toast.error("Email should not be empty")
      return
    }
    if (!isUpdate && password.length < 3) {
      toast.error("Password length should be >= 4")
      return
    }
    let url = registerURL
    if (isUpdate) url = UserUpdateURL
    let data = {
      id: isUpdate,
      usageLimit,
      email,
      username,
      wasap,
      paymentMethod,
      nstbrowserEmail,
      created_by,
      // dicloakEmail,
      // subscripitonTerm,
      profileGroup,
      niche,
      affiliate,
      supervisor,
      observation,
      subStartDate,
      subValidity,
      password,
      role: userrole,
    }
    if (current_user.role == "manager" && isSubscriptionChanged && isUpdate) {
      data = { updated_data: data, created_by: current_user.email, to: email, modification: `Start: ${subStartDate}, Validity: ${subValidity}` }
      url = BACKEND_URL + "/api/users/update/park"
    }
    axios
      .post(url, data, { headers: { Authorization: "Bearer " + token } })
      .then((response) => {
        // --
        setIsUpdate(false)
        setWasap("")
        setPaymentMethod("")
        setNstbrowserEmail("")
        // setDicloakEmail("");
        // setSubscripitonTerm("");
        setCreated_by("")
        setNiche("")
        setAffiliate("")
        setSupervisor("")
        setObservation("")
        setSubValidity(30)
        setProfileGroup("")
        // --
        setUsername("")
        setEmail("")
        setUsageLimit(1)
        setPassword("")
        setLoadData(Date.now())
        if (isSubscriptionChanged) {
          toast.success("Submitted for final approval.")
        }
        setIsSubscriptionChanged(false)
      })
      .catch((error) => {
        toast.error(error.response.data?.message || error.response.data)
        console.error("Error creating user:", error)
      })
  }

  let timeoutRef = useRef(null)
  useEffect(() => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      axios
        .get(usersUrl + `/false/?q=${searchTerm}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          let data = response.data
          setUsers(data)
          setFilteredUsers(data)
          if (data.length > 0) {
            setDataFirstId(data[0].createdAt) // new start
            setDataLastId(data[data.length - 1].createdAt) // new end
          }
        })
        .catch((error) => {
          toast.error(error.response.data?.message)
          console.error("Error fetching users:", error)
        })
    }, 500)
  }, [searchTerm])

  const [isUpdate, setIsUpdate] = useState(false)

  const handleUserEdit = (user) => {
    setIsUpdate(user._id)
    setEmail(user.email)
    setWasap(user.wasap)
    setPaymentMethod(user.payment_method)
    setNstbrowserEmail(user.nstbrowser_email)
    setCreated_by(user.created_by || "")
    // setDicloakEmail(user.dicloak_email);
    // setSubscripitonTerm(user.subscription_term);
    setUsername(user.username)
    setNiche(user.niche)
    setAffiliate(user.affiliate)
    setSupervisor(user.supervisor)
    setObservation(user.observation)
    setSubValidity(user.sub_validity)
    setSubStartDate(user.sub_start_date)
    setProfileGroup(user.profile_group || "")
  }

  const handleCancelUpdate = () => {
    setIsUpdate(false)
    setWasap("")
    setPaymentMethod("")
    setNstbrowserEmail("")
    // setDicloakEmail("");
    // setSubscripitonTerm("");
    setNiche("")
    setAffiliate("")
    setSupervisor("")
    setObservation("")
    setSubValidity(30)
    setProfileGroup("")
    // --
    setUsername("")
    setEmail("")
    setUsageLimit(1)
    setPassword("")
    setIsSubscriptionChanged(false)
  }

  const [profileGroupData, setGroupData] = useState([])

  useEffect(() => {
    axios
      .get(profileGroupDataURL, { headers: { Authorization: "Bearer " + token } })
      .then((result) => {
        result = result.data
        if (!result.error) {
          setGroupData(result.group)
        } else {
          toast.error(result.message || "Unable to get profile group")
        }
      })
      .catch((e) => toast.error(e.message || "Unable to get profile group"))
  }, [])

  const handleLoadAllData = () => {
    axios
      .get(`${usersUrl}/false/?loadall=true`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data
        setUsers(data)
        setFilteredUsers(data)
      })
      .catch((error) => {
        toast.error(error.response?.data?.message)
        console.error("Error fetching users:", error)
      })
  }

  return (
    <>
      <section className="users">
        <form onSubmit={handleSubmit} className="useraction-container mb-6 bg-gray-950/40 p-4 rounded-xl">
          <div className="flex flex-col gap-2 capitalize text-sm">
            <div className="flex gap-2">
              <label className="flex flex-col justify-center  w-full">
                <span className="text-red-500">* E-mail:</span>
                <input disabled={isUpdate} type="email" required placeholder="Enter E-mail " value={email} onChange={(e) => setEmail(e.target.value.replace(" ", "_").toLowerCase())} />
              </label>

              <label className="flex flex-col justify-center  w-full">
                <span className="text-red-500">* Username:</span>
                <input type="text" required placeholder="Enter username address" value={username} onChange={(e) => setUsername(e.target.value.replace(" ", "_").toLowerCase())} />
              </label>
              <label className="flex flex-col justify-center  w-full">
                wasap:
                <input type="text" placeholder="Enter value..." value={wasap} onChange={(e) => setWasap(e.target.value)} />
              </label>
              <label className="flex flex-col justify-center  w-full">
                payment Method:
                <input type="text" placeholder="Enter value..." value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
              </label>
              <label className="flex flex-col justify-center  w-full">
                nstbrowser Email:
                <input type="text" placeholder="Enter value..." value={nstbrowserEmail} onChange={(e) => setNstbrowserEmail(e.target.value)} />
              </label>
              {/* <label className="flex flex-col justify-center  w-full">
                dicloak Email:
                <input type="text" placeholder="Enter value..." value={dicloakEmail} onChange={(e) => setDicloakEmail(e.target.value)} />
              </label>
              <label className="flex flex-col justify-center  w-full">
                subscripiton Term:
                <input type="text" placeholder="Enter value..." value={subscripitonTerm} onChange={(e) => setSubscripitonTerm(e.target.value)} />
              </label> */}
              <label className="flex flex-col justify-center  w-full">
                niche:
                <input type="text" placeholder="Enter value..." value={niche} onChange={(e) => setNiche(e.target.value)} />
              </label>
            </div>
            <div className="flex gap-2">
              <label className="flex flex-col justify-center  w-full">
                affiliate:
                <input type="text" placeholder="Enter value..." value={affiliate} onChange={(e) => setAffiliate(e.target.value)} />
              </label>
              <label className="flex flex-col justify-center  w-full">
                supervisor:
                <input type="text" placeholder="Enter value..." value={supervisor} onChange={(e) => setSupervisor(e.target.value)} />
              </label>
              <label className="flex flex-col justify-center  w-full">
                observation:
                <input type="text" placeholder="Enter value..." value={observation} onChange={(e) => setObservation(e.target.value)} />
              </label>
              <label className="flex flex-col justify-center  w-full">
                Subscription start date:
                <input
                  type="date"
                  id="sdate"
                  placeholder="Enter value..."
                  value={subStartDate}
                  onChange={(e) => {
                    setSubStartDate(e.target.value)
                    setIsSubscriptionChanged(true)
                  }}
                />
              </label>
              <label className="flex flex-col justify-center  w-full">
                Subscription Validity:
                <input
                  type="number"
                  placeholder="Enter value..."
                  value={subValidity}
                  onChange={(e) => {
                    setSubValidity(e.target.value)
                    setIsSubscriptionChanged(true)
                  }}
                />
              </label>

              {!isUpdate ? (
                <label className="flex flex-col justify-center  w-full">
                  <span className="text-red-500">* Password:</span>
                  <input required type="text" placeholder="Confirm password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
              ) : (
                ""
              )}
              {/* <label className="flex flex-col justify-center  w-full">
              Usags Limit:
              <input type="number" required placeholder="Enter user limit" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} />
            </label> */}

              <label className="flex flex-col justify-center  w-full text-yellow-300">
                Role:
                <select className="px-4 w-full py-2   rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" value={userrole} onChange={(e) => setRole(e.target.value)}>
                  {role === "admin" ? (
                    <>
                      <option value="mZw/EdNpH/RyHRg7UjfDTg==:u0vvoHU6wxhS39+VrCExow==">Acceso al software</option>
                      <option value="610Td82HCr6fZSZatk7jxA==:pImxWt+zOzBK4qxpL80JvQ==">Manager</option>
                      <option value="XGqYIGIjFr0EOCThHwB1qg==:oKjsYJoIlUD3T3Iff6ty2g==">Admin</option>
                      <option value="i64V1k5uSiNAT9mlf6uw+Q==:tSXIZwCmgdx4uGtMar/5Mg==">Member</option>
                      <option value="bOGgWCp/WIwihlVRPZ48lQ==:Gl92lkJCn+XQXjCMPHpKlQ==">Specific</option>
                      <option value="V8MQ7mhIuerDloDJoeMoww==:AP5hJdMN1xQHECS6M+Ep+w==">Todos los perfiles</option>
                    </>
                  ) : (
                    <>
                      <option value="mZw/EdNpH/RyHRg7UjfDTg==:u0vvoHU6wxhS39+VrCExow==">Acceso al software</option>
                      <option value="i64V1k5uSiNAT9mlf6uw+Q==:tSXIZwCmgdx4uGtMar/5Mg==">Member</option>
                      <option value="bOGgWCp/WIwihlVRPZ48lQ==:Gl92lkJCn+XQXjCMPHpKlQ==">Specific</option>
                      <option value="V8MQ7mhIuerDloDJoeMoww==:AP5hJdMN1xQHECS6M+Ep+w==">Todos los perfiles</option>
                    </>
                  )}
                </select>
              </label>
              <label className="flex flex-col justify-center  w-full text-yellow-300">
                Profile Group:
                <select className="p-2   rounded-md cursor-pointer" value={profileGroup} onInput={(e) => setProfileGroup(e.target.value)} name="" id="">
                  <option value="" disabled>
                    Select Group
                  </option>
                  {profileGroupData.length > 0
                    ? profileGroupData.map((group) => (
                        <option key={group._id} value={group.name}>
                          {group.name}
                        </option>
                      ))
                    : ""}
                </select>
              </label>
              {["admin"].includes(current_user.role) && isUpdate ? (
                <label className="flex flex-col justify-center  w-full text-blue-500">
                  Enlace con la gerente:
                  <input type="text" placeholder="Enter E-mail" value={created_by} onChange={(e) => setCreated_by(e.target.value)} />
                </label>
              ) : (
                ""
              )}
            </div>
          </div>
          {isUpdate ? (
            <div className="flex justify-between w-fit gap-2">
              <button
                onClick={handleCancelUpdate}
                type="submit"
                className="flex items-center gap-2 create-user mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <IoMdClose className="text-2xl" />
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 create-user mt-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <IoCheckmarkDone className="text-2xl" />
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="flex items-center gap-2 create-user mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <IoIosAdd className="text-2xl" />
            </button>
          )}
        </form>
        <hr />

        <div className="users-container mt-6 bg-gray-950/40 p-2 rounded-xl">
          <input
            type="search"
            placeholder="Search user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 sticky top-0 mb-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <button onClick={handleLoadAllData} className="p-2 px-4 hover:border hover:border-blue-500 bg-gray-950/50 rounded-xl cursor-pointer text-blue-500">
              <MdOutlineDownloading />
            </button>
          </div>
          <div className=" overflow-auto min-h-[300px]">
            <table className="w-full h-full overflow-auto mt-4 text-left border-collapse text-[11px]">
              <thead>
                <tr>
                  <th className="text-left">#</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Username</th>
                  <th className="text-left">Role</th>
                  <th className="text-left">Profile Group</th>
                  <th className="text-left">IP address</th>
                  <th className="text-left">wasap</th>
                  <th className="text-left">payment Method</th>
                  <th className="text-left">first ip</th>
                  <th className="text-left">nstbrowser Email</th>
                  {/* <th className="text-left">dicloak Email</th>
                  <th className="text-left">subscripiton Term</th> */}
                  <th className="text-left">niche</th>
                  <th className="text-left">affiliate</th>
                  <th className="text-left">supervisor</th>
                  <th className="text-left">observation</th>
                  <th className="text-left">Started At</th>
                  <th className="text-left">Validity</th>
                  <th className="text-left">Days left</th>
                  <th className="text-left">Opening date</th>
                  <th className="text-left">Edit</th>
                  <th className="text-left">Assign Tools</th>
                  <th className="text-left">Del</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, i) => {
                    let tmpDate = new Date(user.sub_start_date)
                    let formatedDate = format(tmpDate.toString(), "d/M/y", { timeZone: "America/Lima" })

                    let results = checkValidity(formatedDate, user.sub_validity)
                    let isAlmostFinished = false
                    if (results && results < 4) isAlmostFinished = true

                    let isExpired = results == false ? "Expired" : results
                    return (
                      <tr key={user._id} className="hover:bg-gray-900">
                        <td className="truncate max-w-[150px] text-center">{filteredUsers.length - i} </td>
                        <td className="truncate max-w-[150px] text-center">{user.email}</td>
                        <td className="truncate max-w-[150px] text-center">{user.username || "-"}</td>
                        <td className="truncate max-w-[150px] text-center">{user.role}</td>
                        <td className="truncate max-w-[150px] text-center">{user.profile_group}</td>
                        <td className="truncate max-w-[150px] text-center">{user.ip_address}</td>
                        <td className="truncate max-w-[150px] text-center">{user.wasap}</td>
                        <td className="truncate max-w-[150px] text-center">{user.payment_method}</td>
                        <td className="max-w-[150px] text-center overflow-auto">{user.first_ip}</td>
                        <td className="truncate max-w-[150px] text-center">{user.nstbrowser_email}</td>
                        {/* <td className="truncate max-w-[150px] text-center">{user.dicloak_email}</td>
                        <td className="truncate max-w-[150px] text-center">{user.subscription_term}</td> */}
                        <td className="truncate max-w-[150px] text-center">{user.niche}</td>
                        <td className="truncate max-w-[150px] text-center">{user.affiliate}</td>
                        <td className="truncate max-w-[150px] text-center">{user.supervisor}</td>
                        <td className="truncate max-w-[150px] text-center">{user.observation}</td>
                        <td className="truncate max-w-[150px] text-center">{formatedDate}</td>
                        <td className="truncate max-w-[150px] text-center">{user.sub_validity}</td>
                        <td className={`text-center font-bold text-md  ${isAlmostFinished ? "text-red-500 font-bold" : ""} ${results == false ? "text-red-500" : ""} `}>{isExpired}</td>
                        <td className="text-center">{new Date(user.createdAt).toLocaleString("en-US", { timeZone: "America/Lima" })}</td>

                        <td>
                          <div className="flex items-center justify-center">
                            <button
                              onClick={(e) => handleUserEdit(user)}
                              className="hover:bg-blue-300/50 text-xl text-blue-400 h-[20px] items-center w-full flex justify-center rounded-md hover:text-blue-500"
                            >
                              <CiEdit />
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center justify-center">
                            <Link to={"/dashboard/assign-product/" + user._id} className="px-2 py-1 text-blue-400 rounded hover:bg-blue-200">
                              <FaExternalLinkAlt />
                            </Link>
                          </div>
                        </td>
                        <td>
                          <div className=" flex items-center justify-center">
                            {user.role === "adminss" ? (
                              "N/A"
                            ) : (
                              <button onClick={() => openModal(user._id, user.email)} className="px-2 py-1 text-blue-400 rounded hover:bg-blue-200">
                                <RiDeleteBin6Line />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="16" className="text-center py-4 text-gray-500">
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

export default Users
