import mqtt from "mqtt";
import axios from "axios";





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


// Sinh dữ liệu giả cho 1 sensor (dùng location, weather gần nhất)
async function fakeReading(sensor) {
    // Lấy location an toàn
    let location = sensor.location || sensor["https://uri.etsi.org/ngsi-ld/location"];
    if (!location?.value?.coordinates || !Array.isArray(location.value.coordinates)) {
        console.warn(`Sensor ${sensor.id} thiếu location, bỏ qua.`, sensor);
        return null;
    }

    const weather = await getNearestWeather(sensor);
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

    // Chỉ trả về các trường cần thiết cho IoTAgent
    return {
        name: sensor.name?.value || sensor.name,
        areaName: sensor.areaName?.value || sensor.areaName,
        status: sensor.status?.value || sensor.status || "active",
        waterLevel,
        batteryLevel: sensor.batteryLevel?.value || sensor.batteryLevel || Math.floor(50 + Math.random() * 50),
        lastReadingAt: new Date().toISOString(),
        // Các trường khác nếu cần
    };
}




// Gửi dữ liệu giả lên MQTT (để IoTAgent nhận và đẩy lên Orion-LD)
async function createFakeReadingsForAllSensors() {
    const sensors = await getAllSensors();
    console.log(`--- Sinh dữ liệu giả cho ${sensors.length} sensor (gửi qua MQTT) ---`);
    // Kết nối MQTT broker (giả định broker chạy ở localhost:1883)
    const mqttClient = mqtt.connect("mqtt://localhost:1883");

    mqttClient.on("connect", () => {
        console.log("[MQTT] Đã kết nối tới broker mqtt://localhost:1883");
        (async () => {
            for (const sensor of sensors) {
                const payload = await fakeReading(sensor);
                if (!payload) {
                    console.warn(`[SKIP] Sensor ${sensor.id || sensor.name} không hợp lệ, bỏ qua.`);
                    continue;
                }
                // Xác định topic MQTT đúng endpoint đã đăng ký cho sensor
                let topic = `sensors/${sensor.id || sensor.deviceId || sensor.name}`;
                if (sensor.endpoint) topic = sensor.endpoint;
                console.log(`[MQTT] Publish tới topic: ${topic}`);
                console.log(`[MQTT] Payload:`, payload);
                mqttClient.publish(topic, JSON.stringify(payload), { qos: 0 }, (err) => {
                    if (err) {
                        console.error(`[MQTT] Lỗi gửi tới ${topic}:`, err.message);
                    } else {
                        console.log(`[MQTT] Đã gửi thành công tới ${topic}`);
                    }
                });
            }
            // Đợi 1s cho các message gửi xong rồi ngắt kết nối
            setTimeout(() => {
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
