import express from "express";
import { verifyToken } from "../middlewares/authmid.js";
import { createBooking, getMyBookings } from "../controller/bookingcontroller.js";
import { getAllEvents, getEventById } from "../controller/eventcontroller.js";
import { updateProfile, updatePassword } from "../controller/usercontroller.js";

const router = express.Router();

router.use(verifyToken);

router.get("/dashboard", (req, res) => {
  res.json({ message: "Welcome User" });
});

// events
router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);

// bookings
router.post("/bookings", createBooking);
router.get("/mybookings", getMyBookings);

// profile
router.put("/profile", updateProfile);
router.put("/password", updatePassword);

export default router;