import axios from "../../axiosConfig"
import { useEffect, useRef, useState } from "react"
import { blacklistUrlPath } from "../routes/Url"
import { RiDeleteBinLine } from "react-icons/ri"
import toast from "react-hot-toast"

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

  return (
    <section>
      <h1 className="text-4xl text-blue-400">Enumere las URL bloqueadas a continuación</h1>
      <br />
      <textarea
        className="w-full min-h-[400px] bg-gray-950/40 rounded-xl p-4"
        placeholder="Blacklisted urls..."
        value={blacklistUrl || ""}
        onInput={(e) => setBlacklistUrlUrl(e.target.value)}
        onChange={handleFormSubmit}
        id=""
      ></textarea>{" "}
    </section>
  )
}

export default BlacklistUrl
