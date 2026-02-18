import { useState } from "react"
import { IoAdd } from "react-icons/io5"
import { RiDeleteBin6Line } from "react-icons/ri"
import { whitelistURL } from "../routes/Url"
import axios from "../../axiosConfig"
import toast from "react-hot-toast"
import { useEffect } from "react"
import Swal from "sweetalert2"
const WhiteList = () => {
  const [whitelistIp, setWhitelistIP] = useState("")
  const token = localStorage.getItem("token")
  let [whitelistData, setWhitelistData] = useState([])
  const [refresh, setRefresh] = useState(Date.now())
  const [searchQuery, setSearchQuery] = useState("")
  const [reservedWhitelist, setReservedWhitelist] = useState([])
  useEffect(() => {
    ;(async () => {
      let res = await axios.get(whitelistURL, { headers: { Authorization: "Bearer " + token } })
      if (res.status === 200) {
        setWhitelistData(res.data.whitelist)
        setReservedWhitelist(res.data.whitelist)
        return
      }
      toast.error("Failed to get whitelisted data")
    })()
  }, [refresh])
  const handleWhiteListSubmission = async (e) => {
    e.preventDefault()
    let res = await axios.post(whitelistURL, { ip_address: whitelistIp }, { headers: { Authorization: "Bearer " + token } })
    if (res.status === 200) {
      toast.success("Whitelisted successfully")
      setWhitelistIP("")
      setRefresh(Date.now())
      return
    }
    toast.error("Failed to add whitelist")
  }
  const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  const handleWhiteListDelete = async (id) => {
    let randomText = ["😢", "💪", "🥶", "🤬", "🤝", "😱", "😂", "🤔", "🤪", "🫣", "😈"]
    Swal.fire({
      title: randomText[randomInRange(0, randomText.length - 1)] + "- Are you sure to delete ",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let res = await axios.delete(whitelistURL, { data: { id }, headers: { Authorization: "Bearer " + token } })
        if (res.status === 200) {
          toast.success("Whitelist removed successfully")
          setRefresh(Date.now())
          return
        }
        toast.error("Failed to remove whitelist")
      }
    })
  }
  const handleSearchQuery = (query) => {
    setSearchQuery(query)
    if (query == "") {
      setWhitelistData(reservedWhitelist)
      return
    }
    setWhitelistData(reservedWhitelist.filter((d) => d.ip_address.includes(query.trim())))
  }
  return (
    <section className="flex flex-col gap-2">
      <div className="sticky top-0   ">
        <form className="flex   justify-between gap-2" onSubmit={handleWhiteListSubmission}>
          <input placeholder="Enter IP eg: 127.0.0.1" type="text" value={whitelistIp} onInput={(e) => setWhitelistIP(e.target.value)} />
          <button type="submit" className=" flex justify-center items-center gap-1 bg-blue-500 w-20 h-[40px] mt-1  rounded-md cursor-pointer hover:bg-blue-600 text-white">
            Add <IoAdd />
          </button>
        </form>
      </div>
      <hr />
      <div>
        <input type="search" placeholder="Search in whitelist..." value={searchQuery} onInput={(e) => handleSearchQuery(e.target.value)} />
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th className="!bg-green-600">IP address</th>
              <th>Listed time</th>
              <th className="!bg-red-400">Del</th>
            </tr>
          </thead>

          <tbody>
            {whitelistData.length > 0 ? (
              whitelistData.map((ip, i) => (
                <tr key={ip._id} className="text-center text-2xl">
                  <td>{whitelistData.length - i}</td>
                  <td>{ip.ip_address}</td>
                  <td>{ip.createdAt}</td>
                  <td>
                    <button className="text-red-300 hover:text-red-500 bg-red-100 hover:bg-red-200 p-2  rounded-md" onClick={(e) => handleWhiteListDelete(ip._id)}>
                      <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-400">
                  Empty
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default WhiteList
