import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authcontext";

const AdminHome = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Total Events", value: "24", icon: "🎪", color: "blue" },
    { label: "Total Bookings", value: "156", icon: "🎟️", color: "green" },
    { label: "Total Users", value: "89", icon: "👥", color: "purple" },
    { label: "Revenue", value: "₹45,200", icon: "💰", color: "yellow" },
  ];

  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name || "Admin"} 🛡️
        </h2>
        <p className="text-gray-500 mt-1">Here's your platform overview</p>
      </div>

<div className="text-2xl mx-auto mb-8 text-bold text-gray-700 bg-green-500/30 p-6 rounded-xl shadow-md shadow-black/10">
 Lets make managing your events and users super easy and efficient!
</div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admindash/events" className="bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-blue-600 transition">
            Manage Events 🎪
          </Link>
          <Link to="/admindash/bookings" className="bg-green-500 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-green-600 transition">
            View Bookings 🎟️
          </Link>
          <Link to="/admindash/users" className="bg-purple-500 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-purple-600 transition">
            Manage Users 👥
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;