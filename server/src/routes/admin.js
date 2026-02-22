import express from "express";
import { verifyToken } from "../middlewares/authmid.js";
import { isAdmin } from "../middlewares/role.js";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controller/eventcontroller.js";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../controller/usercontroller.js";
import {
  getAllBookings,
  cancelBooking,
} from "../controller/bookingcontroller.js";

const router = express.Router();

router.use(verifyToken, isAdmin);

router.get("/dashboard", (req, res) => {
  res.json({ message: "Welcome Admin" });
});

// Event routes
router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

// User routes
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", updateUserRole);

// Booking routes
router.get("/bookings", getAllBookings);
router.put("/bookings/:id/cancel", cancelBooking);

export default router;