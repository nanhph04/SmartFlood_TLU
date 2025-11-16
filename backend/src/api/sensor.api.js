import express from "express";
import { createSensor, getAllSensors, getSensorsByStreet, exportSensorsNGSILD, getSensorById, updateSensor, getSensorDetail, seedSensor, seedAllSensors, deleteSensor } from "../controllers/sensor.controller.js";


const router = express.Router();

// Seed endpoints should be before "/:id" to avoid conflicts
router.post("/seed-all", seedAllSensors);
router.post("/:deviceId/seed", seedSensor);

router.post("/", createSensor);
router.get("/", getAllSensors);
router.get("/by-street", getSensorsByStreet);
router.get("/ngsi-ld", exportSensorsNGSILD);
router.get("/:id", getSensorById);
router.patch("/:id", updateSensor);
router.get("/detail/:id", getSensorDetail);
router.delete("/:id", deleteSensor);
export default router;
