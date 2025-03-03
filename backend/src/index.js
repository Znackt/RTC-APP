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
app.use(cors());

// Allowed origins
const whitelist = [
  "http://localhost:5173",
  "https://rtc-app-mu.vercel.app",
];

app.use(cors({
  origin: "*",
  credentials: true,
}));


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
