import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import toast from "react-hot-toast";

// ─── Zone Configuration ───────────────────────────────────────────────────────
// Seat layout: 42 seats total
// VIP:      Row A (seats 1–6)    — 6 seats
// Premium:  Rows B–C (7–18)      — 12 seats per zone row
// Standard: Rows D–F (19–42)     — 24 seats
const ZONES = [
  {
    id: "vip",
    label: "VIP",
    emoji: "👑",
    seats: [1, 2, 3, 4, 5, 6],
    rows: [{ label: "A", seats: [1, 2, 3, 4, 5, 6] }],
    multiplier: 2.5,
    color: "amber",
    bgFrom: "from-amber-50",
    border: "border-amber-300",
    seatAvail: "bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 hover:border-amber-500",
    seatSel: "bg-amber-500 border-amber-600 text-white scale-110 shadow-lg shadow-amber-300",
    seatBook: "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed",
    badge: "bg-amber-500 text-white",
    pill: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  {
    id: "premium",
    label: "Premium",
    emoji: "⭐",
    seats: Array.from({ length: 12 }, (_, i) => i + 7),
    rows: [
      { label: "B", seats: [7, 8, 9, 10, 11, 12] },
      { label: "C", seats: [13, 14, 15, 16, 17, 18] },
    ],
    multiplier: 1.5,
    color: "blue",
    bgFrom: "from-blue-50",
    border: "border-blue-300",
    seatAvail: "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200 hover:border-blue-500",
    seatSel: "bg-blue-500 border-blue-600 text-white scale-110 shadow-lg shadow-blue-300",
    seatBook: "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed",
    badge: "bg-blue-500 text-white",
    pill: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  {
    id: "standard",
    label: "Standard",
    emoji: "🎟️",
    seats: Array.from({ length: 24 }, (_, i) => i + 19),
    rows: [
      { label: "D", seats: [19, 20, 21, 22, 23, 24] },
      { label: "E", seats: [25, 26, 27, 28, 29, 30] },
      { label: "F", seats: [31, 32, 33, 34, 35, 36] },
      { label: "G", seats: [37, 38, 39, 40, 41, 42] },
    ],
    multiplier: 1,
    color: "emerald",
    bgFrom: "from-emerald-50",
    border: "border-emerald-300",
    seatAvail: "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-500",
    seatSel: "bg-emerald-500 border-emerald-600 text-white scale-110 shadow-lg shadow-emerald-300",
    seatBook: "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed",
    badge: "bg-emerald-500 text-white",
    pill: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getZoneForSeat = (seatNum) =>
  ZONES.find((z) => z.seats.includes(seatNum));

const getSeatPrice = (seatNum, basePrice) => {
  const zone = getZoneForSeat(seatNum);
  return zone ? Math.round(basePrice * zone.multiplier) : basePrice;
};

// ─── Component ────────────────────────────────────────────────────────────────
const BookEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [liveBookedSeats, setLiveBookedSeats] = useState([]);

  // ── Initial load ─────────────────────────────────────────────────────────
  const fetchEvent = useCallback(async () => {
    try {
      const res = await api.get(`/api/user/events/${id}`);
      setEvent(res.data);
      setLiveBookedSeats(res.data.bookedSeats || []);
      setLastUpdated(new Date());
    } catch (error) {
      toast.error("Failed to load event");
      navigate("/userdash/events");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  // ── Real-time polling every 10 seconds ───────────────────────────────────
  useEffect(() => {
    if (!event) return;
    const poll = setInterval(async () => {
      try {
        const res = await api.get(`/api/user/events/${id}`);
        const freshBooked = res.data.bookedSeats || [];
        setLiveBookedSeats(freshBooked);
        setLastUpdated(new Date());
        // Deselect any seats that just got booked by someone else
        setSelectedSeats((prev) => {
          const stolen = prev.filter((s) => freshBooked.includes(s));
          if (stolen.length > 0) {
            toast.error(`Seat(s) ${stolen.join(", ")} were just booked by someone else!`);
          }
          return prev.filter((s) => !freshBooked.includes(s));
        });
      } catch (_) {
        // silent fail for polling
      }
    }, 10000);
    return () => clearInterval(poll);
  }, [event, id]);

  // ── Seat interaction ─────────────────────────────────────────────────────
  const toggleSeat = (seatNum) => {
    if (liveBookedSeats.includes(seatNum)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatNum) ? prev.filter((s) => s !== seatNum) : [...prev, seatNum]
    );
  };

  const getSeatStatus = (seatNum) => {
    if (liveBookedSeats.includes(seatNum)) return "booked";
    if (selectedSeats.includes(seatNum)) return "selected";
    return "available";
  };

  // ── Booking ──────────────────────────────────────────────────────────────
  const handleBooking = async () => {
    if (selectedSeats.length === 0) return toast.error("Please select at least one seat!");
    setSubmitting(true);
    try {
      await api.post("/api/user/bookings", { eventId: id, seatNumbers: selectedSeats });
      toast.success("Booking confirmed! 🎉");
      navigate("/userdash/mybookings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
      // Refresh seats in case of conflict
      fetchEvent();
    } finally {
      setSubmitting(false);
    }
  };

  // ── Totals ────────────────────────────────────────────────────────────────
  const totalAmount = event
    ? selectedSeats.reduce((sum, s) => sum + getSeatPrice(s, event.price), 0)
    : 0;

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="max-w-3xl mx-auto pb-10"
    >
      {/* ── Event Header ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-5 border border-gray-100">
        <button
          onClick={() => navigate("/userdash/events")}
          className="text-blue-500 text-sm mb-4 flex items-center gap-1 hover:underline font-medium"
        >
          ← Back to Events
        </button>
        <h2
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          {event.title}
        </h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>📍 {event.location}</span>
          <span>
            📅{" "}
            {new Date(event.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Live indicator */}
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
            Live seat availability
          </span>
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
        </div>
      </div>

      {/* ── Screen ───────────────────────────────────────────────── */}
      <div className="relative mb-8">
        <div
          className="mx-auto rounded-xl py-2.5 text-center text-xs font-bold tracking-[0.2em] uppercase text-gray-400"
          style={{
            background: "linear-gradient(180deg,#e2e8f0 0%,#f8fafc 100%)",
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
            maxWidth: "70%",
          }}
        >
          🎭 &nbsp; S T A G E &nbsp;/&nbsp; S C R E E N &nbsp; 🎭
        </div>
        {/* perspective arc */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-4/5 h-6 border-b-0 border-2 border-gray-200 rounded-b-none"
          style={{ borderRadius: "0 0 50% 50%", borderTop: "none" }}
        />
      </div>

      {/* ── Zones ────────────────────────────────────────────────── */}
      <div className="space-y-4 mb-6">
        {ZONES.map((zone) => {
          const zoneAvail = zone.seats.filter((s) => !liveBookedSeats.includes(s)).length;
          const zonePrice = Math.round(event.price * zone.multiplier);

          return (
            <div
              key={zone.id}
              className={`bg-gradient-to-b ${zone.bgFrom} to-white rounded-2xl border ${zone.border} overflow-hidden`}
            >
              {/* Zone header */}
              <div className={`px-5 py-3 flex items-center justify-between border-b ${zone.border}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold px-3 py-0.5 rounded-full ${zone.badge}`}>
                    {zone.emoji} {zone.label}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${zone.pill}`}>
                    ₹{zonePrice} / seat
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {zoneAvail} of {zone.seats.length} available
                </span>
              </div>

              {/* Seats */}
              <div className="px-5 py-4 space-y-3">
                {zone.rows.map((row) => (
                  <div key={row.label} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 w-5 text-center">{row.label}</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {row.seats.map((seatNum) => {
                        const status = getSeatStatus(seatNum);
                        return (
                          <button
                            key={seatNum}
                            onClick={() => toggleSeat(seatNum)}
                            disabled={status === "booked"}
                            title={`Seat ${seatNum} — ${zone.label} — ₹${zonePrice}`}
                            className={`w-10 h-10 rounded-t-xl text-xs font-bold border-2 transition-all duration-150 relative ${
                              status === "booked"
                                ? zone.seatBook
                                : status === "selected"
                                ? zone.seatSel
                                : zone.seatAvail
                            }`}
                          >
                            {status === "booked" ? "✕" : seatNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Legend ───────────────────────────────────────────────── */}
      <div className="flex justify-center gap-6 mb-6">
        {[
          { cls: "bg-gray-100 border-gray-300", label: "Available" },
          { cls: "bg-blue-500 border-blue-600", label: "Selected" },
          { cls: "bg-gray-200 border-gray-300", label: "Booked" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded border-2 ${item.cls}`} />
            <span className="text-xs text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>

      {/* ── Booking Summary ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 text-base">Booking Summary</h3>

        {selectedSeats.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            ← Select seats above to continue
          </p>
        ) : (
          <div className="space-y-2.5">
            {/* Per-zone breakdown */}
            {ZONES.map((zone) => {
              const zoneSelected = selectedSeats.filter((s) => zone.seats.includes(s));
              if (zoneSelected.length === 0) return null;
              const zonePrice = Math.round(event.price * zone.multiplier);
              return (
                <div key={zone.id} className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {zone.emoji} {zone.label} × {zoneSelected.length}{" "}
                    <span className="text-gray-400 text-xs">(seats {zoneSelected.sort((a,b)=>a-b).join(", ")})</span>
                  </span>
                  <span className="font-medium text-gray-700">
                    ₹{(zoneSelected.length * zonePrice).toLocaleString()}
                  </span>
                </div>
              );
            })}

            <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
              <span>Total ({selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""})</span>
              <span className="text-xl text-blue-600">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleBooking}
          disabled={selectedSeats.length === 0 || submitting}
          className="w-full mt-5 bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          {submitting
            ? "Confirming..."
            : selectedSeats.length === 0
            ? "Select seats to book"
            : `Confirm Booking — ₹${totalAmount.toLocaleString()}`}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          🔒 Seats held for 5 minutes after selection
        </p>
      </div>
    </div>
  );
};

export default BookEvent;