import express from "express";
import { getWeather, getWeatherByLocation } from "../controllers/weatherController.js";

const router = express.Router();

// GET /api/weather → lấy tất cả dữ liệu
router.get("/", getWeather);

// GET /api/weather/by-location?lat=...&lon=... → lấy theo tọa độ
router.get("/by-location", getWeatherByLocation);

export default router;
