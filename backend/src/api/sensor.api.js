import express from "express";
import { createSensor, getAllSensors, getSensorsByStreet, exportSensorsNGSILD, getSensorById, updateSensor, getSensorDetail } from "../controllers/sensor.controller.js";

const router = express.Router();

router.post("/", createSensor);
router.get("/", getAllSensors);
router.get("/by-street", getSensorsByStreet);
router.get("/ngsi-ld", exportSensorsNGSILD);
router.get("/:id", getSensorById);
router.patch("/:id", updateSensor);
router.get("/detail/:id", getSensorDetail);

export default router;
