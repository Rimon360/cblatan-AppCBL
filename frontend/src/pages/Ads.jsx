import axios from "../../axiosConfig"
import { useEffect, useState } from "react"
import { browserUrl } from "../routes/Url"
import { RiDeleteBinLine } from "react-icons/ri"
import toast from "react-hot-toast"

const LogoCrud = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const token = localStorage.getItem("token")
  const [updateData, setUpdateData] = useState(Date.now())
  const [ads, setAdsUrl] = useState([])
  useEffect(() => {
    ;(async () => {
      let result = await axios.get(browserUrl + "/ads/get", { headers: { Authorization: "Bearer " + token } })
      setAdsUrl(result.data.ads)
    })()
  }, [updateData])

  const [file, setFile] = useState()
  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      return toast.error("File shoudn't be empty")
    }
    let fd = new FormData()

    fd.append("file", file)
    let result = await axios
      .post(browserUrl + "/ads/upload", fd, { headers: { Authorization: "Bearer " + token, "Content-Type": "application/multipart-form-data" } })
      .catch((e) => toast.error(e.message)) 
    if (result.status == 200) {
      toast.success("Uploaded successfully")
      setFile(null)
      setUpdateData(Date.now())
    } else {
      toast.error("Unable to upload logo!")
    }
  }
  const handleLogoDelete = async (url) => {
    let result = await axios.post(browserUrl + "/ads/delete", { name: url }, { headers: { Authorization: "Bearer " + token } }).catch((e) => toast.error(e.message))
    if (result.status == 200) {
      toast.success("Deleted successfully")
      setUpdateData(Date.now())
    } else {
      toast.error("Unable to delete logo!")
    }
  }

  return (
    <section>
      <div className="sticky top-[-16px] z-100 ">
        <form onSubmit={handleFormSubmit} className="border-b-2 border-gray-500 border-dashed flex items-center pb-2 pt-2 justify-center gap-2">
          <label className="p-2   text-gray-400 border-dashed border-1 border-gray-400  rounded-md hover:bg-green-50/5 hover:text-gray-400 cursor-pointer">
            Choose logo
            <input type="file" accept=".png, .jpg, .jpeg, .bmp, .webp" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
          </label>
          <button className="p-2 bg-green-400 text-white  rounded-md hover:bg-green-500 cursor-pointer">Upload</button>
        </form>
      </div>
      <br />
      <div className="flex justify-center w-full">
        <div className="overflow-auto w-fit">
          {ads.length > 0 ? (
            ads.map((url) => (
              <div key={url} className="flex flex-col gap-1 justify-between  bg-gray-200 hover:bg-gray-600 rounded-xl float-left m-1 max-w-[450px] h-[300px]">
                <div className="w-auto  border-1 border-green-200 border-dashed rounded-xl max-w-[450px] max-h-fit  relative overflow-hidden">
                  <a href={BACKEND_URL + "/ads/" + url} target="_blank" rel="noopener noreferrer">
                  <img crossOrigin="" className="max-w-[200px] max-h-[450px]" src={BACKEND_URL + "/ads/" + url} alt="Logo" /></a>
                </div>
                <div className="flex justify-center ">
                  <button onClick={(e) => handleLogoDelete(url)} className="p-1 bg-red-400 w-full flex justify-center text-white  rounded-md hover:bg-red-500 cursor-pointer">
                    <RiDeleteBinLine />{" "}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-gray-300 text-center w-full p-2">Empty</h1>
          )}
        </div>
      </div>
    </section>
  )
}

export default LogoCrud
