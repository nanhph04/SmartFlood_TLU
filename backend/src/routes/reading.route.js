import express from "express";
import { createReading, getReadings, getReadingsBySensor, getLatestReadingForEachSensor } from "../controllers/readingSensorController.js";

const router = express.Router();


router.post("/", createReading);
router.get("/", getReadings);
router.get("/latest", getLatestReadingForEachSensor);
router.get("/:sensorId", getReadingsBySensor);

export default router;
