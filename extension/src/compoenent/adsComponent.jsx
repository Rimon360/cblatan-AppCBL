import { IoMdClose } from "react-icons/io"
import { useEffect, useState } from "react"
import axios from "../../axiosConfig"
import { useGlobal } from "../context/globalContext"
import { getToken } from "../funcitons"
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const AdsComponent = () => {
  const [adsVisibility, setAdsVisibility] = useState(true) 
  const [adsUrl, setAdsUrl] = useState("")
  const { state } = useGlobal()
  useEffect(() => {
    ;(async () => {
      const token = await getToken()
      if (state && state.email_verified == false) return
      let result = await axios.get(API_URL + "/vHU6wxhS396wxhS39wxhS39/api/browser/ads/get", { headers: { Authorization: "Bearer " + token } })
      setAdsUrl(result.data.url)
    })()
  }, [])
  return (
    <>
      {adsUrl && adsVisibility ? (
        <div
          onClick={(e) => {
            setAdsVisibility(false)
          }}
          className="w-[100vw] h-[100vh] bg-gray-700/30   backdrop-blur-sm fixed z-100000"
        >
          <div className="w-full flex justify-between ">
            <span></span>
            <button
              onClick={(e) => {
                setAdsVisibility(false)
              }}
              className="!bg-transparent hover:text-red-400 !border-none"
            >
              <IoMdClose className="text-3xl" />
            </button>
          </div>
          <div className="w-full h-full flex justify-center items-center ">
            <img onClick={(e) => e.stopPropagation()} crossOrigin="" className="max-h-[60vh] rounded-xl  shadow-yellow-400 shadow-2xl" src={API_URL + "/ads/" + adsUrl} alt="Ads" />
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}

export default AdsComponent
