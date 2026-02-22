import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import connectdb from "./src/config/db.js";
import authRoutes from "./src/routes/authrouter.js";
import adminRoutes from "./src/routes/admin.js";
import userRoutes from "./src/routes/user.js";
import publicRoutes from "./src/routes/public.js";
import cors from "cors";

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// attach io to every request so controllers can use it
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/public", publicRoutes);

// Socket.IO events
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // join event room to get updates for specific event
  socket.on("join_event", (eventId) => {
    socket.join(eventId);
    console.log(`Socket ${socket.id} joined event room: ${eventId}`);
  });

  // leave event room
  socket.on("leave_event", (eventId) => {
    socket.leave(eventId);
    console.log(`Socket ${socket.id} left event room: ${eventId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
  connectdb();
});