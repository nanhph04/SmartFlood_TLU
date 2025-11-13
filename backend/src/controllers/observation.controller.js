import { createObservationEntity } from "../entities/FloodObservation.js";
import { io } from "../server.js";
import axios from "axios";
const ORION_LD_URL = process.env.ORION_LD_URL || 'http://localhost:1026/ngsi-ld/v1/entities';
// Lấy bản ghi cảm biến mới nhất của từng sensor từ Orion-LD
export const getLatestReadingForEachSensor = async (req, res) => {
    try {
        const response = await axios.get(`${ORION_LD_URL}?type=FloodObservation`, {
            headers: { 'Accept': 'application/ld+json' }
        });
        const all = response.data;
        const latestBySensor = {};
        for (const obs of all) {
            const sensorId = obs.refDevice?.object?.split(":").pop();
            if (!sensorId) continue;
            if (!latestBySensor[sensorId] || new Date(obs.observedAt?.value) > new Date(latestBySensor[sensorId].observedAt?.value)) {
                latestBySensor[sensorId] = obs;
            }
        }
        res.json(Object.values(latestBySensor));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Tạo bản ghi FloodObservation (Observation) lên Orion-LD
export const createReading = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: "Thiếu dữ liệu đầu vào hoặc sai định dạng JSON" });
        }
        // Optionally, check for required fields (e.g., sensorId, longitude, latitude)
        const { sensorId, longitude, latitude } = req.body;
        if (!sensorId || longitude === undefined || latitude === undefined) {
            return res.status(400).json({ error: "Thiếu trường bắt buộc: sensorId, longitude, latitude" });
        }
        const entity = createObservationEntity(req.body);
        await axios.post(ORION_LD_URL, entity, {
            headers: { 'Content-Type': 'application/ld+json' }
        });
        io.emit("sensor-update", entity);
        res.status(201).json(entity);
    } catch (err) {
        res.status(400).json({ error: "Không thể tạo dữ liệu quan sát", details: err.message });
    }
};

// Lấy danh sách FloodObservation từ Orion-LD
export const getReadings = async (req, res) => {
    try {
        const response = await axios.get(`${ORION_LD_URL}?type=FloodObservation`, {
            headers: { 'Accept': 'application/ld+json' }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Không thể lấy danh sách quan sát" });
    }
};

// Lấy các bản ghi FloodObservation theo sensorId từ Orion-LD
export const getReadingsBySensor = async (req, res) => {
    try {
        const { sensorId } = req.params;
        const response = await axios.get(`${ORION_LD_URL}?type=FloodObservation`, {
            headers: { 'Accept': 'application/ld+json' }
        });
        const all = response.data;
        const filtered = all.filter(obs => {
            const ref = obs.refDevice?.object;
            return ref && ref.endsWith(sensorId);
        }).sort((a, b) => new Date(b.observedAt?.value) - new Date(a.observedAt?.value)).slice(0, 10);
        res.json(filtered);
    } catch (err) {
        res.status(500).json({ error: "Không thể lấy dữ liệu cho cảm biến này" });
    }
};
