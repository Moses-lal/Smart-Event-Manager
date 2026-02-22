import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import toast from "react-hot-toast";

const categoryColors = {
  music: "bg-pink-100 text-pink-600",
  tech: "bg-blue-100 text-blue-600",
  sports: "bg-green-100 text-green-600",
  food: "bg-yellow-100 text-yellow-600",
  art: "bg-purple-100 text-purple-600",
  other: "bg-gray-100 text-gray-600",
};

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/user/events");
      setEvents(res.data);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Browse Events</h2>
        <p className="text-gray-500 text-sm mt-1">{events.length} events available</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🎪</p>
          <p className="text-gray-500">No events available right now</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
            >
              {/* Color banner based on category */}
              <div className={`h-3 ${
                event.category === "music" ? "bg-pink-400" :
                event.category === "tech" ? "bg-blue-400" :
                event.category === "sports" ? "bg-green-400" :
                event.category === "food" ? "bg-yellow-400" :
                event.category === "art" ? "bg-purple-400" : "bg-gray-400"
              }`} />

              <div className="p-6">
                {/* Category + Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColors[event.category]}`}>
                    {event.category}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    event.status === "upcoming" ? "bg-blue-100 text-blue-600" :
                    event.status === "ongoing" ? "bg-green-100 text-green-600" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    {event.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-800 text-lg mb-3 line-clamp-1">
                  {event.title}
                </h3>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span>📍</span>
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span>📅</span>
                    <span>
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span>💺</span>
                    <span className={event.availableSeats === 0 ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
                      {event.availableSeats === 0 ? "Sold Out" : `${event.availableSeats} seats left`}
                    </span>
                  </div>
                </div>

                {/* Price + Book */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xl font-bold text-gray-800">
                    ₹{event.price}
                  </span>
                  <button
                    onClick={() => navigate(`/userdash/events/${event._id}`)}
                    disabled={event.availableSeats === 0 || event.status !== "upcoming"}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                      event.availableSeats === 0 || event.status !== "upcoming"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {event.availableSeats === 0 ? "Sold Out" : "Book Now →"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseEvents;