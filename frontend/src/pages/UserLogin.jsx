import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from '../../axiosConfig';
import { Toaster, toast } from "react-hot-toast";
import { loginUrl } from "../routes/Url";

function UserLogin() {
  const { user_id, username } = useParams("");
  const [pin, setPIN] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!pin.trim()) {
      return toast.error("Fill all fields");
    }
    if (!username.trim()) {
      return toast.error("Username is not provided in the URL parameters.");
    }
    if (!user_id.trim()) {
      return toast.error("User id is not provided in the URL parameters.");
    }

    try {
      const response = await axios.post(loginUrl, { username, password: pin });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard/shops"); // Redirect to the dashboard with the user ID
      } else {
        toast.error("Credenciales inválidas");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something error happened");
      console.error("Something error happened:", err);
    }
  };

  return (
    <section className="login-section w-full h-screen flex items-center justify-center  from-blue-100 to-yellow-50 login">
      <div className="form w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg border border-blue-300">
        <h2 className="mb-6 text-center text-2xl font-semibold text-blue-400">PIN</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="number" value={pin} onChange={(e) => setPIN(e.target.value)} placeholder="Enter PIN" required className="w-full h-[60px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <button type="submit" className="w-full bg-blue-400 h-[60px] text-white py-2 rounded-lg hover:bg-blue-500 transition">
            SUBMIT
          </button>
        </form>
        <NavLink to={"/"} className="flex items-center justify-center mt-4 text-blue-500 hover:text-blue-600">
          <button type="submit" className="w-full   text-blue-400 py-2 rounded-lg hover:bg-blue-100 transition">
            Cancel
          </button>
        </NavLink>
      </div>
    </section>
  );
}

export default UserLogin;
