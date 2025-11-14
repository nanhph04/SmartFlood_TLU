import axios from "axios";

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

