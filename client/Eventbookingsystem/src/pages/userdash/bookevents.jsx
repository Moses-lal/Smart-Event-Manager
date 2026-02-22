import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import socket from "../socket";
import toast from "react-hot-toast";

const ZONES = [
  {
    name: "VIP",
    icon: "👑",
    rows: 2,
    seatsPerRow: 8,
    startSeat: 1,
    price: 3,
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    label: "bg-yellow-100 text-yellow-700",
    selectedBg: "bg-yellow-500 border-yellow-500 text-white",
    availableBg: "bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-200",
  },
  {
    name: "Premium",
    icon: "⭐",
    rows: 3,
    seatsPerRow: 10,
    startSeat: 17,
    price: 2,
    bg: "bg-purple-50",
    border: "border-purple-300",
    label: "bg-purple-100 text-purple-700",
    selectedBg: "bg-purple-500 border-purple-500 text-white",
    availableBg: "bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-200",
  },
  {
    name: "Standard",
    icon: "🎟️",
    rows: 5,
    seatsPerRow: 12,
    startSeat: 47,
    price: 1,
    bg: "bg-blue-50",
    border: "border-blue-300",
    label: "bg-blue-100 text-blue-700",
    selectedBg: "bg-blue-500 border-blue-500 text-white",
    availableBg: "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-200",
  },
];

const BookEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [liveUpdate, setLiveUpdate] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      const res = await api.get(`/api/user/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      toast.error("Failed to load event");
      navigate("/userdash/events");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchEvent();

    // join socket room for this event
    socket.emit("join_event", id);

    // listen for real-time seat updates
    socket.on("seats_updated", (data) => {
      setEvent((prev) => prev ? {
        ...prev,
        bookedSeats: data.bookedSeats,
        availableSeats: data.availableSeats,
      } : prev);

      // flash live update indicator
      setLiveUpdate(true);
      setTimeout(() => setLiveUpdate(false), 2000);

      // remove any selected seats that just got booked
      setSelectedSeats((prev) =>
        prev.filter((seat) => !data.bookedSeats.includes(seat))
      );
    });

    return () => {
      socket.emit("leave_event", id);
      socket.off("seats_updated");
    };
  }, [id, fetchEvent]);

  const toggleSeat = (seatNum) => {
    if (event.bookedSeats.includes(seatNum)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatNum)
        ? prev.filter((s) => s !== seatNum)
        : [...prev, seatNum]
    );
  };

  const getSeatStatus = (seatNum) => {
    if (event.bookedSeats.includes(seatNum)) return "booked";
    if (selectedSeats.includes(seatNum)) return "selected";
    return "available";
  };

  const getZoneForSeat = (seatNum) => {
    for (const zone of ZONES) {
      const end = zone.startSeat + zone.rows * zone.seatsPerRow - 1;
      if (seatNum >= zone.startSeat && seatNum <= end) return zone;
    }
    return ZONES[2];
  };

  const getTotalPrice = () =>
    selectedSeats.reduce((total, seat) => {
      const zone = getZoneForSeat(seat);
      return total + event.price * zone.price;
    }, 0);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      return toast.error("Please select at least one seat!");
    }
    setSubmitting(true);
    try {
      await api.post("/api/user/bookings", {
        eventId: id,
        seatNumbers: selectedSeats,
      });
      toast.success("Booking confirmed! 🎉");
      navigate("/userdash/mybookings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
      fetchEvent();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading seats...</p>
      </div>
    </div>
  );

  const bookedCount = event.bookedSeats.length;
  const totalSeats = event.totalSeats;
  const availableCount = event.availableSeats;

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-10">

      {/* Event Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <button
          onClick={() => navigate("/userdash/events")}
          className="text-blue-500 text-sm mb-4 flex items-center gap-1 hover:underline"
        >
          ← Back to Events
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>📍 {event.location}</span>
              <span>📅 {new Date(event.date).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit"
              })}</span>
              <span>💰 Base: ₹{event.price}</span>
            </div>
          </div>

          {/* Live Stats */}
          <div className="flex gap-3">
            <div className="text-center bg-green-50 px-4 py-2 rounded-xl">
              <p className="text-green-600 font-bold text-xl">{availableCount}</p>
              <p className="text-green-500 text-xs">Available</p>
            </div>
            <div className="text-center bg-red-50 px-4 py-2 rounded-xl">
              <p className="text-red-500 font-bold text-xl">{bookedCount}</p>
              <p className="text-red-400 text-xs">Booked</p>
            </div>
            <div className="text-center bg-gray-50 px-4 py-2 rounded-xl">
              <p className="text-gray-700 font-bold text-xl">{totalSeats}</p>
              <p className="text-gray-400 text-xs">Total</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Seat availability</span>
            <span>{Math.round((availableCount / totalSeats) * 100)}% available</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full transition-all duration-700"
              style={{ width: `${(availableCount / totalSeats) * 100}%` }}
            />
          </div>
        </div>

        {/* WebSocket live indicator */}
        <div className="flex items-center gap-2 mt-3">
          <div className={`w-2 h-2 rounded-full ${liveUpdate ? "bg-yellow-400 scale-125" : "bg-green-400"} animate-pulse transition-all`} />
          <span className="text-xs text-gray-400">
            {liveUpdate ? "⚡ Seat map just updated!" : "Live — real-time seat updates via WebSocket"}
          </span>
        </div>
      </div>

      {/* Zone Pricing */}
      <div className="grid grid-cols-3 gap-3">
        {ZONES.map((zone) => (
          <div key={zone.name} className={`${zone.bg} border-2 ${zone.border} rounded-xl p-4 text-center`}>
            <p className="text-2xl mb-1">{zone.icon}</p>
            <p className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-2 ${zone.label}`}>
              {zone.name}
            </p>
            <p className="text-gray-800 font-bold">₹{event.price * zone.price}</p>
            <p className="text-gray-400 text-xs">per seat</p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { color: "bg-gray-100 border-gray-300", label: "Available" },
            { color: "bg-blue-500 border-blue-500", label: "Selected" },
            { color: "bg-red-400 border-red-400", label: "Booked" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-t-lg border-2 ${item.color}`} />
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Map */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Screen */}
        <div className="relative mb-10">
          <div className="bg-gradient-to-b from-gray-700 to-gray-900 text-white text-center py-3 rounded-xl text-sm font-bold tracking-widest shadow-lg">
            🎭 STAGE / SCREEN
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-gray-400 opacity-20 blur-md rounded-full" />
        </div>

        <div className="space-y-8">
          {ZONES.map((zone) => {
            const zoneSeats = Array.from(
              { length: zone.rows * zone.seatsPerRow },
              (_, i) => zone.startSeat + i
            );
            const zoneRows = [];
            for (let i = 0; i < zoneSeats.length; i += zone.seatsPerRow) {
              zoneRows.push(zoneSeats.slice(i, i + zone.seatsPerRow));
            }
            const zoneBooked = zoneSeats.filter(s => event.bookedSeats.includes(s)).length;
            const zoneAvailable = zoneSeats.length - zoneBooked;

            return (
              <div key={zone.name} className={`border-2 ${zone.border} rounded-2xl p-5 ${zone.bg}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{zone.icon}</span>
                    <span className={`font-bold text-sm px-3 py-1 rounded-full ${zone.label}`}>
                      {zone.name} Zone
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-green-600 font-semibold">{zoneAvailable} available</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-red-400 font-semibold">{zoneBooked} booked</span>
                    <span className="text-gray-300">|</span>
                    <span className="font-bold text-gray-700">₹{event.price * zone.price}/seat</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {zoneRows.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex justify-center gap-1.5 items-center">
                      <span className="text-xs text-gray-400 w-5 text-right font-mono">
                        {String.fromCharCode(65 + rowIdx)}
                      </span>
                      {row.map((seatNum) => {
                        const status = getSeatStatus(seatNum);
                        return (
                          <button
                            key={seatNum}
                            onClick={() => toggleSeat(seatNum)}
                            disabled={status === "booked"}
                            title={`Seat ${seatNum} — ₹${event.price * zone.price}`}
                            className={`w-8 h-8 rounded-t-lg text-xs font-semibold border-2 transition-all duration-150 ${
                              status === "booked"
                                ? "bg-red-400 border-red-400 text-white cursor-not-allowed"
                                : status === "selected"
                                ? `${zone.selectedBg} scale-110 shadow-md`
                                : zone.availableBg
                            }`}
                          >
                            {status === "booked" ? "✕" : status === "selected" ? "✓" : seatNum}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bg-white rounded-2xl shadow-sm p-6 sticky bottom-4 border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4">Booking Summary</h3>

        {selectedSeats.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-2">
            👆 Click seats above to select them
          </p>
        ) : (
          <div className="space-y-2 mb-4">
            {ZONES.map((zone) => {
              const zoneSelected = selectedSeats.filter((s) => {
                const end = zone.startSeat + zone.rows * zone.seatsPerRow - 1;
                return s >= zone.startSeat && s <= end;
              });
              if (zoneSelected.length === 0) return null;
              return (
                <div key={zone.name} className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {zone.icon} {zone.name} × {zoneSelected.length} seats
                    <span className="text-gray-300 ml-2 text-xs">
                      [{zoneSelected.sort((a, b) => a - b).join(", ")}]
                    </span>
                  </span>
                  <span className="font-semibold text-gray-700">
                    ₹{(event.price * zone.price * zoneSelected.length).toLocaleString()}
                  </span>
                </div>
              );
            })}
            <div className="border-t pt-3 flex justify-between font-bold text-gray-800 text-lg">
              <span>Total ({selectedSeats.length} seats)</span>
              <span className="text-blue-600">₹{getTotalPrice().toLocaleString()}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleBooking}
          disabled={selectedSeats.length === 0 || submitting}
          className="w-full bg-blue-500 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Confirming...
            </>
          ) : selectedSeats.length > 0 ? (
            `Confirm Booking — ₹${getTotalPrice().toLocaleString()}`
          ) : (
            "Select seats to continue"
          )}
        </button>
      </div>
    </div>
  );
};

export default BookEvent;