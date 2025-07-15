import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiUserAdd } from "react-icons/ti";
import axios from '../../axiosConfig';
import { Navigate, Link } from "react-router-dom";
import { registerURL, usersUrl } from "../routes/Url";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useGlobal } from "../context/GlobalStete";
const Users = () => {
  const [email, setEmail] = useState("");
  const [usageLimit, setUsageLimit] = useState(1);
  const [password, setPassword] = useState("");
  const [userrole, setRole] = useState("member");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { current_user } = useGlobal();
  const token = localStorage.getItem("token");
  const role = current_user.role;
  if (role !== "admin") {
    return <h1 className="text-center text-red-500 mt-20">
      You are not authorized to access this page
      <br />
      return to <Link to={"/"} className="text-blue-500">Home</Link>
    </h1>;
    // return <Navigate to={"/"} />;
  }
  useEffect(() => {
    axios
      .get(usersUrl + '/false', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(users.filter((user) =>
          user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.seq?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.ip_address?.toLowerCase().includes(searchTerm.toLowerCase())
        ));

      })
      .catch((error) => {
        toast.error(error.response.data?.message);
        console.error("Error fetching users:", error);
      });
  }, []);

  const openModal = (id, name) => {
    Swal.fire({
      title: "Are you sure to delete (" + name + ")",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(id);
      }
    });
  };

  const confirmDelete = async (id) => {
    try {
      const res = await fetch(`${usersUrl}/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data) {
        setUsers(users.filter((u) => u._id !== id));
      } else {
        toast.error("Failed to delete the uses");
      }
    } catch (err) {
      toast.error("Delete error", err);
      console.error("Delete error:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      toast.error("Email should not be empty");
      return;
    }
    if (usageLimit === "" || usageLimit < 1) {
      toast.error("usageLimit should not be empty");
      return;
    }
    if (password.length < 3) {
      toast.error("Password length should be >= 4");
      return;
    }

    axios
      .post(registerURL, {
        usageLimit,
        email,
        password,
        role: userrole,
      })
      .then((response) => {
        setEmail("");
        setUsageLimit(1);
        setPassword("");
        setUsers((prev) => [...prev, response.data.user]);
      })
      .catch((error) => {
        toast.error(error.response.data?.message);
        console.error("Error creating user:", error);
      });
  };

  useEffect(() => {
    setFilteredUsers(users.filter((user) => user?.email?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      user?.seq?.toString().includes(searchTerm.toLowerCase().trim()) ||
      user?.ip_address?.toLowerCase().includes(searchTerm.toLowerCase().trim())));
  }, [users, searchTerm]);

  return (
    <>
      <section className="users p-6">
        <form onSubmit={handleSubmit} className="useraction-container mb-6">
          <div className="flex gap-2">
            <label className="flex flex-col justify-between mb-2 w-full">
              Email/username:
              <input type="text" required placeholder="Enter user email address" value={email} onChange={(e) => setEmail(e.target.value.replace(' ', '_').toLowerCase())} />
            </label>
            <label className="flex flex-col justify-between mb-2 w-full">
              Password:
              <input required type="text" placeholder="Confirm password" value={password} onChange={(e) => setPassword(e.target.value.replace(' ', '_').toLowerCase())} />
            </label>
            {/* <label className="flex flex-col justify-between mb-2 w-full">
              Usags Limit:
              <input type="number" required placeholder="Enter user limit" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value.replace(' ', '_').toLowerCase())} />
            </label> */}

            <label className="flex flex-col justify-between mb-2 w-full">
              Role:
              <select className="px-4 w-full py-2 bg-gray-300 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none" value={userrole} onChange={(e) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
            </label>
          </div>
          <button type="submit" className="flex items-center gap-2 create-user mt-4 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
            Create user <TiUserAdd />
          </button>
        </form>
        <hr />

        <div className="users-container mt-6">
          <input type="search" placeholder="Search user" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 sticky top-0 mb-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <div className=" max-h-[300px] overflow-auto">
            <table className="w-full max-h-300 overflow-auto mt-4 text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">ID</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">IP address</th>
                  {/* <th className="p-2">Role</th> */}
                  {/* <th className="p-2">Usags Limit</th> */}
                  <th className="p-2">Created at</th>
                  <th className="p-2 text-center">Assign Password</th>
                  <th className="p-2 text-center">Del</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-100">
                      <td className="p-2">{user.seq}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.ip_address}</td>
                      {/* <td className="p-2">{user.role}</td> */}
                      {/* <td className="p-2">{user.usags_limit}</td> */}
                      <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="flex items-center justify-center">
                          <Link to={"/dashboard/assign-product/" + user._id} className="text-orange-300 hover:text-orange-500">
                            <FaExternalLinkAlt />
                          </Link>
                        </div>
                      </td>
                      <td className="p-2 flex justify-center">
                        {
                          user.role === "adminss" ? 'N/A' : (
                            <button onClick={() => openModal(user._id, user.email)} className="px-2 py-1 text-orange-400 rounded hover:bg-orange-200">
                              <RiDeleteBin6Line />
                            </button>
                          )
                        }
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      Empty
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default Users;
