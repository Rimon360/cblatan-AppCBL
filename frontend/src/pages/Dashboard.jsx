import { NavLink } from "react-router-dom";
import { Routes, Route, useNavigate } from "react-router-dom";
import NotFound from "./NotFound.jsx";
import Users from "./Users.jsx";
import Shops from "./Shops.jsx";
import { CiUser } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { CiShop } from "react-icons/ci";
import Assign_shop from "./Assign_shop.jsx";
import { useGlobal } from "../context/GlobalStete.jsx";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Activity from "./Activity.jsx";
import { FiActivity } from "react-icons/fi";
import { MdOutlinePassword } from "react-icons/md";

function Dashboard() {
  const nav = useNavigate();
  const { current_user } = useGlobal();
  const role = current_user.role;
  const logout = () => {
    localStorage.removeItem("token");
    if (role == "admin") {
      nav("/admin");
    } else {
      nav("/");
    }
  };

  return (
    <section className="flex h-screen">
      {role == "admin" ? (
        <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
          <ul className="space-y-1">
            <li className="flex justify-between mb-10 bg-gray-900 p-2 rounded-lg">
              {current_user.username}
              <span className=" inline-block bg-gray-800 text-white text-xs px-2 py-1 rounded-full shadow">{current_user.role}</span>
            </li>
            <li>
              {role == "admin" ? (
                <NavLink to={"/dashboard/users"} end className={({ isActive }) => (isActive ? "text-white bg-gray-900" : "")}>
                  <FaRegUser /> Manage user
                </NavLink>
              ) : (
                <></>
              )}
            </li>
            <li>
              <NavLink to={"/dashboard/managepassword"} className={({ isActive }) => (isActive ? "text-white bg-gray-900" : "")}>
                <MdOutlinePassword /> Manage Password
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/activity"} className={({ isActive }) => (isActive ? "text-white bg-gray-900" : "")}>
                <FiActivity /> Activity
              </NavLink>
            </li>
          </ul>
          <button onClick={logout} className="w-full flex items-center gap-2 mt-4 py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-red-500">
            Logout <FiLogOut />
          </button>
        </aside>
      ) : (
        ""
      )}
      <section className="right-section h-screen overflow-auto flex-1 p-4 bg-gray-50">
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/users" element={<Users />} />
          <Route path="/managepassword" element={<Shops />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/shops/:shop_id" element={<Shops />} />
          <Route path="/assign-product/:id" element={<Assign_shop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </section>
    </section>
  );
}

export default Dashboard;
