import axios from "axios";
import { createObservationEntity } from "../entities/FloodObservation.js";
// Chuẩn hóa sensor: chuyển các trường IRI về tên ngắn, đảm bảo luôn có giá trị (null nếu thiếu)
function normalizeSensor(sensor) {
    const iriMap = {
        name: ["name", "https://uri.etsi.org/ngsi-ld/name"],
        areaName: ["areaName", "https://uri.etsi.org/ngsi-ld/areaName"],
        status: ["status", "https://uri.etsi.org/ngsi-ld/status"],
        description: ["description", "https://uri.etsi.org/ngsi-ld/description"],
        batteryLevel: ["batteryLevel", "https://smart-data-models.github.io/data-models/terms.jsonld#/definitions/batteryLevel"],
        waterLevel: ["waterLevel", "https://smart-data-models.github.io/data-models/terms.jsonld#/definitions/waterLevel"],
        installedAt: ["installedAt", "https://uri.etsi.org/ngsi-ld/installedAt"],
        lastMaintenance: ["lastMaintenance", "https://uri.etsi.org/ngsi-ld/lastMaintenance"],
        lastReadingAt: ["lastReadingAt", "https://uri.etsi.org/ngsi-ld/lastReadingAt"],
    };

    const result = { ...sensor };
    for (const [short, keys] of Object.entries(iriMap)) {
        result[short] = null; // default if missing
        for (const k of keys) {
            if (sensor[k] && typeof sensor[k] === "object" && "value" in sensor[k]) {
                result[short] = sensor[k].value;
                break;
            }
        }
    }
    return result;
}




const ORION_LD_URL = process.env.ORION_LD_URL || 'http://localhost:1026/ngsi-ld/v1/entities';

// Lấy danh sách sensor từ Orion-LD
async function getAllSensors() {
    const res = await axios.get(`${ORION_LD_URL}?type=FloodSensor`, {
        headers: { 'Accept': 'application/ld+json' }
    });
    return res.data;
}

// Lấy weather gần nhất cho sensor (nếu có)
async function getNearestWeather(sensor) {
    const res = await axios.get(`${ORION_LD_URL}?type=WeatherObservation`, {
        headers: { 'Accept': 'application/ld+json' }
    });
    const weathers = res.data;
    // Tìm weather gần nhất theo khoảng cách
    let minDist = Infinity, nearest = null;
    for (const w of weathers) {
        const coords = w.location?.value?.coordinates;
        if (!coords) continue;
        const dx = coords[0] - sensor.location.value.coordinates[0];
        const dy = coords[1] - sensor.location.value.coordinates[1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
            minDist = dist;
            nearest = w;
        }
    }
    return nearest;
}

async function fakeReading(sensor) {
    const s = normalizeSensor(sensor);

    // location an toàn
    let location = s.location || sensor["https://uri.etsi.org/ngsi-ld/location"];
    if (!location?.value?.coordinates || !Array.isArray(location.value.coordinates)) {
        console.warn(`Sensor ${s.id} thiếu location, bỏ qua.`, s);
        return null;
    }

    const weather = await getNearestWeather(s);
    const temperature = weather?.temperature?.value
        ? +(weather.temperature.value + (Math.random() - 0.5) * 1.5).toFixed(1)
        : +(20 + Math.random() * 15).toFixed(1);

    const humidity = weather?.humidity?.value
        ? +(weather.humidity.value + (Math.random() - 0.5) * 5).toFixed(1)
        : +(60 + Math.random() * 30).toFixed(1);

    let waterLevel = 0;
    if (weather?.rainfall?.value !== undefined) {
        waterLevel = +(Math.max(0, Math.min(2, weather.rainfall.value * 0.1 + Math.random() * 0.5))).toFixed(2);
    } else {
        waterLevel = +(Math.random() * 2).toFixed(2);
    }

    const severity = waterLevel > 1.5 ? "high" : waterLevel > 1 ? "medium" : "low";

    return createObservationEntity({
        sensorId: s.id,
        longitude: location.value.coordinates[0],
        latitude: location.value.coordinates[1],
        waterLevel,
        temperature,
        humidity,
        observedAt: new Date().toISOString(),
        severity
    });
}


// Gửi dữ liệu giả lên Orion-LD
async function createFakeReadingsForAllSensors() {
    const sensors = await getAllSensors();
    console.log(`--- Sinh dữ liệu giả cho ${sensors.length} sensor ---`);
    for (const sensor of sensors) {
        let entity = await fakeReading(sensor);
        if (!entity) continue; // Bỏ qua sensor không hợp lệ
        // Filter out undefined/null properties (top-level only)
        entity = Object.fromEntries(Object.entries(entity).filter(([k, v]) => v !== undefined && v !== null));
        // If observedAt is present, ensure it uses the IRI key for strict NGSI-LD compliance
        if (entity.observedAt) {
            entity["https://uri.etsi.org/ngsi-ld/observedAt"] = entity.observedAt;
            delete entity.observedAt;
        }
        try {
            await axios.post(ORION_LD_URL, entity, {
                headers: { 'Content-Type': 'application/ld+json' }
            });
            // console.log(`Created fake reading for sensor ${sensor.id}`);
        } catch (err) {
            if (err.response && err.response.status === 409) {
                // Nếu đã tồn tại thì PATCH
                await axios.patch(`${ORION_LD_URL}/${encodeURIComponent(entity.id)}/attrs`, entity, {
                    headers: { 'Content-Type': 'application/ld+json' }
                });
                // console.log(`Patched fake reading for sensor ${sensor.id}`);
            } else {
                console.error('Error creating fake reading:', err.message);
            }
        }
    }
}

export { createFakeReadingsForAllSensors };
