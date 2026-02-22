import React, { useEffect, useState } from "react";
import api from "../../config/api";
import toast from "react-hot-toast";

const initialForm = {
  title: "",
  description: "",
  location: "",
  date: "",
  price: "",
  totalSeats: "",
  category: "other",
  status: "upcoming",
};

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/events");
      setEvents(res.data);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    setForm(initialForm);
    setEditingEvent(null);
    setShowModal(true);
  };

  const openEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      location: event.location,
      date: new Date(event.date).toISOString().slice(0, 16),
      price: event.price,
      totalSeats: event.totalSeats,
      category: event.category,
      status: event.status,
    });
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingEvent) {
        await api.put(`/api/admin/events/${editingEvent._id}`, form);
        toast.success("Event updated successfully!");
      } else {
        await api.post("/api/admin/events", form);
        toast.success("Event created successfully!");
      }
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/api/admin/events/${id}`);
      toast.success("Event deleted!");
      fetchEvents();
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const categoryColors = {
    music: "bg-pink-100 text-pink-600",
    tech: "bg-blue-100 text-blue-600",
    sports: "bg-green-100 text-green-600",
    food: "bg-yellow-100 text-yellow-600",
    art: "bg-purple-100 text-purple-600",
    other: "bg-gray-100 text-gray-600",
  };

  const statusColors = {
    upcoming: "bg-blue-100 text-blue-600",
    ongoing: "bg-green-100 text-green-600",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Events</h2>
          <p className="text-gray-500 text-sm mt-1">
            {events.length} total events
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-500 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition font-medium"
        >
          + Create Event
        </button>
      </div>

      {/* Events Table */}
      {loading ? (
        <div className="bg-white rounded-xl p-10 text-center text-gray-400">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center">
          <p className="text-4xl mb-3">🎪</p>
          <p className="text-gray-500">No events yet. Create your first event!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Title", "Date", "Location", "Price", "Seats", "Category", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-gray-500 text-sm font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-medium text-gray-800 max-w-xs">
                      <p className="truncate">{event.title}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-sm">
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-sm">
                      {event.location}
                    </td>
                    <td className="px-5 py-4 text-gray-700 font-medium">
                      ₹{event.price}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <span className={`font-medium ${event.availableSeats === 0 ? "text-red-500" : "text-green-600"}`}>
                        {event.availableSeats}/{event.totalSeats}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColors[event.category]}`}>
                        {event.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[event.status]}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(event)}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {editingEvent ? "Edit Event" : "Create New Event"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Title *</label>
                <input
                  required
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Event title"
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">Description *</label>
                <textarea
                  required
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Event description"
                  rows={3}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">Location *</label>
                <input
                  required
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Event location"
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">Date & Time *</label>
                <input
                  required
                  type="datetime-local"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Price (₹) *</label>
                  <input
                    required
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Total Seats *</label>
                  <input
                    required
                    type="number"
                    name="totalSeats"
                    value={form.totalSeats}
                    onChange={handleChange}
                    placeholder="0"
                    min="1"
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  >
                    {["music", "tech", "sports", "food", "art", "other"].map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  >
                    {["upcoming", "ongoing", "completed", "cancelled"].map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition font-medium disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;