import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  seatNumbers: {
    type: [Number],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled"],
    default: "confirmed"
  }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);