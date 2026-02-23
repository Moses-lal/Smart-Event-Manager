import express from "express";
import Event from "../models/events.js";

const router = express.Router();

router.get("/home", (req, res) => {
  res.json({ message: "Public Route" });
});

// Public events — no auth required
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find({ status: { $ne: "cancelled" } })
      .sort({ date: 1 })
      .select("-bookedSeats -createdBy");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;