import express from "express";
import { getLatestWeatherForAllAreas, updateWeatherForAllAreas } from "../controllers/weather.controller.js";

const router = express.Router();


router.get("/", getLatestWeatherForAllAreas);
router.post("/", updateWeatherForAllAreas);



export default router;
