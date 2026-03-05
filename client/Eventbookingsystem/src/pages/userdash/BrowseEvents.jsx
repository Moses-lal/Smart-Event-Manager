import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import toast from "react-hot-toast";

const categoryConfig = {
  music: { color: "bg-pink-500", pill: "bg-pink-100 text-pink-600", emoji: "🎵" },
  tech: { color: "bg-blue-500", pill: "bg-blue-100 text-blue-600", emoji: "💻" },
  sports: { color: "bg-green-500", pill: "bg-green-100 text-green-600", emoji: "⚽" },
  food: { color: "bg-amber-500", pill: "bg-amber-100 text-amber-700", emoji: "🍽️" },
  art: { color: "bg-purple-500", pill: "bg-purple-100 text-purple-600", emoji: "🎨" },
  other: { color: "bg-gray-400", pill: "bg-gray-100 text-gray-600", emoji: "🎪" },
};

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
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

  const categories = ["all", ...new Set(events.map((e) => e.category))];
  const filtered = filter === "all" ? events : events.filter((e) => e.category === filter);

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="min-h-screen bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="mb-8">
        <h2
          style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.5px" }}
          className="text-3xl font-bold text-gray-900"
        >
          Discover Events
        </h2>
        <p className="text-gray-400 text-sm mt-1">{filtered.length} experiences waiting for you</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all border ${
              filter === cat
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {cat !== "all" && categoryConfig[cat]?.emoji + " "}
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🎪</p>
          <p className="text-gray-400 font-medium">No events in this category yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((event) => {
            const cfg = categoryConfig[event.category] || categoryConfig.other;
            const soldOut = event.availableSeats === 0;
            const notUpcoming = event.status !== "upcoming";
            const disabled = soldOut || notUpcoming;
            const fillPct = event.totalSeats
              ? Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100)
              : 0;

            return (
              <div
                key={event._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {/* Top accent bar */}
                <div className={`h-1.5 w-full ${cfg.color}`} />

                <div className="p-5 flex flex-col flex-1">
                  {/* Category + Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${cfg.pill}`}>
                      {cfg.emoji} {event.category}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        event.status === "upcoming"
                          ? "bg-emerald-100 text-emerald-600"
                          : event.status === "ongoing"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {event.status === "upcoming" && "● "}
                      {event.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="font-bold text-gray-900 text-lg mb-3 line-clamp-1"
                  >
                    {event.title}
                  </h3>

                  {/* Meta */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span className="text-base">📍</span>
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span className="text-base">📅</span>
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
                  </div>

                  {/* Seat fill bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Seat availability</span>
                      <span className={soldOut ? "text-red-500 font-semibold" : "text-emerald-600 font-semibold"}>
                        {soldOut ? "Sold Out" : `${event.availableSeats} left`}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fillPct >= 90 ? "bg-red-400" : fillPct >= 60 ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Zones preview */}
                  <div className="flex gap-1.5 mb-4">
                    {["VIP", "Premium", "Standard"].map((zone) => (
                      <span key={zone} className="text-xs px-2 py-0.5 rounded border border-gray-200 text-gray-500 font-medium">
                        {zone}
                      </span>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-4 border-t mt-auto">
                    <div>
                      <p className="text-xs text-gray-400">Starting from</p>
                      <p className="text-xl font-bold text-gray-900">₹{event.price}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/userdash/events/${event._id}`)}
                      disabled={disabled}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        disabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : `${cfg.color} text-white hover:opacity-90 hover:scale-105 active:scale-95`
                      }`}
                    >
                      {soldOut ? "Sold Out" : notUpcoming ? "Unavailable" : "Book Seats →"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseEvents;