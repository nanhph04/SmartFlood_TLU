import axios from "axios";
import mqtt from "mqtt";

/**
 * Đăng ký sensor mới với IoTAgent
 * @param {Object} sensor - Thông tin sensor mới
 * @param {string} iotAgentUrl - URL IoTAgent
 * @returns {Promise}
 */
export async function registerSensorToIoTAgent(sensor, iotAgentUrl = "http://localhost:4041") {
    const deviceId = sensor.deviceId || sensor.device_id;
    const device = {
        devices: [
            {
                device_id: deviceId,
                entity_name: sensor.entityName || sensor.id || `urn:ngsi-ld:FloodSensor:${deviceId}`,
                entity_type: "FloodSensor",
                protocol: "JSON",
                transport: "MQTT",
                apikey: "flood",
                attributes: [
                    { object_id: "name", name: "name", type: "Property" },
                    { object_id: "areaName", name: "areaName", type: "Property" },
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
    const registerResponse = await axios.post(`${iotAgentUrl}/iot/devices`, device, {
        headers: {
            "Content-Type": "application/json",
            "fiware-service": "openiot",      // Đảm bảo service này đã được cấu hình trong IoTAgent
            "fiware-servicepath": "/"
        }
    });

    // Sau khi đăng ký, gửi ngay một bản đọc khởi tạo để IoTAgent tạo entity trên Orion-LD
    try {
        const mqttUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
        const client = mqtt.connect(mqttUrl);

        await new Promise((resolve, reject) => {
            client.on('connect', resolve);
            client.on('error', reject);
        });

        const deviceId = device.devices[0].device_id;
        const apikey = device.devices[0].apikey;
        // Topic theo IoTAgent MQTT convention: /<apikey>/<device_id>/attrs
        const topic = `/${apikey}/${deviceId}/attrs`;
        const payload = {
            name: sensor.name || deviceId,
            status: sensor.status || 'active',
            waterLevel: 0,
            batteryLevel: Math.floor(80 + Math.random() * 20),
            lastReadingAt: new Date().toISOString()
        };

        client.publish(topic, JSON.stringify(payload), { qos: 0 }, (err) => {
            if (err) {
                console.error(`[InitialReading] Lỗi publish tới ${topic}:`, err.message);
            } else {
                console.log(`[InitialReading] Đã gửi bản đọc khởi tạo cho sensor ${deviceId} tại topic ${topic}`);
            }
            client.end();
        });
    } catch (e) {
        console.error('[InitialReading] Gửi bản đọc khởi tạo thất bại:', e.message);
    }

    return registerResponse;
}

