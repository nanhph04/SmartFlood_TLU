import { createObservationEntity } from "../entities/FloodObservation.js";
import { io } from "../server.js";
import axios from "axios";
const ORION_LD_URL = process.env.ORION_LD_URL || 'http://localhost:1026/ngsi-ld/v1/entities';
import { createSensorEntity } from "../entities/FloodSensor.js";

// Hàm cập nhật trạng thái mới nhất vào FloodSensor
export const updateFloodSensorStatus = async (reading) => {
    try {
        // Lấy sensorId từ reading
        let sensorId = reading.refDevice?.object;
        if (!sensorId) return;
        // Chuẩn bị các trường cần cập nhật
        const attrs = {
            waterLevel: { type: "Property", value: reading.waterLevel?.value },
            batteryLevel: { type: "Property", value: reading.batteryLevel?.value },
            status: { type: "Property", value: reading.status?.value },
            lastReadingAt: { type: "Property", value: reading.observedAt?.value || reading["https://uri.etsi.org/ngsi-ld/observedAt"]?.value }
        };
        // Xóa các field undefined
        Object.keys(attrs).forEach(k => (attrs[k].value === undefined || attrs[k].value === null) && delete attrs[k]);
        if (Object.keys(attrs).length === 0) return;
        // PATCH cập nhật thuộc tính sensor
        await axios.patch(`${ORION_LD_URL}/${sensorId}/attrs`, attrs, {
            headers: { 'Content-Type': 'application/ld+json' }
        });
    } catch (err) {
        // Log lỗi nhưng không throw để không ảnh hưởng flow chính
        console.error("Lỗi cập nhật FloodSensor:", err.message);
    }
};
// Lấy bản ghi cảm biến mới nhất của từng sensor từ Orion-LD
export const getLatestReadingForEachSensor = async (req, res) => {
    try {
        const response = await axios.get(`${ORION_LD_URL}?type=FloodObservation&limit=1000`, {
            headers: { 'Accept': 'application/ld+json' }
        });
        const all = response.data;
        const latestBySensor = {};
        for (const obs of all) {
            const sensorId = obs.refDevice?.object?.split(":").pop();
            if (!sensorId) continue;
            // Lấy observedAt từ cả short key và IRI
            const getObservedAt = o => o.observedAt?.value || o["https://uri.etsi.org/ngsi-ld/observedAt"]?.value;
            const obsTime = getObservedAt(obs);
            const prevTime = getObservedAt(latestBySensor[sensorId]);
            if (!latestBySensor[sensorId] || (obsTime && prevTime && new Date(obsTime) > new Date(prevTime)) || (obsTime && !prevTime)) {
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
        // Cập nhật trạng thái mới nhất vào FloodSensor
        updateFloodSensorStatus(entity);
        io.emit("sensor-update", entity);
        res.status(201).json(entity);
    } catch (err) {
        res.status(400).json({ error: "Không thể tạo dữ liệu quan sát", details: err.message });
    }
};

// Lấy danh sách FloodObservation từ Orion-LD
export const getReadings = async (req, res) => {
    try {
        const response = await axios.get(`${ORION_LD_URL}?type=FloodObservation&limit=1000`, {
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
        const response = await axios.get(`${ORION_LD_URL}?type=FloodObservation&limit=1000`, {
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
