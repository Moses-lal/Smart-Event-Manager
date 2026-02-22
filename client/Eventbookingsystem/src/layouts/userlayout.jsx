import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import toast from "react-hot-toast";

const UserLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out!");
    navigate("/login");
  };

  const links = [
    { to: "/userdash", label: "Dashboard", icon: "🏠" },
    { to: "/userdash/events", label: "Browse Events", icon: "🎪" },
    { to: "/userdash/mybookings", label: "My Bookings", icon: "🎟️" },
    { to: "/userdash/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className={`${collapsed ? "w-16" : "w-64"} bg-white shadow-lg transition-all duration-300 flex flex-col fixed h-full z-10`}>

        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <span className="font-bold text-blue-600 text-lg">🎟️ EventBook</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 ml-auto"
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
                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-500"
                }`
              }
            >
              <span className="text-xl">{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all"
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
          <h1 className="text-gray-700 font-semibold text-lg">User Dashboard</h1>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
            <span>👤</span>
            <span className="text-sm text-blue-600 font-medium">
              {user?.name || "User"}
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

export default UserLayout;