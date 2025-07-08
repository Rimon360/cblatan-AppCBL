import {IoMdAdd} from "react-icons/io";
import {FaCheck, FaMinus} from "react-icons/fa6";
import {RiDeleteBin6Line} from "react-icons/ri";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {BsArrowRight} from "react-icons/bs";
import axios from "axios";
import {shopCreateURL, productCreateURL, shopsURL, productsURL, productUpdateURL, unassignURL, assignURL, getassignedshopsURL} from "../routes/Url";
import toast from "react-hot-toast";
import {useGlobal} from "../context/GlobalStete";
import Swal from "sweetalert2";
const Assign_shop = () => {
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [shop_name, setShopName] = useState("");
  const {current_user} = useGlobal();
  const [shops, setShops] = useState([]);
  const token = localStorage.getItem("token");
  const {id} = useParams();
  const [userId, setUserId] = useState(id);
  const [shopSearch, setShopSearch] = useState("");
  const [filteredShops, setFilteredShops] = useState([]);
  const [detectShopChanges, setDetectShopChanges] = useState(0);
  const [isAssigned, setIsAssigned] = useState(false);
  useEffect(() => {
    setUserId(id);
  }, [id]);
  const [productStates, setProductStates] = useState({});
  const handleProductChange = (id, field, value) => {
    if (value < 0) value = 1;
    setProductStates((prev) => ({
      ...prev,
      [id]: {...prev[id], [field]: value},
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

  const getShops = async () => {
    if (current_user.role !== "admin") return;
    axios
      .get(shopsURL, {headers: {Authorization: "Bearer " + token}})
      .then((res) => {
        let tmpShops = res.data.shops;
        axios
          .get(`${getassignedshopsURL}/${userId}`, {
            headers: {Authorization: "Bearer " + token},
          })
          .then((res) => {
            const assignedShops = res.data.shops; // If assignedShops are ObjectIds, convert to strings
            let tmp = tmpShops.map((shop) => {
              const isAssigned = assignedShops.includes(shop._id.toString()); // Convert shop._id to string if necessary
              return {...shop, isAssigned};
            });
            setShops(tmp);
          });
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  useEffect(() => {
    getShops();
  }, []);

  useEffect(() => {
    setFilteredShops(shops.filter((shop) => shop.shop_name.toLowerCase().includes(shopSearch.toLowerCase())));
  }, [shopSearch, shops]);
  const handleShopSearch = (value) => {
    setShopSearch(value);
  };
  const handleAssingShop = (shop) => {
    return (e) => {
      e.preventDefault();
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
                data: {shop_id: shop._id, user_id: userId},
                headers: {Authorization: "Bearer " + token},
              })
              .then((res) => {
                toast.success(res.data.message);
                getShops();
              })
              .catch((e) => {
                toast.error(e.response.data.message);
              });
          }
        });
      } else {
        const data = {shop_id: shop._id, user_id: userId};
        axios
          .post(assignURL, data, {headers: {Authorization: "Bearer " + token}})
          .then((res) => {
            toast.success(res.data.message);
            getShops();
          })
          .catch((e) => {
            toast.error(e.response.data.message);
          });
      }
    };
  };

  return (
    <>
      <section className="shop-section p-6">
        <div>
          <input type="search" value={shopSearch} onInput={(e) => handleShopSearch(e.target.value)} placeholder="Search shop" />
        </div>
        <br />
        <div className="shop-container  mb-6">
          <ul className="max-h-300 overflow-auto shadow rounded  p-2">
            {filteredShops && filteredShops.length > 0 ? (
              filteredShops.map((shop, i) => (
                <li key={shop._id} className={`flex justify-between items-center p-[4px]  border-dotted rounded-lg ${selectedShopId == shop._id ? "text-green-300 hover:text-green-400" : "text-black-400 "}`}>
                  <p className="font-semibold  ">
                    ({i + 1}) - {shop.shop_name}
                  </p>
                  <p>
                    <button onClick={handleAssingShop(shop, shop.isAssigned)} className={` pl-2 pr-2 pt-1 pb-1 rounded-lg cursor-pointer  ${shop.isAssigned ? "bg-red-100 text-red-500 hover:bg-red-500 hover:text-white" : "bg-orange-100 text-orange-500 hover:bg-orange-500 hover:text-white"}`}>
                      {shop.isAssigned ? "Unassign" : "Assign"} <BsArrowRight className="inline" />
                    </button>
                  </p>
                </li>
              ))
            ) : (
              <div className="empty-result">Empty shop</div>
            )}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Assign_shop;
