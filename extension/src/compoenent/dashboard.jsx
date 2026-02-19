import { useGlobal } from "../context/globalContext"
import { NavLink, useNavigate } from "react-router-dom"
import { IoReload } from "react-icons/io5"
import { useState } from "react"
import { useEffect } from "react"
import axios from "../../axiosConfig"
import { getPasswordData } from "../routes/Url"
import { IoIosLogOut } from "react-icons/io"
import { getToken, removeToken, handleWebsiteLogin, decrypt } from "../funcitons"
import { toast } from "react-hot-toast"
import AdsComponent from "./adsComponent"
import { MdOpenInNew } from "react-icons/md"
import { BiSupport } from "react-icons/bi"

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
  }
  const [courseSearchQuery, setCourseSearchQuery] = useState(null)
  const [refreshActivity, setRefreshActivity] = useState(Date.now())
  useEffect(() => {
    ;(async () => {
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
          let res = await fetch(getPasswordData + "/" + user._id, { method: "GET", headers: { Authorization: `Bearer ` + token } }).catch((err) => toast.error(err.message))
          if (res.status === 200) {
            res = await res.json()
            let decryptedData = JSON.parse(await decrypt(res.products))
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
          } else if (res?.data?.error) {
            toast.error(res?.data?.message)
          }
        } catch (error) {
          toast.error(error?.response?.data.message || error?.response?.data || error?.message || "La sesión ha expirado. Por favor, vuelve a iniciar sesión.")
        }
      } catch (error) {
        toast.error(error?.response?.data.message || error?.response?.data || error?.message || "La sesión ha expirado. Por favor, vuelve a iniciar sesión.")
        // removeToken()
        // nav("/login")
      }
    })()
  }, [refreshActivity])

  useEffect(() => {
    setInterval(() => {
      setRefreshActivity(Date.now())
    }, refreshActivityPeriodInSecond * 1e3)
  }, [])

  const handleCourseSearch = (query) => {
    setCourseSearchQuery(query)
    if (!query) {
      setPasswordData(reservedCourses)
      return
    }

    if (reservedCourses.length === 0) return setPasswordData([])
    const filteredProducts = reservedCourses?.filter((c) => c.c.toLowerCase().includes(query.trim().toLowerCase()) || c.g.toLowerCase().includes(query.trim().toLowerCase()))

    setPasswordData(filteredProducts)
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

  const [codeHere, setCodeHere] = useState({})
  return (
    <div className="min-h-screen flex justify-center   bg-radial from-gray-900 to-gray-950 to-90%">
      {<AdsComponent />}
      <div className=" bg-gray-800 max-w-[1336px] rounded-lg min-w-[400px]">
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
            <header className="flex items-center justify-between bg-blue-500/50 p-4 sticky top-0 z-10 backdrop-blur-md">
              <NavLink target="_blank" to="/supportchat" className="!text-white text-2xl !bg-transparent hover:!bg-gray-200/20 rounded-xl px-2">
                <button className="text-white text-2xl !bg-transparent">
                  <BiSupport className="text-xl" />
                </button>
              </NavLink>
              <div className="text-white">
                <span className="font-medium">You:</span> {user?.email || "N/A"}
              </div>
              <div className="text-gray-700">
                <button onClick={logout} className="text-center text-sm   text-white  hover:!bg-gray-200/20 rounded-md px-2 py-1  ">
                  <IoIosLogOut className="text-2xl" />
                </button>
              </div>
            </header>

            <div className="bg-gray-900 min-h-fit m-1 rounded-lg ">
              <div className="p-4 flex justify-between gap-4  items-center">
                <h2 className="text-2xl flex items-center font-bold text-gray-300 mb-4">Welcome, {user?.email || "User"}!</h2>
                <button
                  onClick={() => handleWebsiteLogin("https://email.appcbl.lat/email", codeHere.e, codeHere.k, codeHere.proxy, codeHere.id)}
                  className="text-white !text-[18px] w-[200px] bg-gray-400/20  rounded-md py-2 hover:!bg-blue-500/50 flex justify-center items-center gap-2"
                >
                  CODIGOS AQUI <MdOpenInNew className="flex justify-center items-center" />
                </button>
              </div>
              <hr />
              <div>
                <input
                  name="search"
                  className="w-[100%] p-2  !bg-gray-950 rounded-b-xl text-white"
                  value={courseSearchQuery || ""}
                  onInput={(e) => handleCourseSearch(e.target.value)}
                  type="search"
                  placeholder="Search course by name..."
                />
              </div>
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
                    <div className="w-full h-fit float-left bg-gray-900  rounded-xl mt-4" key={groupName}>
                      <h1 className="flex flex-col text-3xl text-center font-bold text-white mb-4 mt-8 border-b border-gray-700 pb-2">
                        <span>{groupName}</span>
                        <span>{items[0]?.st ? <small className="text-lg text-gray-400"> - {items[0]?.st}</small> : ""}</span>
                      </h1>

                      {items.map((p, i) => {
                        let filepath = import.meta.env.VITE_BACKEND_URL + "/" + p.m
                        return (
                          <div
                            onClick={() => handleWebsiteLogin(p.d, p.e, p.k, p.proxy, p.id)}
                            key={i}
                            className=" relative float-left cursor-pointer bg-gray-950/50 hover:border-blue-500 border-solid border-2 backdrop:blur-3xl hover:bg-black rounded-xl w-[300px] text-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 !m-4"
                          >
                            <div className="border-gray-600 border-b-1 flex items-center justify-center bg-black">
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
                  <h1 className="text-gray-400 text-center text-sm">Empty!</h1>
                  <button
                    className="text-blue-300 flex items-center gap-2 mb-3 "
                    onClick={() => {
                      location.reload()
                    }}
                  >
                    <IoReload /> Reload
                  </button>
                </div>
              )}
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
