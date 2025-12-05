import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Shop_list from "../pages/Shop_list.jsx";
import User_list from "../pages/User_list.jsx";
import NotFound from "../pages/NotFound.jsx";
import UserLogin from "../pages/UserLogin.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/users_with_shop/:shop_id" element={<User_list />} />
        <Route path="/admin" element={<Login />} />
        <Route path="/userlogin/:user_id/:username" element={<UserLogin />} />
        <Route
          path="/Dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
