import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import toast from "react-hot-toast";

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out!");
    navigate("/login");
  };

  const links = [
    { to: "/admindash", label: "Dashboard", icon: "📊" },
    { to: "/admindash/events", label: "Manage Events", icon: "🎪" },
    { to: "/admindash/bookings", label: "All Bookings", icon: "🎟️" },
    { to: "/admindash/users", label: "Manage Users", icon: "👥" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className={`${collapsed ? "w-16" : "w-64"} bg-gray-900 text-white transition-all duration-300 flex flex-col fixed h-full z-10`}>

        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!collapsed && (
            <span className="font-bold text-blue-400 text-lg">⚡ Admin Panel</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 ml-auto"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <span className="text-xl">{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-800 w-full transition-all"
          >
            <span className="text-xl">🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className={`flex-1 flex flex-col ${collapsed ? "ml-16" : "ml-64"} transition-all duration-300`}>

        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-gray-700 font-semibold text-lg">Admin Dashboard</h1>
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
            <span>🛡️</span>
            <span className="text-sm text-gray-700 font-medium">
              {user?.name || "Admin"}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;