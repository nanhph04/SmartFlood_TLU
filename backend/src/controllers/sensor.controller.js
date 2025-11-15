import axios from "axios";
import mqtt from "mqtt";
import { registerSensorToIoTAgent } from "../utils/registerSensorToIoTAgent.js";

const ORION_LD_URL = process.env.ORION_LD_URL;
const IOTAGENT_URL = process.env.IOTAGENT_URL;
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";

// Helper: publish one initial reading via MQTT
async function publishInitialReading(deviceId, name, apikey = 'flood') {
    return new Promise((resolve) => {
        const client = mqtt.connect(MQTT_BROKER_URL);
        client.on("connect", () => {
            // Topic theo IoTAgent MQTT convention: /<apikey>/<device_id>/attrs
            const topic = `/${apikey}/${deviceId}/attrs`;
            const payload = {
                name: name || deviceId,
                status: "active",
                waterLevel: 0,
                batteryLevel: Math.floor(80 + Math.random() * 20),
                lastReadingAt: new Date().toISOString()
            };
            client.publish(topic, JSON.stringify(payload), { qos: 0 }, (err) => {
                client.end();
                resolve(!err);
            });
        });
        client.on("error", () => {
            try { client.end(); } catch { }
            resolve(false);
        });
    });
}

// Đăng ký sensor mới với IoTAgent
export const createSensor = async (req, res) => {
    try {
        // Chuẩn hóa location nếu là GeoProperty
        let location = req.body.location;
        if (location && location.type === "GeoProperty" && location.value) {
            location = location.value;
        }
        await registerSensorToIoTAgent({ ...req.body, location });
        res.status(201).json({ message: "Đã đăng ký sensor với IoTAgent" });
    } catch (err) {
        res.status(400).json({ error: "Không tạo được sensor", detail: err.message });
    }
};

// Lấy danh sách các sensor đã đăng ký ở IoTAgent
export const getAllRegisteredDevices = async (req, res) => {
    try {
        const response = await axios.get(`${IOTAGENT_URL}/iot/devices`, {
            headers: {
                "fiware-service": "openiot",
                "fiware-servicepath": "/"
            }
        });
        res.json(response.data.devices || []);
    } catch (err) {
        res.status(500).json({ error: "Không lấy được danh sách sensor từ IoTAgent", detail: err.message });
    }
};

// Lấy cảm biến theo id
export const getSensorById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${ORION_LD_URL}/${id}`, {
            headers: {
                "Accept": "application/ld+json",
                "Fiware-Service": "openiot",
                "Fiware-ServicePath": "/"
            }
        });
        res.json(response.data);
    } catch (err) {
        res.status(404).json({ error: "Không tìm thấy sensor trên Orion-LD" });
    }
};

// Sửa thông tin cảm biến
export const updateSensor = async (req, res) => {
    try {
        const { id } = req.params;
        const attrs = req.body;
        await axios.patch(`${ORION_LD_URL}/${id}/attrs`, attrs, {
            headers: {
                "Content-Type": "application/ld+json",
                "Fiware-Service": "openiot",
                "Fiware-ServicePath": "/"
            }
        });
        res.json({ message: "Đã cập nhật sensor trên Orion-LD" });
    } catch (err) {
        res.status(400).json({ error: "Không cập nhật được sensor trên Orion-LD" });
    }
};

// Xem chi tiết cảm biến (nếu cần mở rộng)
export const getSensorDetail = getSensorById;

// Lấy toàn bộ cảm biến (dạng đã làm phẳng thuộc tính)
export const getAllSensors = async (req, res) => {
    try {
        const response = await axios.get(`${ORION_LD_URL}?type=FloodSensor`, {
            headers: {
                "Accept": "application/ld+json",
                "Fiware-Service": "openiot",
                "Fiware-ServicePath": "/"
            }
        });
        const flatten = (sensor) => {
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
        const data = Array.isArray(response.data) ? response.data.map(flatten) : [];
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Không lấy được danh sách sensor" });
    }
};

// Lấy cảm biến theo tuyến đường (theo areaName)
export const getSensorsByStreet = async (req, res) => {
    try {
        const { street } = req.query;
        if (!street) return res.status(400).json({ error: "Missing street parameter" });
        const response = await axios.get(`${ORION_LD_URL}?type=FloodSensor&q=areaName=="${encodeURIComponent(street)}"`, {
            headers: {
                "Accept": "application/ld+json",
                "Fiware-Service": "openiot",
                "Fiware-ServicePath": "/"
            }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Không lấy được sensor theo tuyến đường" });
    }
};

// Gửi bản đọc khởi tạo cho 1 sensor theo deviceId
export const seedSensor = async (req, res) => {
    try {
        const { deviceId } = req.params;
        if (!deviceId) return res.status(400).json({ error: "Missing deviceId" });
        const ok = await publishInitialReading(deviceId);
        if (!ok) return res.status(500).json({ error: "Publish initial reading failed" });
        res.json({ message: `Seeded initial reading for ${deviceId}` });
    } catch (err) {
        res.status(500).json({ error: "Seed sensor failed", detail: err.message });
    }
};

// Gửi bản đọc khởi tạo cho tất cả sensors đã đăng ký ở IoTAgent
export const seedAllSensors = async (_req, res) => {
    try {
        const response = await axios.get(`${IOTAGENT_URL}/iot/devices`, {
            headers: { "fiware-service": "openiot", "fiware-servicepath": "/" }
        });
        const devices = response.data.devices || [];
        let success = 0, fail = 0;
        for (const d of devices) {
            const id = d.device_id || d.id || d.name;
            if (!id) { fail++; continue; }
            // eslint-disable-next-line no-await-in-loop
            const ok = await publishInitialReading(id, d.attributes?.find(a => a.name === "name")?.value || id);
            if (ok) success++; else fail++;
        }
        res.json({ message: "Seeded initial readings", total: devices.length, success, fail });
    } catch (err) {
        res.status(500).json({ error: "Seed all sensors failed", detail: err.message });
    }
};

// Xuất dữ liệu NGSI-LD (lấy toàn bộ sensor dạng NGSI-LD)
export const exportSensorsNGSILD = getAllSensors;