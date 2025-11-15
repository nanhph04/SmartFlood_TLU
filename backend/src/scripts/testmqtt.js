import axios from "axios";
import mqtt from "mqtt";

/**
 * ==============================================================
 * 1) ĐĂNG KÝ SENSOR VỚI IOTAGENT (ĐÃ SỬA)
 * ==============================================================
 */
async function registerSensorToIoTAgent(sensor, iotAgentUrl = "http://localhost:4041") {
    const device = {
        devices: [
            {
                device_id: sensor.deviceId,
                entity_name: sensor.entityName,
                entity_type: "FloodSensor",

                protocols: [
                    {
                        protocol: "MQTT",
                        transport: "MQTT",
                        // Không dùng default resource /iot/json
                        resource: ""
                    }
                ],

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
                        value: sensor.location
                    }
                ]
            }
        ]
    };

    return axios.post(`${iotAgentUrl}/iot/devices`, device, {
        headers: {
            "Content-Type": "application/json",
            "fiware-service": "openiot",
            "fiware-servicepath": "/"
        }
    });
}

/**
 * ==============================================================
 * 2) GỬI MQTT ĐẾN IOTAGENT
 * ==============================================================
 */
function sendMqttMessage(sensor) {
    return new Promise((resolve, reject) => {
        const client = mqtt.connect("mqtt://localhost:1883");

        client.on("error", (err) => {
            console.error("[MQTT] ❌", err.message);
            client.end();
            reject(err);
        });

        client.on("connect", () => {
            const topic = `sensors/${sensor.deviceId}/attrs`;

            const payload = {
                name: sensor.name,
                areaName: sensor.areaName,
                status: "active",
                waterLevel: 1.2,
                batteryLevel: 80,
                lastReadingAt: new Date().toISOString()
            };

            console.log("Publish →", topic, payload);

            client.publish(topic, JSON.stringify(payload), (err) => {
                client.end();
                if (err) reject(err);
                else resolve();
            });
        });
    });
}

/**
 * ==============================================================
 * 3) SENSOR INFO
 * ==============================================================
 */
const sensor = {
    deviceId: "sensor-001",
    entityName: "urn:ngsi-ld:FloodSensor:sensor-001",
    name: "sensor-001",
    areaName: "Ngã tư Kim Mã – Liễu Giai",
    location: {
        type: "Point",
        coordinates: [105.7752, 21.0571]
    }
};

/**
 * ==============================================================
 * 4) MAIN
 * ==============================================================
 */
async function main() {
    try {
        await registerSensorToIoTAgent(sensor);
        console.log("✓ Device registered!");

        await sendMqttMessage(sensor);
        console.log("✓ MQTT message sent!");

        console.log("→ Kiểm tra entity trong Orion-LD:");
        console.log("  GET http://localhost:1026/ngsi-ld/v1/entities/" + sensor.entityName);
    } catch (err) {
        console.error("❌ ERROR:", err.message);
        if (err.response) console.error(err.response.data);
    }
}

main();
