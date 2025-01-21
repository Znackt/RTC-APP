import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./lib/db.js";

import messageRoutes from "./model/message.model.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("api/message", messageRoutes);

app.listen(process.env.PORT, () => {
  console.log(`App is listening on PORT: ${process.env.PORT}`);
  connectDB();
});
