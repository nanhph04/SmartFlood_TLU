
import mqtt from "mqtt";
import axios from "axios";

const ORION_LD_URL = process.env.ORION_LD_URL;
const IOTAGENT_URL = process.env.IOTAGENT_URL;
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';

// ========== Helper Functions ==========

// Lấy danh sách sensor đã đăng ký ở IoTAgent
async function getAllRegisteredSensors() {
    const res = await axios.get(`${IOTAGENT_URL}/iot/devices`, {
        headers: {
            'fiware-service': 'openiot',
            'fiware-servicepath': '/'
        }
    });
    return res.data.devices || [];
}

// Lấy weather gần nhất cho sensor (nếu có)
async function getNearestWeather(sensor) {
    const res = await axios.get(`${ORION_LD_URL}?type=WeatherObservation`, {
        headers: { 'Accept': 'application/ld+json' }
    });
    const weathers = res.data;
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

// Sinh dữ liệu giả cho 1 sensor (dùng location, weather gần nhất)
async function generateFakeReading(sensor) {
    // Lấy location an toàn
    let location = sensor.location || sensor["https://uri.etsi.org/ngsi-ld/location"];
    if (!location) {
        if (Array.isArray(sensor.static_attributes)) {
            const locAttr = sensor.static_attributes.find(attr => attr.name === "location");
            if (locAttr && locAttr.value && Array.isArray(locAttr.value.coordinates)) {
                location = locAttr.value;
            }
        }
    }
    if (!location?.coordinates || !Array.isArray(location.coordinates)) {
        console.warn(`Sensor ${sensor.device_id || sensor.id || sensor.name} thiếu location, bỏ qua.`, sensor);
        return null;
    }

    const weather = await getNearestWeather({ location: { value: { coordinates: location.coordinates } } });
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

    // Lấy name từ attributes nếu có
    let name = undefined;
    if (Array.isArray(sensor.attributes)) {
        const nameAttr = sensor.attributes.find(attr => attr.name === "name");
        if (nameAttr && nameAttr.value) {
            name = nameAttr.value;
        }
    }
    return {
        name,
        status: sensor.status?.value || sensor.status || "active",
        waterLevel,
        batteryLevel: sensor.batteryLevel?.value || sensor.batteryLevel || Math.floor(50 + Math.random() * 50),
        lastReadingAt: new Date().toISOString(),
    };
}

// ========== Main Script ==========

/**
 * Gửi dữ liệu giả lên MQTT cho các sensor đã đăng ký ở IoTAgent
 * Kết nối tới MQTT broker, gửi dữ liệu cho từng sensor, log kết quả tổng hợp
 */
async function createFakeReadingsForAllSensors() {
    const sensors = await getAllRegisteredSensors();
    console.log(`--- Sinh dữ liệu giả cho ${sensors.length} sensor đã đăng ký ở IoTAgent (gửi qua MQTT) ---`);
    let successCount = 0;
    let skipCount = 0;
    const mqttClient = mqtt.connect(MQTT_BROKER_URL);

    mqttClient.on("connect", () => {
        console.log(`[MQTT] Đã kết nối tới broker ${MQTT_BROKER_URL}`);
        (async () => {
            for (const sensor of sensors) {
                const payload = await generateFakeReading(sensor);
                if (!payload) {
                    skipCount++;
                    console.warn(`[SKIP] Sensor ${sensor.device_id || sensor.name} không hợp lệ, bỏ qua.`);
                    continue;
                }
                const apikey = sensor.apikey || 'flood';
                // Topic theo IoTAgent MQTT convention: /<apikey>/<device_id>/attrs
                let topic = `/${apikey}/${sensor.device_id || sensor.id || sensor.name}/attrs`;
                if (sensor.endpoint) topic = sensor.endpoint;
                mqttClient.publish(topic, JSON.stringify(payload), { qos: 0 }, (err) => {
                    if (err) {
                        console.error(`[MQTT] Lỗi gửi tới ${topic}:`, err.message);
                    } else {
                        successCount++;
                    }
                });
            }
            setTimeout(() => {
                console.log(`[MQTT] Đã gửi thành công cho ${successCount}/${sensors.length} sensor, bỏ qua ${skipCount} sensor.`);
                console.log("[MQTT] Đóng kết nối MQTT");
                mqttClient.end();
            }, 1000);
        })();
    });

    mqttClient.on("error", (err) => {
        console.error("[MQTT] Lỗi kết nối broker:", err.message);
    });
}

export { createFakeReadingsForAllSensors };
