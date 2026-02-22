import React, { useState } from "react";
import { useAuth } from "../../context/authcontext";
import api from "../../config/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/api/user/profile", form);
      const updatedUser = { ...user, name: res.data.name, email: res.data.email };
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters!");
    }
    setLoading(true);
    try {
      await api.put("/api/user/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your account details</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b">
          <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full mt-1 inline-block capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Profile Form */}
        {!editMode ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">👤</span>
              <div>
                <p className="text-xs text-gray-400 font-medium">Full Name</p>
                <p className="text-gray-800 font-semibold">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">📧</span>
              <div>
                <p className="text-xs text-gray-400 font-medium">Email</p>
                <p className="text-gray-800 font-semibold">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">🛡️</span>
              <div>
                <p className="text-xs text-gray-400 font-medium">Role</p>
                <p className="text-gray-800 font-semibold capitalize">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition mt-2"
            >
              Edit Profile 
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Full Name</label>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Email</label>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                placeholder="Your email"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setForm({ name: user?.name, email: user?.email });
                }}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Password Card */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-gray-800">Password</h3>
            <p className="text-gray-400 text-sm">Update your password</p>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-blue-500 text-sm font-semibold hover:underline"
          >
            {showPasswordForm ? "Cancel" : "Change Password"}
          </button>
        </div>

        {!showPasswordForm ? (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            {/* <span className="text-2xl"></span> */}
            <div>
              <p className="text-xs text-gray-400 font-medium">Password</p>
              <p className="text-gray-800 font-semibold tracking-widest">••••••••</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Current Password</label>
              <input
                required
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">New Password</label>
              <input
                required
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Confirm New Password</label>
              <input
                required
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                placeholder="Confirm new password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;