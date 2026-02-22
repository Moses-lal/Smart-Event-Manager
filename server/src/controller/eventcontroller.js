import Event from "../models/events.js";

// GET all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET single event
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// CREATE event
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      date,
      price,
      totalSeats,
      category,
      status
    } = req.body;

    if (!title || !description || !location || !date || !price || !totalSeats) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.create({
      title,
      description,
      location,
      date,
      price,
      totalSeats,
      availableSeats: totalSeats, // initially same as totalSeats
      category,
      status,
      createdBy: req.user.id
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.status(200).json({ message: "Event updated successfully", event: updated });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};