import express from "express";
import { verifyToken } from "../middlewares/authmid.js";
import { createBooking, getMyBookings } from "../controllers/bookingcontroller.js";
import { getAllEvents, getEventById } from "../controllers/eventcontroller.js";
import { updateProfile, updatePassword } from "../controllers/usercontroller.js";

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