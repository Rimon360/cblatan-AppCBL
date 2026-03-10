import axios from "../../axiosConfig"
import { useEffect, useRef, useState } from "react"
import { blacklistUrlPath } from "../routes/Url"
import { IoCheckmarkDone } from "react-icons/io5"
import { IoIosAdd, IoMdClose } from "react-icons/io"
import toast from "react-hot-toast"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const BlacklistUrl = () => {
  const token = localStorage.getItem("token")
  const [blacklistUrl, setBlacklistUrlUrl] = useState("")

  useEffect(() => {
    ;(async () => {
      let result = await axios.get(blacklistUrlPath + "/get")

      if (result.data) setBlacklistUrlUrl(result.data.blacklistUrl)
    })()
  }, [])

  let timeout = useRef()
  const handleFormSubmit = async (e) => {
    clearTimeout(timeout.current)
    timeout.current = setTimeout(async () => {
      toast.success("Updating...")
      let result = await axios.post(blacklistUrlPath + "/add", { blacklistUrl: btoa(e.target.value) }, { headers: { Authorization: "Bearer " + token } }).catch((e) => toast.error(e.message))
      if (result.status == 200) {
        toast.success("updated successfully")
      } else {
        toast.error("Unable to update!")
      }
    }, 700)
  }
  const [isBlockedForAll, setIsBlockedForAll] = useState(false)
  const [username_or_email, setUsernameOrEmail] = useState(null)
  const [tool_url, setToolUrl] = useState(null)

  const [toolData, setToolData] = useState([])
  const [update, setUpdate] = useState(null)
  useEffect(() => {
    ;(async () => {
      try {
        let result = await axios.get(BACKEND_URL + "/api/products/blocked-tool/get", { headers: { Authorization: "Bearer " + token } })
        setToolData(result.data)
      } catch (error) {
        toast.error(error.response.data.message)
      }
    })()
  }, [update])

  const handleBlockToolSubmit = async (e) => {
    e.preventDefault()

    try {
      let result = await axios.post(BACKEND_URL + "/api/products/blocked-tool/add", { isBlockedForAll, username_or_email, tool_url }, { headers: { Authorization: "Bearer " + token } })
      toast.success(result.data.message)
      setUpdate(Date.now())
      setIsBlockedForAll(false)
      setUsernameOrEmail(null)
      setToolUrl(null)
    } catch (error) {
      toast.error(error.response.data.message || error.message)
    }
  }
  const handleRemoveBlock = async (_id) => {
    try {
      if (!confirm("Are you sure?")) return
      let result = await axios.post(BACKEND_URL + "/api/products/blocked-tool/remove", { _id }, { headers: { Authorization: "Bearer " + token } })
      toast.success(result.data.message)
      setUpdate(Date.now())
    } catch (error) {
      toast.error(error.response.data.message || error.message)
    }
  }

  useEffect(() => {
    setUsernameOrEmail(null)
  }, [isBlockedForAll])

  return (
    <section className="px-4">
      <div>
        <h1 className="text-2xl text-blue-400 p-2 bg-gray-950 m-1">Enumere las URL bloqueadas a continuación</h1>
        <textarea
          className="w-full  min-h-[100px] bg-gray-950/40 rounded-xl p-4"
          placeholder="Blacklisted urls..."
          value={blacklistUrl || ""}
          onInput={(e) => setBlacklistUrlUrl(e.target.value)}
          onChange={handleFormSubmit}
          id=""
        ></textarea>{" "}
      </div>
      <div>
        <h1 className="text-2xl text-blue-400 p-2 bg-gray-950 m-1">Block/unblcok tools</h1>
        <div>
          {/* block course action */}
          <div>
            <form className="flex gap-2 p-4 rounded-xl bg-gray-950/50 justify-center items-center" onSubmit={handleBlockToolSubmit}>
              <label className="bg-green-950 p-2 rounded-xl flex flex-col justify-center items-center">
                <div>¿Bloqueo para todos?</div>
                <input checked={isBlockedForAll} onChange={(e) => setIsBlockedForAll(e.target.checked)} type="checkbox" placeholder="Enter value.." />
              </label>
              <label htmlFor="">
                Nombre de usuario/correo electrónico
                <input disabled={isBlockedForAll} type="text" value={username_or_email || ""} onInput={(e) => setUsernameOrEmail(e.target.value)} placeholder="Enter value.." />
              </label>
              <label htmlFor="">
                Dominio
                <input type="text" value={tool_url || ""} onInput={(e) => setToolUrl(e.target.value)} placeholder="Enter value.." />
              </label>
              <button
                type="submit"
                className="flex items-center gap-2 create-user mt-6  py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Block
                <IoCheckmarkDone className="text-2xl" />
              </button>
            </form>
          </div>
          {/* table wrapper div */}
          <div className="text-center">
            <table border={1}>
              <thead>
                <tr>
                  <th>User/Email</th>
                  <th>Blocked For All?</th>
                  <th>Domain</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {toolData.length > 0 ? (
                  toolData.map((d) => (
                    <tr key={d._id}>
                      <td>{d.username_or_email || "-"}</td>
                      <td>{d.isBlockedForAll ? "Yes" : "No"}</td>
                      <td>
                        <div className="truncate max-w-60">{d.tool_url}</div>
                      </td>
                      <td>{d.createdAt}</td>
                      <td>
                        <button
                          onClick={() => handleRemoveBlock(d._id)}
                          type="submit"
                          className="flex items-center gap-2 create-user mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <IoMdClose className="text-2xl" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>Empty</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlacklistUrl
