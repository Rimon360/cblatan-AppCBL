import Login from "../compoenent/userLogin"
import NotFound from "../compoenent/404"
import Dashboard from "../compoenent/dashboard"
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import Register from "../compoenent/register"
import VerifyEmail from "../compoenent/VerifyEmail"
import VerifyOTP from "../compoenent/VerifyOTP"
import ChangeEmail from "../compoenent/ChangeEmail"
import ChangePassword from "../compoenent/ChangePassword"
import ConfirmEmail from "../compoenent/ConfirmEmail"
import ForgotPassword from "../compoenent/ForgotPassword"
import Supportchat from "../compoenent/Supportchat"
// import Register from "../compoenent/Register";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/change-email" element={<ChangeEmail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supportchat"
          element={
            <ProtectedRoute>
              <Supportchat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<NotFound />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default AppRoutes
