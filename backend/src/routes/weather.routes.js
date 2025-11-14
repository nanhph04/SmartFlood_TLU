import express from "express";
import { getWeather, getWeatherByLocation, createWeather, getWeatherById, updateWeather, deleteWeather, getWeatherByArea } from "../controllers/weather.controller.js";
// GET /api/weather/area?areaName=... → lấy theo khu vực
router.get("/area", getWeatherByArea);

// GET /api/weather/:id → lấy theo id
router.get("/:id", getWeatherById);

// PATCH /api/weather/:id → cập nhật weather
router.patch("/:id", updateWeather);

// DELETE /api/weather/:id → xóa weather
router.delete("/:id", deleteWeather);

const router = express.Router();

// POST /api/weather → tạo mới bản ghi thời tiết và gửi lên Orion-LD
router.post("/", createWeather);

// GET /api/weather → lấy tất cả dữ liệu
router.get("/", getWeather);

// GET /api/weather/by-location?lat=...&lon=... → lấy theo tọa độ
router.get("/by-location", getWeatherByLocation);

export default router;
