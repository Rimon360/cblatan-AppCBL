import { IoMdAdd } from "react-icons/io";
import { FaCheck, FaMinus } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../../axiosConfig';
import { shopCreateURL, productCreateURL, shopsURL, productsURL, productUpdateURL, memberShopsURL, productDeleteURL, shopDeleteURL } from "../routes/Url";
import toast from "react-hot-toast";
import { useGlobal } from "../context/GlobalStete";
import Swal from "sweetalert2";
import { decrypt, isValidURL } from "../functions";
import { getDomain } from "../functions";
import { CiEdit } from "react-icons/ci";
const Shops = () => {
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [shop_name, setShopName] = useState([]);
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [email, setEmail] = useState([]);
  const [domain, setDomain] = useState("");
  const [courseName, setCourseName] = useState("");
  const [password, setPassword] = useState("");
  const { current_user } = useGlobal();
  const [shops, setShops] = useState([]);
  const shop_id = localStorage.getItem("SelectedShopId");
  const nav = useNavigate();
  const [decryptionData, setDecryptionData] = useState(null);
  const [decryptedPassword, setDecryptedPassword] = useState("");
  const [file, setFile] = useState(null);
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [reservedProducts, setReservedProducts] = useState([]);

  useEffect(() => {
    if (shop_id != null) {
      setSelectedShopId(shop_id);
    }
  }, [shop_id]);

  const token = localStorage.getItem("token");
  const role = current_user.role;
  const isAdmin = role == "admin";

  const [productStates, setProductStates] = useState({});

  const handleProductChange = (id, field, value) => {
    if (value < 0) value = 1;
    setProductStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleProductClick = (id, field, delta) => {
    setProductStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: (prev[id]?.[field] || 0) + delta < 0 ? 0 : (prev[id]?.[field] || 0) + delta,
      },
    }));
  };
  const [isUpdated, setIsUpdated] = useState(false);
  useEffect(() => {
    let url = shopsURL;
    if (!isAdmin) return;
    if (current_user.role != "admin" && current_user.role != "member") return;
    if (current_user.role == "member") {
      url = memberShopsURL + `/${current_user._id}`;
    }
    axios
      .get(url, { headers: { Authorization: "Bearer " + token } })
      .then((res) => {
        setShops(res.data.shops);
      })
      .catch((e) => {
        toast.error(e.message);
      });
  }, []);

  const handleShopClick = (id) => {
    setSelectedShopId(id);
    axios
      .get(productsURL + "/" + id, { headers: { Authorization: "Bearer " + token } })
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products);
        }
        else {
          toast.success("No Product Found!");
        }
      })
      .catch((e) => {
        console.log(e);

        toast.error(e.message);
      });
  };

  useEffect(() => {
    if (!selectedShopId) return;
    axios
      .get(productsURL + "/" + selectedShopId, { headers: { Authorization: "Bearer " + token } })
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products);
          setReservedProducts(res.data.products);
        }
        else {
          toast.success("No Product Found!");
        }
      })
      .catch((e) => {
        toast.error(e.message);
      });
  }, [selectedShopId, isUpdated]);

  const handleCreateShop = (e) => {
    if (e.keyCode == 13) {
      axios
        .post(shopCreateURL, { shop_name }, { headers: { Authorization: "Bearer " + token } })
        .then((res) => {
          setShopName("");
          setShops((prev) => [...prev, res.data.shops]);
        })
        .catch((e) => {
          toast.error(e.response.data.message);
        });
    }
  };
  const handleProductCreate = (e) => {
    e.preventDefault();
    if (!email || !domain || !password) {
      toast.error("Email, domain and password are required!");
      return;
    }
    if (!isValidURL(domain)) {
      toast.error("Invalid domain field value. eg: https://exmaple.com/login")
      return
    }
    if (!editAbleData.id) {
      const formData = new FormData();
      formData.append('shop_id', selectedShopId);
      formData.append('email', email);
      formData.append('domain', domain);
      formData.append('password', password);
      formData.append('course_name', courseName);
      formData.append('file', file);
      if (!file) {
        toast.error("Please upload a file.");
        return;
      }
      axios
        .post(productCreateURL, formData, { headers: { Authorization: "Bearer " + token, 'Content-Type': 'multipart/form-data' } })
        .then((res) => {
          setProductName("");
          setProducts((prev) => [...prev, res.data.products]);
          setEmail("");
          setDomain("");
          setCourseName("");
          setPassword("");
          setFile(null);
          toast.success("Credential created successfully!");
        })
        .catch((e) => {
          toast.error(e.response.data.message);
        });
    } else {
      axios
        .post(productUpdateURL, { course_name: courseName, domain, email, password, id: editAbleData.id }, { headers: { Authorization: "Bearer " + token } })
        .then((res) => {
          setProductName("");
          // setProducts((prev) => [...prev, res.data.products]);
          setEmail("");
          setDomain("");
          setCourseName("");
          setPassword("");
          setFile(null);
          setIsUpdated(Date.now());
          toast.success("Credential created successfully!");
        })
        .catch((e) => {
          toast.error(e.response.data.message);
        });

    }

    return false;
  };

  const [editAbleData, setEditAbleData] = useState({})

  useEffect(() => {
    if (editAbleData.id) {
      setEmail(editAbleData.email);
      setDomain(editAbleData.domain);
      setPassword(editAbleData.password);
      setCourseName(editAbleData.course_name);
    }

  }, [editAbleData])

  const handleProductUpdate = (id, course_name, domain, email, password) => {

    setEditAbleData({ id, course_name, domain, email, password })


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
  };
  useEffect(() => {
    const initialState = {};
    products.forEach(async (product) => {
      initialState[product._id] = {
        baked: product.baked,
        wastage: product.wastage
      };

    });
    setProductStates(initialState);
  }, [products]);

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
            toast.success("Product has been deleted successfully!");
            setProducts((prev) => prev.filter((p) => p._id != id));
          })
          .catch((e) => {
            toast.error(e.response.data.message);
          });
      }
    });
  };
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
            toast.success(shop.shop_name + " has been deleted successfully!");
            if (selectedShopId == shop._id) {
              setSelectedShopId(null);
            }
            setShops((prev) => prev.filter((p) => p._id != shop._id));
          })
          .catch((e) => {
            toast.error(e.response.data.message);
          });
      }
    });
  };
  const logout = () => {
    localStorage.removeItem("token");
    if (role == "admin") {
      nav("/admin");
    } else {
      nav("/");
    }
  };
  const handleCourseSearch = (query) => {
    setCourseSearchQuery(query);
    if (!query) {
      setProducts(reservedProducts);
      return;
    }

    if (reservedProducts.length === 0) return setProducts([]);
    const filteredProducts = reservedProducts?.filter(product =>
      product.course_name.toLowerCase().includes(query.trim().toLowerCase())
    );

    setProducts(filteredProducts);
  };

  return (
    <>

      <section className="shop-section p-6">

        {isAdmin ? (
          <>
            <div>
              <label>
                Group name:
                <input value={shop_name} onChange={(e) => setShopName(e.target.value)} onKeyDown={handleCreateShop} className="mb-2 sticky top-0" type="text" placeholder="Enter course group name" />
              </label>
            </div>
            <div className="shop-container max-h-[300px] overflow-auto ">
              <ul className="  shadow rounded  p-2">
                {shops && shops.length > 0 ? (
                  shops.map((shop, i) => (
                    <li
                      key={shop._id}
                      onClick={(e) => {
                        handleShopClick(shop._id);
                      }}
                      className={`flex justify-between items-center p-[4px] cursor-pointer bg-gray-200 m-0.5 rounded   ${selectedShopId == shop._id ? "text-white bg-gray-900  " : "text-black-400 hover:text-blue-500 capitalize hover:bg-gray-300"}`}
                    >
                      <p className="font-semibold ml-2">
                        {shop.shop_name}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShopDelete(shop);
                        }}
                        className="px-2 py-1   text-orange-400 rounded hover:bg-orange-200"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </li>
                  ))
                ) : (
                  <div className="empty-result text-gray-400 text-center">No course group found!</div>
                )}
              </ul>
            </div>
          </>
        ) : (
          ""
        )}

        {/* Product list table start */}

        <div className="product-list mt-4">
          {selectedShopId != null && isAdmin ? (
            <form onSubmit={handleProductCreate} className="  bg-gray-100 p-4 rounded-2xl  " >
              <div className="flex gap-2 bg-gray-100  rounded-2xl items-center" >
                <label>
                  Course name:
                  <input
                    required
                    value={courseName}
                    onChange={(e) => {
                      setCourseName(e.target.value);
                    }}
                    className="mb-2  sticky top-0 bg-white"
                    type="text"
                    placeholder="Enter course name"
                  />
                </label>
                <label>
                  Domain:
                  <input
                    required
                    value={domain}
                    onChange={(e) => {
                      setDomain(e.target.value);
                    }}
                    className="mb-2  sticky top-0 bg-white"
                    type="text"
                    placeholder="Enter domain name"
                  />
                </label>
                <label>
                  Email/username:
                  <input
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
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
                      setPassword(e.target.value);
                    }}
                    className="mb-2  sticky top-0 bg-white"
                    type="text"
                    placeholder="Enter passsword"
                  />
                </label>
                {!editAbleData.id ? (<label tabIndex="0" htmlFor="file" className=" sticky top-0 bg-green-200 text-green-500 hover:text-white hover:bg-green-300 cursor-pointer rounded-md p-2 mt-5" >
                  Upload media
                  <input
                    id="file"
                    required
                    accept=".png, .jpg, .jpeg, .webp,.svg, .gif"
                    onChange={e => setFile(e.target.files[0])}
                    className="opacity-0 absolute w-0 h-0"
                    type="file"
                  />
                </label>) : ""}

              </div>

              <div className="w-fit" >
                {editAbleData.id ? (<div className="flex gap-2">
                  <button type="button" onClick={() => {
                    setEditAbleData({});
                    setEmail("");
                    setDomain("");
                    setPassword("");
                    setCourseName("");
                  }} className="flex items-center gap-2 create-user   py-2 px-4 bg-red-400 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
                    Cancel
                    <IoMdAdd className="ml-[-6px] text-2xl" />
                  </button>

                  <button type="submit" className="flex items-center gap-2 create-user   py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                    Update Credential
                    <IoMdAdd className="ml-[-6px] text-2xl" />
                  </button>


                </div>

                ) : (<>             <button type="submit" className="flex items-center gap-2 create-user   py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  Create Credential
                  <IoMdAdd className="ml-[-6px] text-2xl" />
                </button></>)}
              </div>
            </form>
          ) : (
            <p className="text-gray-400 mb-2 bg-gray-50 text-center ">
              No course group selected.
            </p>
          )}
          {selectedShopId ? (<div>
            <input
              type="search"
              value={courseSearchQuery}
              placeholder="Search course by name"
              onChange={(e) => handleCourseSearch(e.target.value)}
            />
          </div>) : ""}

          {products.length > 0 ? (<>

            <div className="overflow-auto mt-5 rounded-md ">

              <table  >
                <thead>
                  <tr>
                    <th>Thumnail</th>
                    <th>Course name</th>
                    <th>Domain</th>
                    <th>Email/Username</th>
                    <th>Password</th>
                    <th>Edit</th>
                    {isAdmin ? <th>Del</th> : ""}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    return (
                      <tr key={p._id} className="hover:bg-gray-100">
                        <td className="text-orange-500 select-all " ><img crossOrigin="annonyms" className="max-w-[50px] max-h-[50px] " src={import.meta.env.VITE_BACKEND_URL + "/" + p.file_path} alt="" /></td>
                        <td className="text-orange-500 select-all " >{p.course_name}</td>
                        <td className="text-green-500 select-all " >{getDomain(p.domain)}</td>
                        <td className="text-blue-500 select-all " >{p.email}</td>
                        <td className="text-gray-400 select-all " >{p.password}</td>
                        <td>
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => {
                                handleProductUpdate(p._id, p.course_name, p.domain, p.email, p.password);
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
                                  handleProductDelete(p._id);
                                }}
                                className="px-2 py-2 text-orange-400 rounded hover:bg-orange-200"
                              >
                                <RiDeleteBin6Line />
                              </button>
                            </div>
                          </td>
                        ) : (
                          ""
                        )}

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div></>
          ) : (
            <div className="text-gray-400 text-center p-4">
              {
                selectedShopId
                  ? "No password found in this group."
                  : ""
              }
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Shops; 