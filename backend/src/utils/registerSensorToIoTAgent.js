import axios from "axios";
import mqtt from "mqtt";

/**
 * Đăng ký sensor mới với IoTAgent
 * @param {Object} sensor - Thông tin sensor mới
 * @param {string} iotAgentUrl - URL IoTAgent
 * @returns {Promise}
 */
export async function registerSensorToIoTAgent(sensor, iotAgentUrl = "http://localhost:4041") {
    const device = {
        devices: [
            {
                device_id: sensor.deviceId || sensor.id || sensor.name,
                entity_name: sensor.entityName || sensor.id || `urn:ngsi-ld:FloodSensor:${sensor.deviceId || sensor.name}`,
                entity_type: "FloodSensor",
                protocol: "JSON",
                transport: "MQTT",
                // 'endpoint' đã bị xoá vì không cần thiết cho transport: "MQTT"
                attributes: [
                    { object_id: "name", name: "name", type: "Property" },
                    // 'areaName' đã bị xoá vì không có trong payload MQTT
                    { object_id: "status", name: "status", type: "Property" },
                    { object_id: "waterLevel", name: "waterLevel", type: "Property" },
                    { object_id: "batteryLevel", name: "batteryLevel", type: "Property" },
                    { object_id: "lastReadingAt", name: "lastReadingAt", type: "Property" }
                ],
                static_attributes: [
                    {
                        name: "location",
                        type: "GeoProperty",
                        value: sensor.location || {
                            type: "Point",
                            coordinates: [sensor.longitude || 0, sensor.latitude || 0]
                        }
                    }
                ]
            }
        ]
    };

    // Gửi request đăng ký device tới IoTAgent
    return axios.post(`${iotAgentUrl}/iot/devices`, device, {
        headers: {
            "Content-Type": "application/json",
            "fiware-service": "openiot",      // Đảm bảo service này đã được cấu hình trong IoTAgent
            "fiware-servicepath": "/"
        }
    });
}

// --- Dữ liệu sensor ---
const sensor = {
    deviceId: "sensor-014",
    entityName: "urn:ngsi-ld:FloodSensor:sensor-014",
    name: "Cảm biến mực nước ngã tư Tây Sơn – Thái Thịnh",
    status: "active",
    waterLevel: 19.9,
    batteryLevel: 29.8,
    lastReadingAt: "2025-11-13T07:00:00.000Z",
    location: {
        type: "Point",
        coordinates: [105.8198, 21.9995]
    }
};

// // --- Hàm chính để chạy ---
// async function main() {
//     try {
//         // 1. Đăng ký thiết bị với IoTAgent
//         await registerSensorToIoTAgent(sensor);
//         console.log(`✅ Đăng ký device '${sensor.deviceId}' thành công!`);

//         // 2. Gửi dữ liệu mẫu lên MQTT để IoTAgent nhận
//         // Topic này phải khớp với cấu hình 'apikey' của IoTAgent
//         // Ví dụ: 'sensors' ở đây là apikey
//         const mqttTopic = `sensors/${sensor.deviceId}`;
//         const payload = {
//             name: sensor.name,
//             status: sensor.status,
//             waterLevel: sensor.waterLevel,
//             batteryLevel: sensor.batteryLevel,
//             lastReadingAt: sensor.lastReadingAt
//         };

//         const mqttClient = mqtt.connect("mqtt://localhost:1883");

//         mqttClient.on("connect", () => {
//             console.log(`[MQTT] Đã kết nối tới broker, gửi dữ liệu mẫu lên topic: ${mqttTopic}`);

//             // Xuất bản (publish) dữ liệu
//             mqttClient.publish(mqttTopic, JSON.stringify(payload), { qos: 0 }, (err) => {
//                 if (err) {
//                     console.error(`[MQTT] Lỗi gửi dữ liệu:`, err.message);
//                 } else {
//                     console.log(`[MQTT] ✅ Đã gửi dữ liệu mẫu thành công!`);
//                     console.log("----------------------------------------------------");
//                     console.log("➡️  Kiểm tra Orion-LD để xem entity đã được tạo/cập nhật.");
//                 }
//                 // Đóng kết nối sau khi gửi
//                 setTimeout(() => mqttClient.end(), 500);
//             });
//         });

//         mqttClient.on("error", (err) => {
//             console.error("[MQTT] ❌ Lỗi kết nối broker:", err.message);
//         });

//     } catch (err) {
//         if (err.response) {
//             // Lỗi từ axios (ví dụ: IoTAgent không chạy, đăng ký thất bại)
//             console.error("❌ Lỗi đăng ký device:", err.response.data);
//         } else {
//             // Lỗi chung
//             console.error("❌ Lỗi:", err.message);
//         }
//     }
// }

// // Chạy hàm main
// main();