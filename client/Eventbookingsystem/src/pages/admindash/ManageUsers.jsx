import React, { useEffect, useState } from "react";
import api from "../../config/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authcontext";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      toast.success("User deleted!");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.put(`/api/admin/users/${id}/role`, { role: newRole });
      toast.success("Role updated!");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
          <p className="text-gray-500 text-sm mt-1">
            {users.length} total users
          </p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl p-10 text-center text-gray-400">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-gray-500 text-sm font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">
                          {user.name}
                          {user._id === currentUser?.id && (
                            <span className="ml-2 text-xs text-blue-500">(You)</span>
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 text-gray-500 text-sm">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={user._id === currentUser?.id}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-600 border-purple-200"
                            : "bg-green-50 text-green-600 border-green-200"
                        } ${user._id === currentUser?.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4 text-gray-500 text-sm">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={user._id === currentUser?.id}
                        className={`bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          user._id === currentUser?.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;