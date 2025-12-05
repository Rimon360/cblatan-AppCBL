import { useEffect, useState } from "react";
import { shopsURL } from "../routes/Url";
import { useNavigate, NavLink } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
const Shop_list = () => {
  const [shopList, setShopList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchShopList = async () => {
      try {
        const response = await fetch(shopsURL);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setShopList(data.shops);
      } catch (error) {
        console.error("Error fetching shop list:", error);
      }
    };

    fetchShopList();
  }, []);
  const handleShopSelect = (shopId) => () => {
    localStorage.setItem("SelectedShopId", shopId); // Store the selected shop ID in local storage
    navigate(`/users_with_shop/${shopId}`);
  };
  return (
    <div className=" mx-auto">
      <h1 className="text-center text-2xl text-green-400 font-bold mt-4">{shopList.length > 0 ? "SHOP" : ""}</h1>
      <div className=" overflow-auto p-4 flex flex-wrap justify-center items-center">
        {shopList.length > 0 ? (
          shopList.map((shop) => (
            <div key={shop._id} onClick={handleShopSelect(shop._id)} className="p-5 bg-blue-200 m-2 rounded-md shadow-md max-w-[300px] max-h-[200px] h-[200px] w-[300px] flex items-center justify-center cursor-pointer hover:bg-blue-300 transition duration-300 ease-in-out text-xl text-center">
              {shop.shop_name}
            </div>
          ))
        ) : (
          <div className="p-5   m-2 rounded-md shadow-md  h-[200px] w-[300px] flex flex-col items-center justify-center ">
            No Credentials Found
            <NavLink className=" p-5  m-2  rounded-md flex items-center justify-center bg-red-100  hover:bg-red-300  cursor-pointer transition duration-300 ease-in-out" to={"../"}>
              <IoMdArrowBack />
              Back
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop_list;
