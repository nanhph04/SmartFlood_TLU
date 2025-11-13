import express from "express";
import { createSensor, getAllSensors, getSensorsByStreet, exportSensorsNGSILD, getSensorById, updateSensor, getSensorDetail } from "../controllers/sensor.controller.js";

const router = express.Router();

// RESTful routes cho sensor
router.post("/", createSensor); // Tạo mới
router.get("/", getAllSensors); // Lấy tất cả
router.get("/by-street", getSensorsByStreet); // Lọc theo tuyến đường
router.get("/ngsi-ld", exportSensorsNGSILD); // Xuất NGSI-LD
router.get("/:id", getSensorById); // Lấy theo id
router.patch("/:id", updateSensor); // Cập nhật (chuẩn REST)
router.delete("/:id", async (req, res) => { // Xóa sensor
    try {
        const { id } = req.params;
        await import('../controllers/sensor.controller.js').then(m => m.deleteSensor(req, res));
    } catch (err) {
        res.status(500).json({ error: 'Không xóa được sensor' });
    }
});
router.get("/detail/:id", getSensorDetail); // Xem chi tiết (nếu cần mở rộng)

export default router;
