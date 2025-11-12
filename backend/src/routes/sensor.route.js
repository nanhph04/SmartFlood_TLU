import express from "express";
import { createSensor, getAllSensors, getSensorsByStreet, exportSensorsNGSILD, getSensorById, updateSensor, getSensorDetail } from "../controllers/sensorController.js";

const router = express.Router();

// Tạo cảm biến mới
router.post("/", createSensor);

// Lấy toàn bộ cảm biến
router.get("/", getAllSensors);

// Lấy cảm biến theo tuyến đường
router.get("/by-street", getSensorsByStreet);

// Xuất dữ liệu NGSI-LD
router.get("/ngsi-ld", exportSensorsNGSILD);

// Lấy cảm biến theo id
router.get("/:id", getSensorById);

// Sửa thông tin cảm biến
router.put("/:id", updateSensor);

// Xem chi tiết cảm biến (có thể giống get by id, hoặc mở rộng sau)
router.get("/detail/:id", getSensorDetail);

export default router;
