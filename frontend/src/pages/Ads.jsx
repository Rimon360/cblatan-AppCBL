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
    fd.append("ads_title", ads_title)
    fd.append("ads_location", ads_location)
    fd.append("ads_url", ads_url)
    let result = await axios
      .post(browserUrl + "/ads/upload", fd, { headers: { Authorization: "Bearer " + token, "Content-Type": "application/multipart-form-data" } })
      .catch((e) => toast.error(e.message))
    if (result.status == 200) {
      toast.success("Uploaded successfully")
      setFile(null)
      setAdsTitle("")
      setAdsURL("")
      setAdsLocation("")
      setUpdateData(Date.now())
    } else {
      toast.error("Unable to upload logo!")
    }
  }
  const handleLogoDelete = async (url) => {
    if (!confirm("Are you sure?")) return
    let result = await axios.post(browserUrl + "/ads/delete", { name: url }, { headers: { Authorization: "Bearer " + token } }).catch((e) => toast.error(e.message))
    if (result.status == 200) {
      toast.success("Deleted successfully")
      setUpdateData(Date.now())
    } else {
      toast.error("Unable to delete logo!")
    }
  }
  const [ads_title, setAdsTitle] = useState("")
  const [ads_url, setAdsURL] = useState("")
  const [ads_location, setAdsLocation] = useState("")
  return (
    <section>
      <div className="sticky top-[-16px] z-100 bg-gray-950">
        <form onSubmit={handleFormSubmit} className="border-b-2 border-gray-500 border-dashed flex items-center pb-2 pt-2 justify-center gap-2">
          <label className="p-2   text-gray-400 border-dashed border-1 border-gray-400  rounded-md hover:bg-green-50/5 hover:text-gray-400 cursor-pointer">
            + Choose ads image
            <input type="file" accept=".png, .jpg, .jpeg, .bmp, .webp" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
          </label>
          <label htmlFor="">
            <input className="p-2 rounded-xl !bg-gray-500/20" value={ads_title} onInput={(e) => setAdsTitle(e.target.value)} type="text" placeholder="Ads title (optional)..." />
          </label>
          <label htmlFor="">
            <input className="p-2 rounded-xl !bg-gray-500/20" value={ads_url} onInput={(e) => setAdsURL(e.target.value)} type="text" placeholder="Ads URL (optional)..." />
          </label>
          <label htmlFor="">
            <select className="p-2 rounded-xl bg-gray-500/20 text-white" value={ads_location} onChange={(e) => setAdsLocation(e.target.value)} name="" id="">
              <option disabled value="">
                Select ads location
              </option>
              <option value="extension_bottom_left">Extension bottom left</option>
              <option value="none">None</option>
            </select>
          </label>
          <button className="p-2 bg-green-400 text-white  rounded-md hover:bg-green-500 cursor-pointer">Submit</button>
        </form>
      </div>
      <br />
      <div className="flex justify-center w-full">
        <div className="">
          {ads.length > 0 ? (
            ads.map((add) => (
              <div key={add.name} className="flex flex-col gap-1 justify-between  bg-blue-500/10 hover:bg-blue-500/20 rounded-xl float-left m-1 max-w-[300px] h-[300px]">
                <div>
                  <div className="w-auto  border-1 border-green-200 border-dashed rounded-xl max-w-[450px] max-h-fit  relative overflow-hidden">
                    <a href={add.ads_url ? add.ads_url : BACKEND_URL + "/ads/" + add.name} target="_blank" rel="noopener noreferrer">
                      <img crossOrigin="" className="max-w-[300px] max-h-[300px]" src={BACKEND_URL + "/ads/" + add.name} alt="Logo" />
                    </a>
                  </div>
                  <div className="bg-gray-950/20 capitalize text-sm mt-1   px-2 py-2">
                    {add.ads_title ? (
                      <div className="truncate">
                        <span className="text-gray-400">Title:</span> {add.ads_title}
                      </div>
                    ) : (
                      ""
                    )}
                    {add.ads_location ? (
                      <div className="truncate">
                        <span className="text-gray-400">Location:</span> {add.ads_location}
                      </div>
                    ) : (
                      ""
                    )}
                    {add.ads_url ? (
                      <div className="truncate">
                        <span className="text-gray-400 truncate">URL:</span> {add.ads_url}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="flex justify-center ">
                  <button onClick={(e) => handleLogoDelete(add.name)} className="p-1 bg-red-400 w-full flex justify-center text-white  rounded-md hover:bg-red-500 cursor-pointer">
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
