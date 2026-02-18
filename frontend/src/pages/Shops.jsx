import { IoMdAdd, IoMdClose, IoMdDoneAll } from "react-icons/io"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../axiosConfig"
import { shopCreateURL, productCreateURL, shopsURL, productsURL, productUpdateURL, memberShopsURL, productDeleteURL, shopDeleteURL } from "../routes/Url"
import toast from "react-hot-toast"
import { useGlobal } from "../context/GlobalStete"
import Swal from "sweetalert2"
import { isValidURL } from "../functions"
import { getDomain } from "../functions"
import { CiEdit } from "react-icons/ci"
import { FaUpload } from "react-icons/fa"
import { decrypt } from "../functions"
import { MdOutlineCancel } from "react-icons/md"
const Shops = () => {
  const [selectedTitleId, setSelectedTitleId] = useState(null)
  const [selectedSubtitleId, setSelectedSubtitleId] = useState(null)
  const [shop_name, setShopName] = useState([])
  const [products, setProducts] = useState([])
  const [productName, setProductName] = useState("")
  const [email, setEmail] = useState([])
  const [domain, setDomain] = useState("")
  const [proxy, setProxy] = useState("")
  const [courseName, setCourseName] = useState("")
  const [password, setPassword] = useState("")
  const { current_user } = useGlobal()
  const [shops, setShops] = useState([])
  const shop_id = localStorage.getItem("selectedTitleId")
  const nav = useNavigate()
  const [file, setFile] = useState(null)
  const [courseSearchQuery, setCourseSearchQuery] = useState("")
  const [reservedProducts, setReservedProducts] = useState([])

  useEffect(() => {
    if (shop_id != null) {
      setSelectedTitleId(shop_id)
    }
  }, [shop_id])

  const token = localStorage.getItem("token")
  const role = current_user.role
  const isAdmin = role == "admin"
  const [isUpdated, setIsUpdated] = useState(false)
  const [isShopUpdated, setIsShopUpdated] = useState(false)
  useEffect(() => {
    let url = shopsURL
    if (!isAdmin) return
    if (current_user.role != "admin" && current_user.role != "member") return
    if (current_user.role == "member") {
      url = memberShopsURL + `/${current_user._id}`
    }
    axios
      .get(url, { headers: { Authorization: "Bearer " + token } })
      .then((res) => {
        setShops(res.data.shops)
      })
      .catch((e) => {
        toast.error(e.message)
      })
  }, [isShopUpdated])
  const [selectedTitle, setSelectedTitle] = useState([])
  const [selectedSubtitle, setSelectedSubtitle] = useState([])
  const [subtitleData, setSubtitleData] = useState({})
  const navigate = useNavigate()

  const handleTitleClick = (id, shop) => {
    setSelectedTitleId(id)
    setSelectedTitle(shop)
    setSelectedSubtitle("")
    axios
      .get(shopsURL + "/subtitle/" + id, { headers: { Authorization: "Bearer " + token } })
      .then((res) => {
        if (res.data.subtitle) {
          setSubtitleData((prev) => ({ ...prev, [id]: res.data.subtitle }))
        }
      })
      .catch((e) => {
        toast.error(e.message)
      })
  }
  const [subtitleValue, setSubtitleValue] = useState("")
  const handleSubtitleClick = (id, subtitle) => {
    setSelectedSubtitleId(id)
    setSelectedSubtitle(subtitle)
    setSubtitleValue(subtitle.subtitle)
    // setIsSubtitleSelected(subtitle);
    axios
      .get(productsURL + "/" + id, { headers: { Authorization: "Bearer " + token } })
      .then(async (res) => {
        if (res.data.products) {
          let decryptedData = JSON.parse(await decrypt(res.data.products))
          setProducts(decryptedData)
          setReservedProducts(decryptedData)
        } else {
          toast.success("No Product Found!")
        }
      })
      .catch((e) => {
        toast.error(e.message)
      })
  }
  useEffect(() => {
    axios
      .get(productsURL + "/" + selectedSubtitleId, { headers: { Authorization: "Bearer " + token } })
      .then(async (res) => {
        if (res.data.products) {
          let decryptedData = JSON.parse(await decrypt(res.data.products))
          setProducts(decryptedData)
          setReservedProducts(decryptedData)
        } else {
          toast.success("No Product Found!")
        }
      })
      .catch((e) => {
        toast.error(e.response.data?.message || "Server Error")
        toast.error(e.message)
        navigate("/")
      })
  }, [isUpdated])

  const [isSubtitleUpdated, setIsSubtitleUpdated] = useState(Date.now())
  useEffect(() => {
    if (!selectedTitleId) return
    axios
      .get(shopsURL + "/subtitle/" + selectedTitleId, { headers: { Authorization: "Bearer " + token } })
      .then((res) => {
        if (res.data.subtitle) {
          setSubtitleData((prev) => ({ ...prev, [selectedTitleId]: res.data.subtitle }))
        }
      })
      .catch((e) => {
        toast.error(e.message)
      })
  }, [isSubtitleUpdated])

  const handleCreateShop = (e) => {
    if (e.keyCode == 13) {
      axios
        .post(shopCreateURL, { shop_name }, { headers: { Authorization: "Bearer " + token } })
        .then((res) => {
          setShopName("")
          setShops((prev) => [...prev, res.data.shops])
        })
        .catch((e) => {
          toast.error(e.response.data.message)
        })
    }
  }
  const handleProductCreate = (e) => {
    e.preventDefault()
    if (!selectedSubtitleId) {
      toast.error("Seems no subtitle is selected!")
      return
    }
    if (!email || !domain || !password) {
      toast.error("Email, domain and password are required!")
      return
    }
    if (!isValidURL(domain)) {
      toast.error("Invalid domain field value. eg: https://exmaple.com/login")
      return
    }
    if (!editAbleData.id) {
      const formData = new FormData()
      formData.append("shop_id", selectedSubtitleId)
      formData.append("email", email)
      formData.append("domain", domain)
      formData.append("proxy", proxy)
      formData.append("password", password)
      formData.append("course_name", courseName)
      formData.append("file", file)
      if (!file) {
        toast.error("Please upload a file.")
        return
      }
      axios
        .post(productCreateURL, formData, { headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" } })
        .then((res) => {
          setProductName("")
          setProducts((prev) => [...prev, res.data.products])
          setEmail("")
          setDomain("")
          setProxy("")
          setCourseName("")
          setPassword("")
          setFile(null)
          toast.success("Credential created successfully!")
        })
        .catch((e) => {
          toast.error(e.response.data.message)
        })
    } else {
      axios
        .post(productUpdateURL, { course_name: courseName, domain, email, proxy, password, id: editAbleData.id }, { headers: { Authorization: "Bearer " + token } })
        .then((res) => {
          setProductName("")
          // setProducts((prev) => [...prev, res.data.products]);
          setEmail("")
          setDomain("")
          setProxy("")
          setCourseName("")
          setPassword("")
          setFile(null)
          setIsUpdated(Date.now())
          toast.success("Credential created successfully!")
        })
        .catch((e) => {
          toast.error(e.response.data.message)
        })
    }

    return false
  }

  const [editAbleData, setEditAbleData] = useState({})

  useEffect(() => {
    if (editAbleData.id) {
      setEmail(editAbleData.email)
      setDomain(editAbleData.domain)
      setProxy(editAbleData.proxy)
      setPassword(editAbleData.password)
      setCourseName(editAbleData.course_name)
    }
  }, [editAbleData])

  const handleProductUpdate = (id, course_name, domain, email, password, proxy) => {
    setEditAbleData({ id, course_name, domain, email, password, proxy })

    // if (result.isConfirmed) {
    //   axios
    //     .post(productUpdateURL, { id, course_name, domain, email, password }, { headers: { Authorization: "Bearer " + token } })
    //     .then((res) => {
    //       toast.success("Product changes have been saved!");
    //     })
    //     .catch((e) => {
    //       toast.error(e.response.data.message);
    //     });
    // }
  }

  const handleProductDelete = (id) => {
    Swal.fire({
      title: "Do you really want to delete?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(productDeleteURL, { data: { id }, headers: { Authorization: "Bearer " + token } })
          .then(() => {
            toast.success("Product has been deleted successfully!")
            setProducts((prev) => prev.filter((p) => p._id != id))
          })
          .catch((e) => {
            toast.error(e.response.data.message)
          })
      }
    })
  }
  const handleShopDelete = (shop) => {
    Swal.fire({
      title: "Do you really want to delete - " + shop.shop_name + "?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(shopDeleteURL, { data: { id: shop._id }, headers: { Authorization: "Bearer " + token } })
          .then(() => {
            toast.success(shop.shop_name + " has been deleted successfully!")
            setSelectedTitleId(null)
            setSelectedSubtitleId(null)
            setProducts([])
            setShops((prev) => prev.filter((p) => p._id != shop._id))
          })
          .catch((e) => {
            toast.error(e.response.data.message)
          })
      }
    })
  }
  const handleSubtitleDelete = (data) => {
    Swal.fire({
      title: "Do you really want to delete - " + data.subtitle + "?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(shopsURL + "/subtitle", { data: { id: data._id }, headers: { Authorization: "Bearer " + token } })
          .then(() => {
            toast.success(data.shop_name + " has been deleted successfully!")
            setSelectedSubtitleId(null)
            setIsSubtitleUpdated(Date.now())
          })
          .catch((e) => {
            toast.error(e.response.data.message)
          })
      }
    })
  }
  const handleCourseSearch = (query) => {
    setCourseSearchQuery(query)
    if (!query) {
      setProducts(reservedProducts)
      return
    }

    if (reservedProducts.length === 0) return setProducts([])
    const filteredProducts = reservedProducts?.filter((product) => product.course_name.toLowerCase().includes(query.trim().toLowerCase()))

    setProducts(filteredProducts)
  }

  const handleProductImageUpdate = (id, file) => {
    if (!file) {
      return
    }
    const formData = new FormData()
    formData.append("id", id)
    formData.append("file", file)

    axios
      .post(productUpdateURL + "/image", formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success("Product image updated successfully!")
        setIsUpdated(Date.now())
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || e.message)
      })
  }
  const [groupTitle, setGroupTitle] = useState("")
  useEffect(() => {
    setGroupTitle(selectedTitle?.shop_name)
  }, [selectedTitle])

  const handleProductTitleUpdate = (e) => {
    e.preventDefault()
    axios
      .post(
        shopsURL + "/update",
        { shop_name: groupTitle, id: selectedTitle._id },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        toast.success("Updated successfully!")
        setIsShopUpdated(Date.now())
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || e.message)
      })

    // return false;
  }

  const handleProductSubtitleUpdate = (e) => {
    e.preventDefault()

    axios
      .post(
        shopsURL + "/subtitle/update",
        { subtitle: subtitleValue, id: selectedSubtitleId },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        toast.success("Updated successfully!")
        setIsSubtitleUpdated(Date.now())
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || e.message)
      })

    // return false;
  }

  const [subtitle, setSubtitle] = useState({})
  const handleSubtitleCreate = (e, shop_id) => {
    e.preventDefault()
    if (e.keyCode !== 13) return
    if (!shop_id) {
      toast.error("Please select a title first")
      return
    }
    if (subtitle == "") {
      toast.error("Subtitle is empty")
      return
    }
    axios
      .post(
        shopsURL + "/create_subtitle",
        { shop_id: shop_id, subtitle: subtitle[shop_id] },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        toast.success("Created successfully!")
        setIsSubtitleUpdated(Date.now())
        setSubtitle((prev) => ({ ...prev, [shop_id]: "" }))
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || e.message)
      })

    // return false;
  }
  const [isDragging, setIsDragging] = useState({})

  const handleOnDrop = (subtitleId, p_id) => {
    axios
      .post(
        productsURL + "/copy",
        { subtitleId, p_id },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        toast.success("Product copied successfully!")
        setIsSubtitleUpdated(Date.now())
        setIsUpdated(Date.now())
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || e.message)
      })
  }

  return (
    <>
      <section className="shop-section ">
        {isAdmin ? (
          <>
            <div>
              <label>
                Title:
                <input value={shop_name} onChange={(e) => setShopName(e.target.value)} onKeyDown={handleCreateShop} className="mb-2 bg-white sticky top-0" type="text" placeholder="Create title..." />
              </label>
            </div>
            <div className="shop-container max-h-[500px] overflow-auto ">
              <ul className="  shadow rounded  p-2">
                {shops && shops.length > 0
                  ? shops.map((shop, i) => (
                      <li
                        onClick={(e) => {
                          handleTitleClick(shop._id, shop)
                        }}
                        key={shop._id}
                        className={` cursor-pointer hover:border-dotted hover:border-blue-500 hover:border flex flex-col justify-between p-[4px]  bg-gray-950/40 m-0.5 rounded   ${
                          selectedTitleId == shop._id ? "text-blue-500 border border-blue-500/50" : "text-black-400  "
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-semibold ml-2 text-sm">{shop.shop_name}</p>
                          <div className="flex gap-4">
                            <button
                              onClick={(e) => {
                                handleShopDelete(shop)
                              }}
                              className="px-2 py-1   text-red-400 rounded hover:bg-red-100"
                            >
                              <RiDeleteBin6Line />
                            </button>
                          </div>
                        </div>
                        <div className={selectedTitleId == shop._id ? "visible" : "hidden"}>
                          <ul className="p-2 ml-4 text-sm max-h-[300px] overflow-auto text-blue-500/80 bg-blue-950   mr-2 rounded-md">
                            {subtitleData[shop._id]?.length > 0
                              ? subtitleData[shop._id].map((data) => (
                                  <li
                                    onDragOver={(e) => {
                                      e.preventDefault()
                                      setIsDragging((prev) => ({ ...prev, [data._id]: true }))
                                    }}
                                    onDragLeave={(e) => {
                                      e.preventDefault()
                                      setIsDragging((prev) => ({ ...prev, [data._id]: false }))
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault()
                                      setIsDragging((prev) => ({ ...prev, [data._id]: false }))
                                      let p_id = e.dataTransfer.getData("text")
                                      handleOnDrop(data._id, p_id)
                                    }}
                                    style={{
                                      border: isDragging[data._id] ? "1px dashed #2b7fff" : "",
                                      padding: isDragging[data._id] ? 5 : "",
                                      borderRadius: isDragging[data._id] ? 0 : "",
                                      background: isDragging[data._id] ? "#2299dd24" : "",
                                    }}
                                    key={data._id}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSubtitleClick(data._id, data)
                                    }}
                                    className="hover:bg-blue-900 pl-2 rounded-sm flex justify-between cursor-pointer"
                                  >
                                    <p>{data.subtitle}</p>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleSubtitleDelete(data)
                                      }}
                                      className="px-2 py-1 text-red-400 rounded hover:bg-red-100"
                                    >
                                      <RiDeleteBin6Line />
                                    </button>
                                  </li>
                                ))
                              : "Empty"}
                          </ul>
                          <input
                            type="text"
                            value={subtitle[shop._id] || ""}
                            onClick={(e) => e.stopPropagation()}
                            onInput={(e) => setSubtitle((prev) => ({ ...prev, [shop._id]: e.target.value }))}
                            onKeyUp={(e) => handleSubtitleCreate(e, shop._id)}
                            placeholder="subtitle"
                            className="!p-0 !w-fit !pl-2 !rounded-md text-sm ml-4 placeholder:text-gray-400"
                          />
                        </div>
                      </li>
                    ))
                  : ""}
              </ul>
            </div>
          </>
        ) : (
          ""
        )}

        {/* Product list table start */}

        <div className="product-list mt-4">
          <div>
            {selectedTitleId ? (
              <form onSubmit={handleProductTitleUpdate} className="mb-2">
                <div className="flex gap-2 mb-2">
                  <input value={groupTitle || ""} onInput={(e) => setGroupTitle(e.target.value)} type="text" placeholder="Title..." />
                </div>
              </form>
            ) : (
              ""
            )}
          </div>
          {selectedSubtitleId != null && isAdmin ? (
            <>
              <hr />
              <form onSubmit={handleProductSubtitleUpdate} className="mb-2">
                <div className="flex gap-2 mb-2">
                  <input value={subtitleValue || ""} onInput={(e) => setSubtitleValue(e.target.value)} type="text" placeholder="Subtitle..." />
                </div>
              </form>
              <hr />
              <form onSubmit={handleProductCreate} className="  bg-gray-950/40 p-4 rounded-2xl  ">
                <div className="flex gap-2 justify-center rounded-2xl items-center">
                  <label>
                    Name:
                    <input
                      required
                      value={courseName}
                      onChange={(e) => {
                        setCourseName(e.target.value)
                      }}
                      className="mb-2  sticky top-0 bg-white"
                      type="text"
                      placeholder="Enter name"
                    />
                  </label>
                  <label>
                    Domain:
                    <input
                      required
                      value={domain}
                      onChange={(e) => {
                        setDomain(e.target.value)
                      }}
                      className="mb-2  sticky top-0 bg-white"
                      type="text"
                      placeholder="Enter domain name"
                    />
                  </label>
                  <label>
                    Proxy:
                    <input
                      value={proxy}
                      onChange={(e) => {
                        setProxy(e.target.value)
                      }}
                      className="mb-2  sticky top-0 bg-white"
                      type="text"
                      placeholder="eg: socks5://user:pass@host:port"
                    />
                  </label>
                  <label>
                    Email/username:
                    <input
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                      }}
                      className="mb-2  sticky top-0 bg-white"
                      type="text"
                      placeholder="Enter Emali/username"
                    />
                  </label>
                  <label>
                    Password:
                    <input
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                      }}
                      className="mb-2  sticky top-0 bg-white"
                      type="text"
                      placeholder="Enter passsword"
                    />
                  </label>
                  {!editAbleData.id ? (
                    <label tabIndex="0" htmlFor="file" className=" sticky top-0 bg-green-500 text-white hover:text-white hover:bg-green-600 cursor-pointer rounded-md p-2 mt-5">
                      Upload media
                      <input id="file" required accept=".png, .jpg, .jpeg, .webp,.svg, .gif" onChange={(e) => setFile(e.target.files[0])} className="opacity-0 absolute w-0 h-0" type="file" />
                    </label>
                  ) : (
                    ""
                  )}
                </div>

                <div className="w-full flex justify-center">
                  {editAbleData.id ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditAbleData({})
                          setEmail("")
                          setDomain("")
                          setProxy("")
                          setPassword("")
                          setCourseName("")
                        }}
                        className="flex items-center gap-2 create-user   py-2 px-4 bg-red-400 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        <IoMdClose className=" text-2xl" />
                      </button>

                      <button
                        type="submit"
                        className="flex items-center gap-2 create-user   py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <IoMdDoneAll className=" text-2xl" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {" "}
                      <button
                        type="submit"
                        className="flex items-center gap-2 create-user   py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <IoMdAdd className=" text-2xl" />
                      </button>
                    </>
                  )}
                </div>
              </form>
            </>
          ) : (
            ""
          )}
          {selectedSubtitleId ? (
            <div>
              <input type="search" value={courseSearchQuery || ""} placeholder="Search course by name" onInput={(e) => handleCourseSearch(e.target.value)} />
            </div>
          ) : (
            ""
          )}

          {products.length > 0 ? (
            <>
              <div className="overflow-auto mt-5 rounded-md ">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Course name</th>
                      <th>Domain</th>
                      <th>Email/Username</th>
                      <th>Password</th>
                      <th>Change image</th>
                      <th>Edit</th>
                      {isAdmin ? <th>Del</th> : ""}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, i) => {
                      return (
                        <tr
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text", p._id)
                          }}
                          key={p._id}
                          className="hover:bg-gray-100"
                        >
                          <td className="text-blue-500 select-all ">{i + 1}</td>
                          <td className="text-blue-500 select-all ">{p.course_name}</td>
                          <td className="text-green-500 select-all ">{getDomain(p.domain)}</td>
                          <td className="text-blue-500 select-all ">{p.email}</td>
                          <td className="text-gray-400 select-all ">{p.password}</td>
                          <td>
                            <div className="flex items-center justify-center">
                              <label
                                onChange={(e) => {
                                  handleProductImageUpdate(p._id, e.target.files[0])
                                }}
                                className="px-2 py-2 text-green-400 rounded  hover:bg-green-200 cursor-pointer"
                              >
                                <input accept="image/*" type="file" className=" opacity-1 absolute !w-0 !h-0 !z-0" />
                                <FaUpload />
                              </label>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => {
                                  handleProductUpdate(p._id, p.course_name, p.domain, p.email, p.password, p.proxy)
                                }}
                                className="px-2 py-2 text-green-400 rounded hover:bg-green-200"
                              >
                                <CiEdit />
                              </button>
                            </div>
                          </td>
                          {isAdmin ? (
                            <td>
                              <div className="flex items-center justify-center">
                                <button
                                  onClick={() => {
                                    handleProductDelete(p._id)
                                  }}
                                  className="px-2 py-2 text-blue-400 rounded hover:bg-blue-200"
                                >
                                  <RiDeleteBin6Line />
                                </button>
                              </div>
                            </td>
                          ) : (
                            ""
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-gray-400 text-center p-4">{selectedTitleId ? "--" : ""}</div>
          )}
        </div>
      </section>
    </>
  )
}

export default Shops
