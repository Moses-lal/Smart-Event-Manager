import Booking from "../models/booking.js";
import Event from "../models/events.js";

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("event", "title date location price")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    await Event.findByIdAndUpdate(
      booking.event,
      {
        $inc: { availableSeats: booking.quantity },
        $pull: { bookedSeats: { $in: booking.seatNumbers } }
      }
    );

    const updatedEvent = await Event.findById(booking.event);

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    req.io.to(booking.event.toString()).emit("seats_updated", {
      bookedSeats: updatedEvent.bookedSeats,
      availableSeats: updatedEvent.availableSeats,
    });

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("event", "title date location price status")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { eventId, seatNumbers } = req.body;

    if (!eventId || !seatNumbers || seatNumbers.length === 0) {
      return res.status(400).json({ message: "Please select seats" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const alreadyBooked = seatNumbers.some((seat) =>
      event.bookedSeats.includes(seat)
    );
    if (alreadyBooked) {
      return res.status(400).json({
        message: "Some seats were just booked by someone else. Please reselect.",
      });
    }

    if (event.availableSeats < seatNumbers.length) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const totalPrice = seatNumbers.reduce((total, seat) => {
      if (seat <= 16) return total + event.price * 3;   // VIP
      if (seat <= 46) return total + event.price * 2;   // Premium
      return total + event.price;                        // Standard
    }, 0);

    const booking = await Booking.create({
      event: eventId,
      user: req.user.id,
      quantity: seatNumbers.length,
      seatNumbers,
      totalPrice,
    });

    await Event.findByIdAndUpdate(
      eventId,
      {
        $inc: { availableSeats: -seatNumbers.length },
        $push: { bookedSeats: { $each: seatNumbers } }
      }
    );

    const updatedEvent = await Event.findById(eventId);

    req.io.to(eventId).emit("seats_updated", {
      bookedSeats: updatedEvent.bookedSeats,
      availableSeats: updatedEvent.availableSeats,
    });

    res.status(201).json({ message: "Booking successful!", booking });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};