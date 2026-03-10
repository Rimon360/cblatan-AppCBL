import { useGlobal } from "../context/globalContext"
import { NavLink, useNavigate } from "react-router-dom"
import { IoReload } from "react-icons/io5"
import { useRef, useState } from "react"
import { useEffect } from "react"
import axios from "../../axiosConfig"
import { getPasswordData } from "../routes/Url"
import { IoIosArrowDown, IoIosLogOut } from "react-icons/io"
import { getToken, removeToken, handleWebsiteLogin, decrypt } from "../funcitons"
import { toast } from "react-hot-toast"
import AdsComponent from "./adsComponent"
import { MdOpenInNew } from "react-icons/md"
import { BiSupport } from "react-icons/bi"
import { getSocket } from "../socket"
import { playNotificationSound } from "../functions"
import { MdOutlineWorkspacePremium } from "react-icons/md"
import { IoIosArrowForward } from "react-icons/io"
import { HiOutlineSpeakerphone } from "react-icons/hi"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const Dashboard = () => {
  const refreshActivityPeriodInSecond = 30
  const nav = useNavigate()
  const { state, setState } = useGlobal()
  const [kData, setPasswordData] = useState([{}])
  const user = state
  const [reservedCourses, setReservedCourses] = useState([])
  const [warning, setWarning] = useState(false)
  const [leftHours, setLeftHours] = useState("00:00:00")
  const logout = () => {
    removeToken()
    nav("/login")
    location.reload()
  }
  const [courseSearchQuery, setCourseSearchQuery] = useState(null)
  const [selectedSubtitleId, setSelectedSubtitleId] = useState(null)
  const [refreshActivity, setRefreshActivity] = useState(Date.now())

  const searchDelayRef = useRef()
  useEffect(() => {
    ;(async () => {
      if (selectedSubtitleId === null && courseSearchQuery === null) return
      clearTimeout(searchDelayRef.current)
      searchDelayRef.current = setTimeout(
        async () => {
          try {
            let token = await getToken()

            if (!user && !token) {
              removeToken()
              nav("/login")
              return
            } else if (user.verified === false || user.email_verified == false) {
              toast.error("¡Por favor, verifica tu cuenta usando nuestra aplicación!")
              removeToken()
              nav("/login")
              return
            }
            try {
              let result = await axios.get(getPasswordData + "/" + user._id + "?subtitle_id=" + selectedSubtitleId + "&searchQuery=" + courseSearchQuery, {
                headers: { Authorization: `Bearer ` + token },
              })
              result = result.data
              let decryptedData = JSON.parse(await decrypt(result.products))
              decryptedData.forEach((p) => {
                if (p.d.includes("email.appcbl.lat")) {
                  setCodeHere({ d: p.d, e: p.e, k: p.k, proxy: p.proxy, id: p.id })
                }
              })
              setPasswordData(decryptedData)
              setReservedCourses(decryptedData)
              if (courseSearchQuery) {
                handleCourseSearch(courseSearchQuery)
              }
            } catch (error) {
              toast.error(error?.message || "La sesión ha expirado. Por favor, vuelve a iniciar sesión.")
            }
          } catch (error) {
            toast.error(error?.response?.data.message || error?.response?.data || error?.message || "La sesión ha expirado. Por favor, vuelve a iniciar sesión.")
            // removeToken()
            // nav("/login")
          }
        },
        courseSearchQuery ? 500 : 0,
      )
    })()
  }, [selectedSubtitleId, courseSearchQuery])

  useEffect(() => {
    setInterval(() => {
      setRefreshActivity(Date.now())
    }, refreshActivityPeriodInSecond * 1e3)
  }, [])

  const handleCourseSearch = (query) => {
    setCourseSearchQuery(query)
    // if (!query) {
    //   setPasswordData(reservedCourses)
    //   return
    // }

    // if (reservedCourses.length === 0) return setPasswordData([])
    // const filteredProducts = reservedCourses?.filter((c) => c.c.toLowerCase().includes(query.trim().toLowerCase()) || c.g.toLowerCase().includes(query.trim().toLowerCase()))

    // setPasswordData(filteredProducts)
  }

  useEffect(() => {
    if (user?.expiration?.seconds) countdownTimer(user?.expiration?.seconds || 0)
  }, [user?.expiration?.seconds])

  const countdownTimer = (totalSeconds = 0) => {
    const interval = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(interval)
        setLeftHours("00:00:00")
        return
      }

      const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0")
      const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0")
      const secs = String(totalSeconds % 60).padStart(2, "0")

      setLeftHours(`${hrs}:${mins}:${secs}`)
      totalSeconds--
    }, 1000)
  }

  const getPeruTime = (time, timeZone = "America/Lima") => {
    time = time.replace(", ", "T")
    const t = new Date(time).toLocaleString("en-US", { timeZone })
    return `${t}  `
  }
  const unreadBroadcasting = useRef(0)
  const socketRef = useRef(null)
  useEffect(() => {
    ;(async () => {
      const socket = await getSocket()
      socketRef.current = socket
      socket.emit("joinUser", state._id)
      socket.emit("getunread", state._id)
      socket.on("getunread", (count) => {
        unreadBroadcasting.current = count
        if (count > 0) {
          window.open("/index.html#/supportchat", "_blank")
          socketRef.current.emit("removeunread")
          unreadBroadcasting.current = 0
        }
      })
      socket.on("receiveMessage", (data) => {
        if (data?.to == "all") {
          unreadBroadcasting.current += 1
          socket.emit("addunread")
          playNotificationSound()
        }
      })
    })()
  }, [state])

  const handleNotificationOpened = () => {
    unreadBroadcasting.current = 0
    socketRef.current.emit("removeunread")
  }

  const [codeHere, setCodeHere] = useState({})

  const [courses, setCourses] = useState([])
  const [isCourseOpen, setIsCourseOpen] = useState(1)
  const [selectedShopId, setSelectedShopId] = useState(null)
  useEffect(() => {
    ;(async () => {
      if (!isCourseOpen || courses.length > 0) return
      try {
        let token = await getToken()
        let result = await axios.get(BACKEND_URL + "/api/shops/extension", { headers: { Authorization: `Bearer ` + token } })
        setCourses(result.data)
      } catch (error) {
        toast.error(error?.message || "La sesión ha expirado. Por favor, vuelve a iniciar sesión.")
        // removeToken()
        // nav("/login")
      }
    })()
  }, [isCourseOpen])
  const [landingTool, setLandingTool] = useState([])
  useEffect(() => {
    ;(async () => {
      try {
        let token = await getToken()
        let result = await axios.get(BACKEND_URL + "/api/products/getmostusedtool", { headers: { Authorization: `Bearer ` + token } })
        let decryptedData = JSON.parse(await decrypt(result.data.products))
        setLandingTool(decryptedData)
      } catch (error) {
        toast.error(error?.message || "La sesión ha expirado. Por favor, vuelve a iniciar sesión.")
        // removeToken()
        // nav("/login")
      }
    })()
  }, [])

  const handleSubtitleClick = (e, id) => {
    e.stopPropagation()
    setSelectedSubtitleId(id)
    window.scrollTo({ top: 0, behavior: "smooth" })
    setCourseSearchQuery("")
  }

  const [sideAds, setSideAds] = useState({})
  useEffect(() => {
    ;(async () => {
      const token = await getToken()
      let result = await axios.get(BACKEND_URL + "/api/browser/ads/get", { params: { ads_location: "extension_bottom_left" }, headers: { Authorization: "Bearer " + token } })
      setSideAds(result.data.url)
    })()
  }, [])
  return (
    <div className="min-h-screen flex justify-center ">
      {<AdsComponent />}
      <div className="   w-[1336px] rounded-lg min-w-[400px]">
        {warning ? <p className="text-center p-2 w-full bg-yellow-300 text-black">{warning}</p> : ""}
        {user?.expiration?.hours > 72 ? (
          ""
        ) : (
          <p className="text-xl font-light font-mono text-white bg-gradient-to-r from-red-600 to-red-400 w-full text-center px-8 py-2 shadow-lg tracking-wider animate-pulse">
            ⏳ TIEMPO QUE EXPIRA TU SUCRIPCION: {leftHours}
          </p>
        )}
        {!warning ? (
          <>
            <header className="flex gap-2 items-center justify-between bg-blue-500/50 p-4 sticky top-0 z-10 backdrop-blur-md">
              <NavLink onClick={handleNotificationOpened} target="_blank" to="/supportchat" className="!text-white text-2xl !bg-transparent hover:!bg-gray-200/20 rounded-xl px-2">
                <button className="text-white text-2xl !bg-transparent relative">
                  <small className={`absolute top-[-15px] text-[11px] right-[-10px] bg-red-500/50 ${unreadBroadcasting ? "px-2" : ""} index-10 rounded-2xl`}>{unreadBroadcasting.current || ""}</small>
                  <BiSupport className="text-xl" />
                </button>
              </NavLink>
              <div className="text-white">
                <span className="font-medium">You:</span> {user?.email || "N/A"}
              </div>
              <div className="px-4 ">
                <button
                  onClick={() => handleWebsiteLogin("https://email.appcbl.lat/email", codeHere.e, codeHere.k, codeHere.proxy, codeHere.id)}
                  className="text-white !text-[18px] w-[200px] bg-gray-400/20  rounded-md py-2 hover:!bg-blue-500/50 flex justify-center items-center gap-2"
                >
                  CODIGOS AQUI <MdOpenInNew className="flex justify-center items-center" />
                </button>
              </div>
              <div className="text-gray-700">
                <button onClick={logout} className="text-center text-sm   text-white  hover:!bg-gray-200/20 rounded-md px-2 py-1  ">
                  <IoIosLogOut className="text-2xl" />
                </button>
              </div>
            </header>

            <div className="bg-gray-900/20 flex gap-2 backdrop-blur-xl min-h-fit m-1 rounded-xl ">
              <div className={`courseList sticky top-19 h-screen `}>
                <label
                  onClick={() => setIsCourseOpen(!isCourseOpen)}
                  className="p-4 w-80 block text-center cursor-pointer bg-blue-500/20 rounded-xl flex gap-2 items-center justify-center select-none"
                >
                  SELECCIONA HERRAMIENTA AQUÍ {isCourseOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
                </label>
                <div className={`${isCourseOpen ? "" : "hidden"} courseListDiv overflow-auto`}>
                  {courses.map((course) => (
                    <section
                      onClick={() => setSelectedShopId(course._id == selectedShopId ? "" : course._id)}
                      key={course._id}
                      className={`${course.isLock ? "!cursor-not-allowed  locked-item" : ""} bg-blue-500/10`}
                    >
                      <div className="flex justify-start items-center">
                        <div className="text-yellow-300">{course.isLock ? "👑" : ""}</div>
                        {course.shop_name}
                      </div>
                      <ul className={`${selectedShopId == course._id ? "" : "hidden"}`}>
                        {!course.isLock && course.subtitles.length > 0 ? (
                          course.subtitles.map((s) => (
                            <li onClick={(e) => handleSubtitleClick(e, s._id)} key={s._id}>
                              {s.subtitle}
                            </li>
                          ))
                        ) : (
                          <small>{course.isLock ? "Solo usuario premium" : "Empty"}</small>
                        )}
                      </ul>
                    </section>
                  ))}
                </div>
                {/* ads section */}
                <br />

                {sideAds && sideAds.ads_title ? (
                  <div className="border-2 p-2 rounded-xl shadow-[0_0_25px_rgba(99,102,241,0.7)] ">
                    <div className="flex mb-2 items-center relative justify-center w-full">
                      <img crossOrigin="" className="rounded-xl hover:scale-105 transition shadow-[0_0_25px_rgba(99,102,241,0.7)] " src={BACKEND_URL + `/ads/${sideAds.name}`} alt="" />
                    </div>
                    <div
                      className="inline-flex items-center gap-4 p-3 rounded-4xl
bg-gradient-to-r from-purple-600 to-blue-500 
text-white font-semibold tracking-widest uppercase
shadow-[0_0_25px_rgba(99,102,241,0.7)] 
hover:scale-105 transition  w-full justify-center"
                    >
                      <HiOutlineSpeakerphone className="text-[50px]" />
                      <div>{sideAds.ads_title}</div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div>
                <div>
                  <input
                    name="search"
                    className="w-[100%] p-2  !bg-gray-950 rounded-b-xl text-white"
                    value={courseSearchQuery || ""}
                    onInput={(e) => handleCourseSearch(e.target.value)}
                    type="search"
                    placeholder="Search here..."
                  />
                </div>
                <br />

                {kData.length > 0 ? (
                  <>
                    {[
                      ...new Map(
                        kData
                          .filter((p) => p.d)
                          .reduce((map, p) => {
                            if (!map.has(p.g)) map.set(p.g, [])
                            map.get(p.g).push(p)
                            return map
                          }, new Map()),
                      ).entries(),
                    ].map(([groupName, items]) => (
                      <div className="w-full h-fit float-left bg-blue-900/10  rounded-xl mt-4" key={groupName}>
                        <h1 className="flex flex-col text-xl  text-center font-bold text-white mb-4 mt-8 border-b border-gray-700 pb-2">
                          <span>{groupName}</span>
                          <span>{items[0]?.st ? <small className="text-lg text-gray-400"> - {items[0]?.st}</small> : ""}</span>
                        </h1>

                        {items.map((p, i) => {
                          let filepath = import.meta.env.VITE_BACKEND_URL + "/" + p.m
                          return (
                            <div
                              onClick={() => handleWebsiteLogin(p.d, p.e, p.k, p.proxy, p.id)}
                              key={i}
                              className=" relative float-left cursor-pointer  hover:!border-blue-500  border-transparent border-1 backdrop:blur-3xl   rounded-xl w-[300px] text-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow  !m-4"
                            >
                              <div className=" relative flex items-center justify-center bg-blue-500/5 backdrop-blur-md">
                                <img loading="lazy" src={filepath} className="w-fit h-[200px]" alt="image" crossOrigin="anonymous" />
                              </div>
                              <span
                                className="absolute right-2 bottom-2  px-1 text-sm text-white rounded-xl bg-gray-400/20 hover:scale-115"
                                title={`${p.active_users?.join?.("\n") || ""}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigator.clipboard.writeText(p.active_users?.join?.("\n") || "")
                                }}
                              >
                                activa: {p.active_users?.length || 0}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex items-center gap-2 flex-col">
                    <button
                      className="text-blue-300 flex items-center gap-2 py-4 "
                      onClick={() => {
                        location.reload()
                      }}
                    >
                      <IoReload /> Reload
                    </button>
                  </div>
                )}
                {landingTool.length > 0 ? (
                  landingTool.map((shop) => (
                    <div className="w-full h-fit float-left bg-blue-900/10  rounded-xl mt-4" key={shop.shop_name}>
                      {shop.subtitles.map((sub, i) => (
                        <div key={i}>
                          <h1 className="flex indent-4 items-center justify-start gap-2 text-xl  font-bold text-gray-400 mb-4 mt-8 border-b border-gray-700 pb-2">
                            <span>{shop.shop_name}</span>
                            <IoIosArrowForward />
                            <span>{sub.subtitle}</span>
                          </h1>
                          {sub.products.map((p, i) => (
                            <div
                              onClick={() => handleWebsiteLogin(p.d, p.e, p.k, p.proxy, p.id, shop.isLock)}
                              key={i}
                              className={`relative float-left cursor-pointer  hover:!border-blue-500  border-transparent border-1 backdrop:blur-3xl   rounded-xl w-[300px] text-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow  !m-4 `}
                            >
                              <div className=" relative flex items-center justify-center bg-blue-500/5 backdrop-blur-md">
                                {shop.isLock ? (
                                  <div className={` flex justify-center items-center text-yellow-300 text-xl h-full w-full bg-gray-900/10 absolute  backdrop-blur-sm `}>
                                    <MdOutlineWorkspacePremium /> Premium
                                  </div>
                                ) : (
                                  ""
                                )}

                                <img loading="lazy" src={BACKEND_URL + "/" + p.m} className="w-fit h-[200px]" alt="image" crossOrigin="anonymous" />
                              </div>
                              <span
                                className="absolute right-2 bottom-2  px-1 text-sm text-white rounded-xl bg-gray-400/20 hover:scale-115"
                                title={`${p.active_users?.join?.("\n") || ""}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigator.clipboard.writeText(p.active_users?.join?.("\n") || "")
                                }}
                              >
                                activa: {p.active_users?.length || 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 flex-col">
                    <button
                      className="text-blue-300 flex items-center gap-2 py-4 "
                      onClick={() => {
                        location.reload()
                      }}
                    >
                      <IoReload /> Reload
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-gray-700">
            <button onClick={logout} className="text-center text-sm text-red-300 px-2 rounded-md hover:bg-gray-400 hover:cursor-pointer  ">
              <IoIosLogOut className="text-2xl" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
