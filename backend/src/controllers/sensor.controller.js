import axios from "axios";
import { createSensorEntity } from "../entities/FloodSensor.js";

const ORION_LD_URL = process.env.ORION_LD_URL || 'http://localhost:1026/ngsi-ld/v1/entities';

// Tạo cảm biến mới
export const createSensor = async (req, res) => {
    try {
        const entity = createSensorEntity(req.body);
        await axios.post(ORION_LD_URL, entity, {
            headers: { 'Content-Type': 'application/ld+json' }
        });
        res.status(201).json({ message: 'Đã tạo sensor trên Orion-LD' });
    } catch (err) {
        res.status(400).json({ error: 'Không tạo được sensor trên Orion-LD', detail: err.message });
    }
};

// Lấy cảm biến theo id
export const getSensorById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${ORION_LD_URL}/${id}`, {
            headers: { 'Accept': 'application/ld+json' }
        });
        res.json(response.data);
    } catch (err) {
        res.status(404).json({ error: 'Không tìm thấy sensor trên Orion-LD' });
    }
};

// Sửa thông tin cảm biến
export const updateSensor = async (req, res) => {
    try {
        const { id } = req.params;
        const attrs = req.body;
        await axios.patch(`${ORION_LD_URL}/${id}/attrs`, attrs, {
            headers: { 'Content-Type': 'application/ld+json' }
        });
        res.json({ message: 'Đã cập nhật sensor trên Orion-LD' });
    } catch (err) {
        res.status(400).json({ error: 'Không cập nhật được sensor trên Orion-LD' });
    }
};
// Xem chi tiết cảm biến (nếu cần mở rộng)
export const getSensorDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${ORION_LD_URL}/${id}`, {
            headers: { 'Accept': 'application/ld+json' }
        });
        res.json(response.data);
    } catch (err) {
        res.status(404).json({ error: 'Không tìm thấy sensor trên Orion-LD' });
    }
};

// Lấy toàn bộ cảm biến
export const getAllSensors = async (req, res) => {
    try {
        const response = await axios.get(ORION_LD_URL + '?type=FloodSensor', {
            headers: { 'Accept': 'application/ld+json' }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Không lấy được danh sách sensor' });
    }
};

// Lấy cảm biến theo tuyến đường (theo areaName)
export const getSensorsByStreet = async (req, res) => {
    try {
        const { street } = req.query;
        if (!street) return res.status(400).json({ error: "Missing street parameter" });
        const response = await axios.get(ORION_LD_URL + `?type=FloodSensor&q=areaName=="${encodeURIComponent(street)}"`, {
            headers: { 'Accept': 'application/ld+json' }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Không lấy được sensor theo tuyến đường' });
    }
};

// Xuất dữ liệu NGSI-LD (lấy toàn bộ sensor dạng NGSI-LD)
export const exportSensorsNGSILD = getAllSensors;
