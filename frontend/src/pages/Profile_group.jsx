import axios from "../../axiosConfig"
import { useEffect, useState } from "react"
import { browserUrl } from "../routes/Url"
import { RiDeleteBinLine } from "react-icons/ri"
import toast from "react-hot-toast"

const LogoCrud = () => {
  const token = localStorage.getItem("token")
  const [updateData, setUpdateData] = useState(Date.now())
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const [profileGroup, setProfileGroup] = useState([])
  useEffect(() => {
    ;(async () => {
      let result = await axios.get(browserUrl + "/group/get", { headers: { Authorization: "Bearer " + token } })
      setProfileGroup(result.data.group)
    })()
  }, [updateData])

  const [group, setGroup] = useState("")
  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (!group) {
      return toast.error("Group shoudn't be empty")
    }
    let result = await axios
      .post(browserUrl + "/group/add", { name: group }, { headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" } })
      .catch((e) => toast.error(e.message)) 
    if (result.status == 200) {
      toast.success("Added successfully")
      setGroup("")
      setUpdateData(Date.now())
    } else {
      toast.error("Unable to add group!")
    }
  }
  const handleGroupDelete = async (_id) => {
    let result = await axios.post(browserUrl + "/group/delete", { _id }, { headers: { Authorization: "Bearer " + token } }).catch((e) => toast.error(e.message))
    if (result.status == 200) {
      toast.success("Deleted successfully")
      setUpdateData(Date.now())
    } else {
      toast.error("Unable to delete group!")
    }
  }

  return (
    <section>
      <div className="sticky top-[-16px] z-100 bg-gray-950/40 rounded-xl">
        <form onSubmit={handleFormSubmit} className="  flex items-center pb-2 pt-2 justify-center gap-2">
          <label>
            Enter group name [Enter Key]
            <input type="text" placeholder="Enter group name" value={group} onChange={(e) => setGroup(e.target.value)} className="p-2   border-dashed border-1  rounded-md hover:bg-green-200    " />
          </label>
        </form>
      </div>
      <br />
      <div className="overflow-auto w-full ">
        <ul className="flex flex-col gap-1 overflow-auto max-h-[70vh] ">
          {profileGroup.length > 0 ? (
            profileGroup.map((group) => (
              <li key={group._id} className="flex justify-between p-1 bg-gray-950/40 rounded-md  hover:bg-gray-800">
                <div className="flex px-2">{group.name}</div>
                <button onClick={(e) => handleGroupDelete(group._id)} className="px-2 bg-red-300 text-white  rounded-md hover:bg-red-800 cursor-pointer">
                  <RiDeleteBinLine />{" "}
                </button>
              </li>
            ))
          ) : (
            <li>
              <h1 className="text-gray-300 text-center w-full p-2">--</h1>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}

export default LogoCrud
