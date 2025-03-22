import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5050/api" : "https://rtc-app-jhm2.vercel.app/api",
  withCredentials: true,
});
