import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import messageRoutes from "./routes/message.route.js";
import authRoutes from "./routes/auth.route.js";
import { app, server } from "./lib/socket.io.js";

dotenv.config();

const __dirname = path.resolve();

app.use(express.json({ limit: '20mb', extended: true }));
app.use(express.urlencoded({ limit: '20mb' , extended: true }));
app.use(cookieParser());

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://rtc-app-mu.vercel.app",
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin); // Allow request if origin is in allowed list
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Manually set CORS headers for extra reliability
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Handle preflight requests
  }

  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  })
}
server.listen(process.env.PORT, async () => {
  console.log(`App is listening on PORT: ${process.env.PORT}`);
  await connectDB();
  console.log(`Visit This Site: http://localhost:${process.env.PORT}`);
});
