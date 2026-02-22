import React, { useEffect, useState } from "react";
import api from "../../config/api";
import toast from "react-hot-toast";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/bookings");
      setBookings(res.data);
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.put(`/api/admin/bookings/${id}/cancel`);
      toast.success("Booking cancelled!");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Bookings</h2>
          <p className="text-gray-500 text-sm mt-1">
            {bookings.length} total bookings
          </p>
        </div>
        {/* Revenue */}
        <div className="bg-green-50 border border-green-100 px-5 py-3 rounded-xl">
          <p className="text-green-600 text-xs font-medium">Total Revenue</p>
          <p className="text-green-700 text-xl font-bold">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl p-10 text-center text-gray-400">
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center">
          <p className="text-4xl mb-3">🎟️</p>
          <p className="text-gray-500">No bookings yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["User", "Event", "Date", "Qty", "Total", "Status", "Action"].map((h) => (
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
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition">
                    {/* User */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800 text-sm">
                        {booking.user?.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {booking.user?.email}
                      </p>
                    </td>

                    {/* Event */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800 text-sm max-w-xs truncate">
                        {booking.event?.title}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {booking.event?.location}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-gray-500 text-sm">
                      {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Qty */}
                    <td className="px-5 py-4 text-gray-700 font-medium text-sm">
                      {booking.quantity}
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4 text-gray-800 font-semibold text-sm">
                      ₹{booking.totalPrice?.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      {booking.status === "confirmed" ? (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
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

export default AllBookings;