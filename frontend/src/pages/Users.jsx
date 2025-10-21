import { useEffect, useState } from "react"
import { RiDeleteBin6Line } from "react-icons/ri"
import { TiUserAdd } from "react-icons/ti"
import axios from "../../axiosConfig"
import { Navigate, Link } from "react-router-dom"
import { registerURL, usersUrl, UserUpdateURL, profileGroupDataURL } from "../routes/Url"
import { checkValidity } from "../functions"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import { FaExternalLinkAlt } from "react-icons/fa"
import { useGlobal } from "../context/GlobalStete"
import { format } from "date-fns"
import { CiEdit } from "react-icons/ci"
import { RxCross2, RxUpdate } from "react-icons/rx"

const Users = () => {
  const [email, setEmail] = useState("")

  // new entries started
  const [wasap, setWasap] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [nstbrowserEmail, setNstbrowserEmail] = useState("")
  // const [dicloakEmail, setDicloakEmail] = useState("");
  // const [subscripitonTerm, setSubscripitonTerm] = useState("");
  const [niche, setNiche] = useState("")
  const [affiliate, setAffiliate] = useState("")
  const [supervisor, setSupervisor] = useState("")
  const [observation, setObservation] = useState("")
  const date = new Date()
  const [subStartDate, setSubStartDate] = useState(date.toISOString().split("T")[0])
  const [subValidity, setSubValidity] = useState(31)

  // new entries based on user requirements end

  const [usageLimit, setUsageLimit] = useState(1)
  const [password, setPassword] = useState("")
  const [userrole, setRole] = useState("appcbl_soft")
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [profileGroup, setProfileGroup] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  const { current_user } = useGlobal()
  const token = localStorage.getItem("token")
  const role = current_user.role
  if (role !== "admin") {
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
        setFilteredUsers(users.filter((user) => user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || user?.ip_address?.toLowerCase().includes(searchTerm.toLowerCase())))
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
    axios
      .post(url, {
        id: isUpdate,
        usageLimit,
        email,
        wasap,
        paymentMethod,
        nstbrowserEmail,
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
      })
      .then((response) => {
        // --
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
        setEmail("")
        setUsageLimit(1)
        setPassword("")
        setLoadData(Date.now())
      })
      .catch((error) => {
        toast.error(error.response.data?.message)
        console.error("Error creating user:", error)
      })
  }

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user?.email?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          user?.seq?.toString().includes(searchTerm.toLowerCase().trim()) ||
          user?.ip_address?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          user?.ip_address_history?.toLowerCase().includes(searchTerm.toLowerCase().trim())
      )
    )
  }, [users, searchTerm])

  const [isUpdate, setIsUpdate] = useState(false)

  const handleUserEdit = (user) => {
    setIsUpdate(user._id)
    setEmail(user.email)
    setWasap(user.wasap)
    setPaymentMethod(user.payment_method)
    setNstbrowserEmail(user.nstbrowser_email)
    // setDicloakEmail(user.dicloak_email);
    // setSubscripitonTerm(user.subscription_term);
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
    setEmail("")
    setUsageLimit(1)
    setPassword("")
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

  return (
    <>
      <section className="users p-6">
        <form onSubmit={handleSubmit} className="useraction-container mb-6 bg-white p-2 rounded-xl">
          <div className="flex flex-col gap-2 capitalize text-sm">
            <div className="flex gap-2">
              <label className="flex flex-col justify-center  w-full">
                e-mail/username:
                <input type="text" required placeholder="Enter user/email address" value={email} onChange={(e) => setEmail(e.target.value.replace(" ", "_").toLowerCase())} />
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
                <input type="date" id="sdate" placeholder="Enter value..." value={subStartDate} onChange={(e) => setSubStartDate(e.target.value)} />
              </label>
              <label className="flex flex-col justify-center  w-full">
                Subscription Validity:
                <input type="number" placeholder="Enter value..." value={subValidity} onChange={(e) => setSubValidity(e.target.value)} />
              </label>

              {!isUpdate ? (
                <label className="flex flex-col justify-center  w-full">
                  Password:
                  <input required type="text" placeholder="Confirm password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
              ) : (
                ""
              )}
              {/* <label className="flex flex-col justify-center  w-full">
              Usags Limit:
              <input type="number" required placeholder="Enter user limit" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} />
            </label> */}

              <label className="flex flex-col justify-center  w-full">
                Role:
                <select
                  className="px-4 w-full py-2 bg-gray-300 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={userrole}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="mZw/EdNpH/RyHRg7UjfDTg==:u0vvoHU6wxhS39+VrCExow==">Acceso al software</option>
                  <option value="XGqYIGIjFr0EOCThHwB1qg==:oKjsYJoIlUD3T3Iff6ty2g==">Admin</option>
                  <option value="i64V1k5uSiNAT9mlf6uw+Q==:tSXIZwCmgdx4uGtMar/5Mg==">Member</option>
                  <option value="bOGgWCp/WIwihlVRPZ48lQ==:Gl92lkJCn+XQXjCMPHpKlQ==">Specific</option>
                  <option value="V8MQ7mhIuerDloDJoeMoww==:AP5hJdMN1xQHECS6M+Ep+w==">Todos los perfiles</option>
                </select>
              </label>
              <label className="flex flex-col justify-center  w-full">
                Profile Group:
                <select className="p-2 !bg-blue-300 rounded-md cursor-pointer" value={profileGroup} onInput={(e) => setProfileGroup(e.target.value)} name="" id="">
                  <option value="" disabled>
                    Select Group
                  </option>
                  {profileGroupData.length > 0 ? profileGroupData.map((group) => <option value={group.name}>{group.name}</option>) : ""}
                </select>
              </label>
            </div>
          </div>
          {isUpdate ? (
            <div className="flex justify-between w-fit gap-2">
              <button
                onClick={handleCancelUpdate}
                type="submit"
                className="flex items-center gap-2 create-user mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Cancel
                <RxCross2 />
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 create-user mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update
                <RxUpdate />
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="flex items-center gap-2 create-user mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create user
              <TiUserAdd />
            </button>
          )}
        </form>
        <hr />

        <div className="users-container mt-6 bg-white p-2 rounded-xl">
          <input
            type="search"
            placeholder="Search user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 sticky top-0 mb-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="  overflow-auto">
            <table className="w-full h-full overflow-auto mt-4 text-left border-collapse  capitalize text-[11px]">
              <thead>
                <tr className="bg-gray-200">
                  <th className="text-left">#</th>
                  <th className="text-left">Email</th>
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
                  <th className="text-left">Assign Password</th>
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
                      <tr key={user._id} className="hover:bg-gray-100">
                        <td className="truncate max-w-[150px] text-center">{filteredUsers.length - i} </td>
                        <td className="truncate max-w-[150px] text-center">{user.email}</td>
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

export default Users
