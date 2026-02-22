import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../config/api";

const categoryColors = {
  music: "bg-pink-900/30 border-pink-700 text-pink-400",
  tech: "bg-blue-900/30 border-blue-700 text-blue-400",
  sports: "bg-green-900/30 border-green-700 text-green-400",
  food: "bg-yellow-900/30 border-yellow-700 text-yellow-400",
  art: "bg-purple-900/30 border-purple-700 text-purple-400",
  other: "bg-gray-800 border-gray-600 text-gray-400",
};

const statusColors = {
  upcoming: "bg-blue-900/30 text-blue-400",
  ongoing: "bg-green-900/30 text-green-400",
  completed: "bg-gray-800 text-gray-500",
  cancelled: "bg-red-900/30 text-red-400",
};

const categories = ["all", "music", "tech", "sports", "food", "art", "other"];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let result = events;

    if (activeCategory !== "all") {
      result = result.filter((e) => e.category === activeCategory);
    }

    if (search.trim()) {
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [activeCategory, search, events]);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/public/events");
      setEvents(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">

      {/* Hero */}
      <section className="py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/20 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Explore <span className="text-blue-400">Events</span>
          </h1>
          <p className="text-gray-400 mb-8">
            Discover amazing events near you. Login to book your seats.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events or locations..."
              className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition border ${
                  activeCategory === cat
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {cat === "all" ? "🎪 All" :
                 cat === "music" ? "🎵 Music" :
                 cat === "tech" ? "💻 Tech" :
                 cat === "sports" ? "⚽ Sports" :
                 cat === "food" ? "🍕 Food" :
                 cat === "art" ? "🎨 Art" : "🎭 Other"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">

          {/* Count */}
          <p className="text-gray-500 text-sm mb-6">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""} found
          </p>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🎪</p>
              <p className="text-gray-400 text-lg font-semibold mb-2">
                No events found
              </p>
              <p className="text-gray-600 text-sm">
                Try a different category or search term
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <div
                  key={event._id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-700 transition group"
                >
                  {/* Top color bar */}
                  <div className={`h-1.5 ${
                    event.category === "music" ? "bg-pink-500" :
                    event.category === "tech" ? "bg-blue-500" :
                    event.category === "sports" ? "bg-green-500" :
                    event.category === "food" ? "bg-yellow-500" :
                    event.category === "art" ? "bg-purple-500" : "bg-gray-500"
                  }`} />

                  <div className="p-6">
                    {/* Category + Status */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${categoryColors[event.category]}`}>
                        {event.category}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[event.status]}`}>
                        {event.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-white text-lg mb-3 line-clamp-1 group-hover:text-blue-400 transition">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 mb-5">
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
                      <div className="flex items-center gap-2 text-sm">
                        <span>💺</span>
                        <span className={
                          event.availableSeats === 0
                            ? "text-red-400 font-semibold"
                            : "text-green-400 font-semibold"
                        }>
                          {event.availableSeats === 0
                            ? "Sold Out"
                            : `${event.availableSeats} seats left`}
                        </span>
                      </div>
                    </div>

                    {/* Price + Book */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div>
                        <p className="text-xs text-gray-600">Starting from</p>
                        <p className="text-xl font-black text-white">
                          ₹{event.price}
                        </p>
                      </div>
                      <Link
                        to="/login"
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                          event.availableSeats === 0 || event.status === "cancelled" || event.status === "completed"
                            ? "bg-gray-800 text-gray-500 cursor-not-allowed pointer-events-none"
                            : "bg-blue-600 hover:bg-blue-500 text-white"
                        }`}
                      >
                        {event.availableSeats === 0 ? "Sold Out" : "Login to Book →"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Login Banner */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl p-10 text-center">
          <p className="text-3xl mb-3">🎟️</p>
          <h2 className="text-2xl font-black text-white mb-3">
            Ready to Book Your Seats?
          </h2>
          <p className="text-gray-400 mb-6">
            Login or create a free account to pick your seats and confirm your booking instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition"
            >
              Create Free Account 
            </Link>
            <Link
              to="/login"
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-8 py-3 rounded-xl transition"
            >
              Login →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-white font-bold text-xl mb-2">🎟️ EventKroBook</p>
          <p className="text-gray-600 text-sm mb-6">
            India's Smartest Event Booking Platform
          </p>
          <div className="flex justify-center gap-6 text-sm mb-4">
            <Link to="/" className="text-gray-500 hover:text-white transition">Home</Link>
            <Link to="/about" className="text-gray-500 hover:text-white transition">About</Link>
            <Link to="/events" className="text-gray-500 hover:text-white transition">Events</Link>
            <Link to="/login" className="text-gray-500 hover:text-white transition">Login</Link>
          </div>
          <p className="text-xs text-gray-700">© 2025 EventBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Events;