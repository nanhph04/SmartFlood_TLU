import express from "express";
import sensorApi from "./sensor.api.js";
import observationApi from "./observation.api.js";
import weatherApi from "./weather.api.js";
import areaApi from "./area.api.js";
import reportApi from "./report.api.js";
import authApi from "./auth.api.js";
import uploadApi from "./upload.api.js";

const router = express.Router();

router.use("/sensors", sensorApi);
router.use("/observations", observationApi);
router.use("/weather", weatherApi);
router.use("/areas", areaApi);
router.use("/reports", reportApi);
router.use("/auth", authApi);
router.use("/uploads", uploadApi);

export default router;
