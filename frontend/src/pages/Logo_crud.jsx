import axios from "../../axiosConfig"
import { useEffect, useState } from "react"
import { browserUrl } from "../routes/Url"
import { RiDeleteBinLine } from "react-icons/ri"
import toast from "react-hot-toast"

const LogoCrud = () => {
  const token = localStorage.getItem("token")
  const [updateData, setUpdateData] = useState(Date.now())
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const [logos, setLogos] = useState([])
  useEffect(() => {
    ;(async () => {
      let result = await axios.get(browserUrl + "/get_logo", { headers: { Authorization: "Bearer " + token } })
      setLogos(result.data.urls)
    })()
  }, [updateData])

  const [file, setFile] = useState()
  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      return toast.error("File shouldn't be empty")
    }
    let fd = new FormData()

    fd.append("file", file)
    try {
      let result = await axios.post(browserUrl + "/upload_logo", fd, { headers: { Authorization: "Bearer " + token, "Content-Type": "application/multipart-form-data" } })

      if (result.status == 200) {
        toast.success("Uploaded successfully")
        setFile(null)
        setUpdateData(Date.now())
      }
    } catch (error) { 
      toast.error("Unable to upload logo!")
    }
  }
  const handleLogoDelete = async (url) => {
    let result = await axios.post(browserUrl + "/delete_logo", { name: url }, { headers: { Authorization: "Bearer " + token } }).catch((e) => toast.error(e.message))
    if (result.status == 200) {
      toast.success("Deleted successfully")
      setUpdateData(Date.now())
    } else {
      toast.error("Unable to delete logo!")
    }
  }

  return (
    <section>
      <div className="sticky top-[-16px] z-100  ">
        <form onSubmit={handleFormSubmit} className="border-b-2 border-gray-500 border-dashed flex items-center pb-2 pt-2 justify-center gap-2">
          <label className="p-2   text-gray-400 border-dashed border-1 border-gray-400  rounded-md hover:bg-green-50/5 hover:text-gray-400 cursor-pointer">
            Choose logo
            <input type="file" accept=".png, .jpg, .jpeg, .bmp, .webp" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
          </label>
          <button className="p-2 bg-green-400 text-white  rounded-md hover:bg-green-500 cursor-pointer">Upload</button>
        </form>
      </div>
      <br />
      <div className="overflow-auto w-full ">
        {logos.length > 0 ? (
          logos.map((url) => (
            <div key={url} className="flex flex-col pb-2 gap-1 justify-between  bg-gray-950/40 hover:bg-gray-800 rounded-xl float-left m-2 max-w-[150px] h-[150px]">
              <div className="flex  border-1 border-green-200 border-dashed rounded-xl max-w-[300px] max-h-[200px] items-center justify-center relative overflow-hidden">
                <img crossOrigin="" className="max-w-[150px]  max-h-[300px]" src={BACKEND_URL + "/logos/" + url} alt="Logo" />
              </div>
              <div className="flex justify-center ">
                <button onClick={(e) => handleLogoDelete(url)} className="p-1 bg-red-400 text-white  rounded-md hover:bg-red-500 cursor-pointer">
                  <RiDeleteBinLine />{" "}
                </button>
              </div>
            </div>
          ))
        ) : (
          <h1 className="text-gray-300 text-center w-full p-2">Empty</h1>
        )}
      </div>
    </section>
  )
}

export default LogoCrud
