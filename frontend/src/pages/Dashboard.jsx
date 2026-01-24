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
import ProfileGroup from "./Profile_group.jsx"
import { FiLogOut, FiUserX } from "react-icons/fi"
import { FaRegUser } from "react-icons/fa"
import Assign_shop from "./Assign_shop.jsx"
import { useGlobal } from "../context/GlobalStete.jsx"
import Activity from "./Activity.jsx"
import Whitelist from "./Whitelist.jsx"
import { FiActivity } from "react-icons/fi"
import { MdOutlineAssignmentTurnedIn } from "react-icons/md"
import { FaGripHorizontal } from "react-icons/fa"
import { CiBoxList, CiImageOn, CiLollipop } from "react-icons/ci"
import { RxActivityLog } from "react-icons/rx"
import { TfiEmail } from "react-icons/tfi"
import { CiBullhorn } from "react-icons/ci"
import History from "./History.jsx"
import BlockedIps from "./BlockedIps.jsx"
import EmailActivity from "./EmailActivity.jsx"
import ApiActivity from "./apiActivity.jsx"
import AssignRequest from "./AssignRequest.jsx"

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
      {["admin", "manager"].includes(role) ? (
        <aside className="w-50  text-white p-4 flex flex-col justify-between">
          <ul className="space-y-1">
            <li className="flex justify-center mb-10 bg-gray-900  p-2 !rounded-full">
              <span className=" inline-block bg-gray-950 text-white text-xs px-2 py-1 rounded-full shadow uppercase"> Kaizen Panel</span>
            </li>
            <li>
              {["admin", "manager"].includes(role) ? (
                <NavLink to={"/dashboard/users"} end className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                  <FaRegUser />
                  Usuaria
                </NavLink>
              ) : (
                <></>
              )}
            </li>
            <li>
              {["admin"].includes(role) ? (
                <NavLink to={"/dashboard/managepassword"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                  <GrDomain /> Cursos
                </NavLink>
              ) : (
                <></>
              )}
            </li>
            <li>
              {["admin"].includes(role) ? (
                <NavLink to={"/dashboard/assign_request"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                  <MdOutlineAssignmentTurnedIn /> Assign request
                </NavLink>
              ) : (
                <></>
              )}
            </li>
            <li>
              {["admin"].includes(role) ? (
                <NavLink to={"/dashboard/whitelist"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                  <FaGripHorizontal /> Lista blanca de IP
                </NavLink>
              ) : (
                <></>
              )}
            </li>
            <li>
              {["admin"].includes(role) ? (
                <NavLink to={"/dashboard/activity"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                  <FiActivity /> Actividad
                </NavLink>
              ) : (
                <></>
              )}
            </li>
            <li>
              {["admin"].includes(role) ? (
                <NavLink to={"/dashboard/logos"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                  <CiImageOn /> Logo
                </NavLink>
              ) : (
                <></>
              )}
            </li>
            <li>
              {["admin"].includes(role) ? (
                <NavLink to={"/dashboard/profilegroup"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                  <LiaLayerGroupSolid /> Grupo de perfiles
                </NavLink>
              ) : (
                <></>
              )}
            </li>
            <li>
              {["admin"].includes(role) ? (
                <NavLink to={"/dashboard/ads"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                  <CiBullhorn /> Anuncios
                </NavLink>
              ) : (
                <></>
              )}
            </li>
            <li>
              {["admin"].includes(role) ? (
                <NavLink to={"/dashboard/blacklistUrl"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                  <CiBoxList /> URL negra
                </NavLink>
              ) : (
                <></>
              )}
            </li>
            <li>
              {["admin"].includes(role) ? (
                <NavLink to={"/dashboard/blockedip"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                  <CiLollipop />
                  IP bloqueadas
                </NavLink>
              ) : (
                <></>
              )}
            </li>
            <li>
              {["admin"].includes(role) ? (
                <NavLink to={"/dashboard/history"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                  <FiUserX /> Usuario sospech
                </NavLink>
              ) : (
                <></>
              )}
            </li>
            <li>
              {["admin"].includes(role) ? (
                <NavLink to={"/dashboard/email_activity"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                  <TfiEmail /> Actividad email
                </NavLink>
              ) : (
                <></>
              )}
            </li>
            <li>
              {["admin"].includes(role) ? (
                <NavLink to={"/dashboard/api_activity"} className={({ isActive }) => (isActive ? "text-white bg-gray-950" : "")}>
                  <RxActivityLog /> Actividad API
                </NavLink>
              ) : (
                <></>
              )}
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
          {role == "admin" ? (
            <>
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
              <Route path="/email_activity" element={<EmailActivity />} />
              <Route path="/api_activity" element={<ApiActivity />} />
              <Route path="/assign_request" element={<AssignRequest />} />
            </>
          ) : (
            <>
              <Route path="/assign-product/:id" element={<Assign_shop />} />
              <Route path="/users" element={<Users />} />
              <Route path="*" element={<NotFound />} />
            </>
          )}
        </Routes>
      </section>
    </section>
  )
}

export default Dashboard
