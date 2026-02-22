import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authcontext";

const UserHome = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name || "User"} 👋
        </h2>
        <p className="text-gray-500 mt-1">Ready to book your next experience?</p>
      </div>

      {/* Quote Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-10 text-white text-center shadow-lg mb-8">
        <p className="text-4xl mb-4">🎟️</p>
        <h3 className="text-2xl font-bold mb-3">
          "Book tickets faster, experience more."
        </h3>
        <p className="text-blue-100 text-base mb-6">
          Discover amazing events near you and secure your spot in seconds.
          Don't miss out on the moments that matter.
        </p>
        <Link
          to="/userdash/events"
          className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition inline-block"
        >
          Browse Events →
        </Link>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/userdash/events"
            className="bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-blue-600 transition"
          >
            Browse Events 🎪
          </Link>
          <Link
            to="/userdash/mybookings"
            className="bg-green-500 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-green-600 transition"
          >
            My Bookings 🎟️
          </Link>
          <Link
            to="/userdash/profile"
            className="bg-purple-500 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-purple-600 transition"
          >
            Edit Profile 👤
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserHome;