import { NavLink } from "react-router-dom"
import { Routes, Route, useNavigate } from "react-router-dom"
import NotFound from "./NotFound.jsx"
import Users from "./Users.jsx"
import Shops from "./Shops.jsx"
import { LiaLayerGroupSolid } from "react-icons/lia"
import { GrDomain } from "react-icons/gr"
import LogoCrud from "./Logo_crud.jsx"
import Ads from "./Ads.jsx"
import BlacklistUrl from "./BlacklistUrl.jsx"
import IpBlacklist from "./BlockedIps.jsx"
import ProfileGroup from "./Profile_group.jsx"
import { FiLogOut, FiUserX } from "react-icons/fi"
import { FaRegUser, FaUserSecret } from "react-icons/fa"
import Assign_shop from "./Assign_shop.jsx"
import { useGlobal } from "../context/GlobalStete.jsx"
import Activity from "./Activity.jsx"
import Whitelist from "./Whitelist.jsx"
import { FiActivity } from "react-icons/fi"
import { MdOutlineAdminPanelSettings, MdOutlinePassword } from "react-icons/md"
import { FaGripHorizontal } from "react-icons/fa"
import { CiBoxList, CiImageOn, CiLollipop } from "react-icons/ci"
import { FaLayerGroup } from "react-icons/fa"
import { CiBullhorn } from "react-icons/ci"
import { MdBlock } from "react-icons/md"
import History from "./History.jsx"
import BlockedIps from "./BlockedIps.jsx"

function Dashboard() {
  const nav = useNavigate()
  const { current_user } = useGlobal()
  const role = current_user.role
  const logout = () => {
    localStorage.removeItem("token")
    if (role == "admin") {
      nav("/admin")
    } else {
      nav("/")
    }
  }

  return (
    <section className="flex h-screen">
      {role == "admin" ? (
        <aside className="w-50  text-white p-4 flex flex-col justify-between">
          <ul className="space-y-1">
            <li className="flex justify-center mb-10 bg-gray-900  p-2 !rounded-full">
              <span className=" inline-block bg-gray-950 text-white text-xs px-2 py-1 rounded-full shadow uppercase"> Kaizen Panel</span>
            </li>
            <li>
              {role == "admin" ? (
                <NavLink to={"/dashboard/users"} end className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                  <FaRegUser /> Manage User
                </NavLink>
              ) : (
                <></>
              )}
            </li>
            <li>
              <NavLink to={"/dashboard/managepassword"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                <GrDomain /> Courses
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/whitelist"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                <FaGripHorizontal /> IP Whitelist
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/activity"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                <FiActivity /> Activity
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/logos"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                <CiImageOn /> Logos
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/profilegroup"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                <LiaLayerGroupSolid /> Profile Group
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/ads"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                <CiBullhorn /> Ads
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/blacklistUrl"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                <CiBoxList /> Blacklist URL
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/blockedip"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                <CiLollipop /> Blocked IPs
              </NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard/history"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                <FiUserX /> Suspecious User
              </NavLink>
            </li>
          </ul>
          <button onClick={logout} className="w-full flex items-center gap-2 mt-4 py-2 px-4 text-red-500 bg-red-900/30 font-semibold rounded-lg hover:bg-red-500/50 hover:text-white">
            Cerrar <FiLogOut />
          </button>
        </aside>
      ) : (
        ""
      )}
      <section className="right-section bg-gray-900 h-screen overflow-auto flex-1 p-4 text-white ">
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/logos" element={<LogoCrud />} />
          <Route path="/blacklistUrl" element={<BlacklistUrl />} />
          <Route path="/ads" element={<Ads />} />
          <Route path="/profilegroup" element={<ProfileGroup />} />
          <Route path="/users" element={<Users />} />
          <Route path="/managepassword" element={<Shops />} />
          <Route path="/whitelist" element={<Whitelist />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/history" element={<History />} />
          <Route path="/blockedip" element={<BlockedIps />} />
          <Route path="/shops/:shop_id" element={<Shops />} />
          <Route path="/assign-product/:id" element={<Assign_shop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </section>
    </section>
  )
}

export default Dashboard
