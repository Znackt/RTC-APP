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

app.use(cors());
app.use(express.json({ limit: '20mb', extended: true }));
app.use(express.urlencoded({ limit: '20mb' , extended: true }));
app.use(cookieParser());

// // Allowed origins
// const whitelist = [
//   "http://localhost:5173",
//   "https://rtc-app-mu.vercel.app",
// ];

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}
const handler = (req, res) => {
  const d = new Date()
  res.end(d.toString())
}
module.exports = allowCors(handler)

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
