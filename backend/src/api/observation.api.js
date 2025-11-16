import express from "express";
import { createReading, getReadings, getReadingsBySensor, getLatestSensorStatus } from "../controllers/observation.controller.js";

const router = express.Router();



router.post("/", createReading);
router.get("/", getReadings);
router.get("/sensor-status", getLatestSensorStatus); // API mới: lấy trạng thái sensor đã làm phẳng, dùng cho FE
router.get("/:sensorId", getReadingsBySensor);

export default router;
