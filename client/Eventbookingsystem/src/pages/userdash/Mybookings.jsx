import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../config/api";
import toast from "react-hot-toast";

const statusColors = {
  confirmed: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-500",
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/user/mybookings");
      setBookings(res.data);
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Bookings</h2>
          <p className="text-gray-500 text-sm mt-1">
            {bookings.length} total bookings
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 px-5 py-3 rounded-xl">
          <p className="text-blue-500 text-xs font-medium">Total Spent</p>
          <p className="text-blue-700 text-xl font-bold">
            ₹{totalSpent.toLocaleString()}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
          <p className="text-5xl mb-4">🎟️</p>
          <h3 className="font-bold text-gray-700 text-lg mb-2">No bookings yet</h3>
          <p className="text-gray-400 text-sm mb-6">
            You haven't booked any events yet
          </p>
          {/* ✅ fixed - using Link instead of broken <a> tag */}
          <Link
            to="/userdash/events"
            className="bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 transition"
          >
            Browse Events →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {booking.event?.title}
                    </h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">📍 Location</p>
                      <p className="text-sm font-medium text-gray-700">
                        {booking.event?.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">📅 Event Date</p>
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(booking.event?.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">🎫 Booked On</p>
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">💰 Total Paid</p>
                      <p className="text-sm font-bold text-blue-600">
                        ₹{booking.totalPrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Seat Numbers */}
                  <div className="mt-4">
                    <p className="text-xs text-gray-400 mb-2">💺 Your Seats</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.seatNumbers?.sort((a, b) => a - b).map((seat) => {
                        const isVip = seat <= 16;
                        const isPremium = seat >= 17 && seat <= 46;
                        return (
                          <span
                            key={seat}
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                              isVip
                                ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                                : isPremium
                                ? "bg-purple-50 border-purple-300 text-purple-700"
                                : "bg-blue-50 border-blue-300 text-blue-700"
                            }`}
                          >
                            {isVip ? "👑" : isPremium ? "⭐" : "🎟️"} {seat}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Booking ID */}
                <div className="text-right">
                  <p className="text-xs text-gray-400">Booking ID</p>
                  <p className="text-xs font-mono text-gray-500 mt-0.5">
                    #{booking._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;