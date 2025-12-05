import { useEffect, useState } from "react";
import { shopsURL } from "../routes/Url";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import toast from "react-hot-toast";
const User_list = () => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const shop_id = useParams().shop_id;

  useEffect(() => {
    const fetchShopList = async () => {
      if (!shop_id) {
        toast.error("Credentials ID is not provided in the URL parameters.");
        return;
      }
      try {
        const response = await fetch(shopsURL + "/getuserbyshopid/" + shop_id);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserList(data.users);
      } catch (error) {
        console.error("Error fetching Credentials list:", error);
      }
    };

    fetchShopList();
  }, []);
  const handleShopSelect = (userId, username) => {
    navigate(`/userlogin/${userId}/${username}`);
  };
  return (
    <div className=" mx-auto">
      <h1 className="text-center text-2xl text-yellow-400 font-bold mt-4">{userList.length > 0 ? "USER" : ""}</h1>
      <div className=" overflow-auto p-4 flex flex-wrap justify-center items-center">
        {userList.length > 0 ? (
          userList.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                handleShopSelect(user._id, user.username);
              }}
              className="p-5 bg-red-200 m-2 rounded-md shadow-md max-w-[300px] max-h-[200px] h-[200px] w-[300px] flex items-center justify-center cursor-pointer hover:bg-red-300 transition duration-300 ease-in-out  text-xl text-center"
            >
              {user.username}
            </div>
          ))
        ) : (
          <div className="p-5   m-2 rounded-md shadow-md  h-[200px] w-[300px] flex flex-col items-center justify-center ">
            No Users Found On That Credentials
            <NavLink className=" p-5  m-2  rounded-md flex items-center justify-center bg-red-100  hover:bg-red-300  cursor-pointer transition duration-300 ease-in-out" to={"/"}>
              <IoMdArrowBack />
              Back
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default User_list;
