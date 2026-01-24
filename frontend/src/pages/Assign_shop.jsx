import { IoMdAdd } from "react-icons/io"
import { FaCheck, FaMinus } from "react-icons/fa6"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { BsArrowRight } from "react-icons/bs"
import axios from "../../axiosConfig"
import { shopCreateURL, saveShopSettingsURL, productCreateURL, shopsURL, productsURL, productUpdateURL, unassignURL, assignURL, getassignedshopsURL } from "../routes/Url"
import toast from "react-hot-toast"
import { useGlobal } from "../context/GlobalStete"
import Swal from "sweetalert2"
const Assign_shop = () => {
  const [selectedShopId, setSelectedShopId] = useState(null)
  const [products, setProducts] = useState([])
  const [productName, setProductName] = useState("")
  const [shop_name, setShopName] = useState("")
  const { current_user } = useGlobal()
  const [shops, setShops] = useState([])
  const token = localStorage.getItem("token")
  const { id } = useParams()
  const [userId, setUserId] = useState(id)
  const [shopSearch, setShopSearch] = useState("")
  const [filteredShops, setFilteredShops] = useState([])
  const [detectShopChanges, setDetectShopChanges] = useState(0)
  const [isAssigned, setIsAssigned] = useState(false)
  const [isAssignedAll, setIsAssignedAll] = useState(false)
  const [assingedShops, setAssingedShops] = useState([])
  const [trackGroupSetting, setTrackGroupSetting] = useState([])
  useEffect(() => {
    setUserId(id)
  }, [id])
  const [productStates, setProductStates] = useState({})
  const handleProductChange = (id, field, value) => {
    if (value < 0) value = 1
    setProductStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  const handleProductClick = (id, field, delta) => {
    setProductStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: (prev[id]?.[field] || 0) + delta < 0 ? 0 : (prev[id]?.[field] || 0) + delta,
      },
    }))
  }

  const getShops = async () => {
    if (!["admin", "manager"].includes(current_user.role)) return
    axios
      .get(shopsURL, { headers: { Authorization: "Bearer " + token } })
      .then((res) => {
        let tmpShops = res.data.shops
        axios
          .get(`${getassignedshopsURL}/${userId}`, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            const assignedShops = res.data.shops // If assignedShops are ObjectIds, convert to strings
            let tmp = tmpShops.map((shop) => {
              const match = assignedShops.find((e) => e.shop_id === shop._id) // Convert shop._id to string if necessary
              const isAssigned = !!match
              return { ...shop, isAssigned, checked: match?.checked, expires: match?.expires || "" }
            })
            setShops(tmp)
          })
      })
      .catch((e) => {
        toast.error(e.message)
      })
  }

  useEffect(() => {
    getShops()
  }, [])

  useEffect(() => {
    setFilteredShops(shops.filter((shop) => shop.shop_name.toLowerCase().includes(shopSearch.toLowerCase())))
  }, [shopSearch, shops])
  const handleShopSearch = (value) => {
    setShopSearch(value)
  }
  const handleAssingShop = (shop, isAssigned, checked, expires) => {
    return (e) => {
      e.preventDefault()
      if (shop.isAssigned) {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, unassign it!",
        }).then((result) => {
          if (result.isConfirmed) {
            axios
              .delete(`${unassignURL}`, {
                data: { shop_id: [shop._id], user_id: userId },
                headers: { Authorization: "Bearer " + token },
              })
              .then((res) => {
                toast.success(res.data.message)
                getShops()
              })
              .catch((e) => {
                toast.error(e.response.data.message)
              })
          }
        })
      } else {
        const data = { shop_id: [shop._id], user_id: userId, checked, expires }
        axios
          .post(assignURL, data, { headers: { Authorization: "Bearer " + token } })
          .then((res) => {
            toast.success(res.data.message)
            getShops()
          })
          .catch((e) => {
            toast.error(e.response.data.message)
          })
      }
    }
  }

  useEffect(() => {
    const getAssignedId = shops
      .filter((shop) => {
        if (shop.isAssigned) return shop._id
      })
      .map((shop) => shop._id)

    setAssingedShops(getAssignedId)
    setIsAssignedAll(getAssignedId.length > 0)
  }, [shops])

  const handleAssigningAll = (shops) => {
    if (isAssignedAll) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, unassign all!",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${unassignURL}`, {
              data: { shop_id: assingedShops, user_id: userId },
              headers: { Authorization: "Bearer " + token },
            })
            .then((res) => {
              toast.success(res.data.message)
              getShops()
            })
            .catch((e) => {
              toast.error(e.response.data.message)
            })
        }
      })
    } else {
      const data = { shop_id: shops.map((shop) => shop._id), user_id: userId, isBulk: true }

      axios
        .post(assignURL, data, { headers: { Authorization: "Bearer " + token } })
        .then((res) => {
          toast.success(res.data.message)
          getShops()
        })
        .catch((e) => {
          toast.error(e.response.data.message)
        })
    }
  }

  const handleGroupCheckbox = (e, shop) => {
    setFilteredShops((prev) => {
      return prev.map((p) => (p._id === shop._id ? { ...p, checked: e.target.checked } : p))
    })
  }
  const handleGroupExpireDate = (e, shop) => {
    setFilteredShops((prev) => {
      return prev.map((p) => (p._id === shop._id ? { ...p, expires: e.target.value } : p))
    })
  }
  const getTodayISO = () => new Date().toISOString().split("T")[0]

  return (
    <>
      <section className="shop-section p-6">
        <div>
          <input type="search" value={shopSearch} onInput={(e) => handleShopSearch(e.target.value)} placeholder="Search shop" />
        </div>
        <br /> 
        <div className="flex justify-between">
          <button
            onClick={() => handleAssigningAll(shops)}
            className={` pl-2 pr-2 pt-1 pb-1 rounded-lg cursor-pointer mb-2  ${
              isAssignedAll ? "bg-red-100 text-red-500 hover:bg-red-500 hover:text-white" : "bg-green-100 text-green-500 hover:bg-green-500 hover:text-white"
            }`}
          >
            {isAssignedAll ? "Unassign all group" : "Assign all group"} <BsArrowRight className="inline" />
          </button>
        </div>
        <p className="mb-2 w-fit text-center text-yellow-300/50 px-2 rounded-md">Nota: La inercia de fecha solo funciona para asignaciones individuales.</p> 
        <div className="shop-container  mb-6">
          <ul className="max-h-300 overflow-auto shadow rounded mt-2">
            {filteredShops && filteredShops.length > 0 ? (
              filteredShops.map((shop, i) => (
                <li
                  key={shop._id}
                  className={`flex justify-between bg-gray-950/40 hover:bg-gray-900/50 mb-1  items-center px-4  border-dotted rounded-lg ${
                    selectedShopId == shop._id ? "text-green-300 hover:text-green-400" : "text-black-400 "
                  }`}
                >
                  <p className="font-semibold  ">
                    ({i + 1}) - {shop.shop_name}
                  </p>

                  <div className="flex gap-2 items-center">
                    <p className="flex justify-between items-center  gap-1">
                      <input type="checkbox" checked={shop?.checked || false} onChange={(e) => handleGroupCheckbox(e, shop)} />
                      <input value={shop.expires} type="date" disabled={shop?.checked ? false : true} onChange={(e) => handleGroupExpireDate(e, shop)} />
                    </p>
                    <div className="w-[110px] flex justify-end ">
                      <button
                        onClick={handleAssingShop(shop, shop.isAssigned, shop.checked, shop.expires)}
                        className={` pl-2 pr-2 pt-1 pb-1 rounded-lg cursor-pointer  ${
                          shop.isAssigned ? "bg-red-100 text-red-500 hover:bg-red-500 hover:text-white" : "bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white"
                        }`}
                      >
                        {shop.isAssigned ? "Unassign" : "Assign"} <BsArrowRight className="inline" />
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className="empty-result">Empty shop</div>
            )}
          </ul>
        </div>
      </section>
    </>
  )
}

export default Assign_shop
