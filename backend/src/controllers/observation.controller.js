
import { createObservationEntity } from "../entities/FloodObservation.js";
import { io } from "../server.js";
import axios from "axios";

const ORION_LD_URL = process.env.ORION_LD_URL || 'http://localhost:1026/ngsi-ld/v1/entities';

// Cập nhật trạng thái mới nhất cho FloodSensor dựa trên bản ghi Observation
export const updateFloodSensorStatus = async (observation) => {
    try {
        // Lấy sensorId từ trường refDevice.object
        const sensorId = observation.refDevice?.object;
        if (!sensorId) return;

        // Tạo object các thuộc tính cần cập nhật
        const attrs = {};
        if (observation.waterLevel?.value !== undefined) {
            attrs.waterLevel = { type: "Property", value: observation.waterLevel.value };
        }
        if (observation.batteryLevel?.value !== undefined) {
            attrs.batteryLevel = { type: "Property", value: observation.batteryLevel.value };
        }
        if (observation.status?.value !== undefined) {
            attrs.status = { type: "Property", value: observation.status.value };
        }
        // Ưu tiên lấy observedAt chuẩn, nếu không có thì lấy observedAt dạng full URI
        const observedAt = observation.observedAt?.value || observation["https://uri.etsi.org/ngsi-ld/observedAt"]?.value;
        if (observedAt) {
            attrs.lastReadingAt = { type: "Property", value: observedAt };
        }
        if (Object.keys(attrs).length === 0) return;

        // Gửi PATCH cập nhật lên Orion-LD
        await axios.patch(`${ORION_LD_URL}/${sensorId}/attrs`, attrs, {
            headers: { 'Content-Type': 'application/ld+json' }
        });
    } catch (err) {
        // Log lỗi nhưng không throw để không ảnh hưởng flow chính
        console.error("[updateFloodSensorStatus] Lỗi cập nhật FloodSensor:", err.message);
    }
};
// Lấy trạng thái mới nhất của tất cả sensor (dạng đã làm phẳng, dễ dùng cho FE)
export const getLatestSensorStatus = async (req, res) => {
    try {
        const response = await axios.get(`${ORION_LD_URL}?type=FloodSensor`, {
            headers: { 'Accept': 'application/ld+json' }
        });
        // Làm phẳng thuộc tính Property/GeoProperty cho dễ dùng
        const flattenSensor = (sensor) => {
            const flat = { id: sensor.id, type: sensor.type };
            for (const [k, v] of Object.entries(sensor)) {
                if (k === "@context" || k === "id" || k === "type") continue;
                let key = k;
                if (k.startsWith("https://") || k.startsWith("http://")) {
                    key = k.split("/").pop().split("#").pop();
                }
                if (v && v.type === "Property") {
                    flat[key] = v.value;
                } else if (v && v.type === "GeoProperty" && v.value) {
                    flat[key] = v.value;
                } else {
                    flat[key] = v;
                }
            }
            return flat;
        };
        const data = Array.isArray(response.data) ? response.data.map(flattenSensor) : [];
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Không thể lấy trạng thái sensor", details: err.message });
    }
};

// Tạo bản ghi FloodObservation mới lên Orion-LD
export const createReading = async (req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: "Thiếu dữ liệu đầu vào hoặc sai định dạng JSON" });
        }
        // Kiểm tra các trường bắt buộc
        const { sensorId, longitude, latitude } = req.body;
        if (!sensorId || longitude === undefined || latitude === undefined) {
            return res.status(400).json({ error: "Thiếu trường bắt buộc: sensorId, longitude, latitude" });
        }

        // Tạo entity Observation chuẩn NGSI-LD
        const observationEntity = createObservationEntity(req.body);
        // Gửi POST lên Orion-LD
        await axios.post(ORION_LD_URL, observationEntity, {
            headers: { 'Content-Type': 'application/ld+json' }
        });

        // Cập nhật trạng thái mới nhất cho sensor liên quan
        await updateFloodSensorStatus(observationEntity);

        // Gửi realtime tới client qua socket.io
        io.emit("sensor-update", observationEntity);

        res.status(201).json(observationEntity);
    } catch (err) {
        res.status(400).json({ error: "Không thể tạo dữ liệu quan sát", details: err.message });
    }
};

// Lấy danh sách 1000 bản ghi FloodObservation từ Orion-LD
export const getReadings = async (req, res) => {
    try {
        const response = await axios.get(`${ORION_LD_URL}?type=FloodObservation&limit=1000`, {
            headers: { 'Accept': 'application/ld+json' }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Không thể lấy danh sách quan sát", details: err.message });
    }
};

// Lấy tối đa 10 bản ghi FloodObservation mới nhất theo sensorId
export const getReadingsBySensor = async (req, res) => {
    try {
        const { sensorId } = req.params;
        const response = await axios.get(`${ORION_LD_URL}?type=FloodObservation&limit=1000`, {
            headers: { 'Accept': 'application/ld+json' }
        });
        const allObservations = response.data;
        // Lọc các bản ghi có refDevice.object kết thúc bằng sensorId
        const filtered = allObservations.filter(obs => {
            const ref = obs.refDevice?.object;
            return ref && ref.endsWith(sensorId);
        })
            // Sắp xếp giảm dần theo thời gian observedAt
            .sort((a, b) => new Date(b.observedAt?.value) - new Date(a.observedAt?.value))
            // Lấy tối đa 10 bản ghi mới nhất
            .slice(0, 10);
        res.json(filtered);
    } catch (err) {
        res.status(500).json({ error: "Không thể lấy dữ liệu cho cảm biến này", details: err.message });
    }
};
