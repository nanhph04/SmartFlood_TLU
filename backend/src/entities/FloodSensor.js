function toUriSafe(str) {
    return (str || "")
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
        .replace(/[^a-zA-Z0-9-_]/g, "-"); // thay ký tự đặc biệt bằng -
}
// Hàm tạo entity mẫu Sensor NGSI-LD

function safeNumber(val, fallback = 0) {
    const n = Number(val);
    return isNaN(n) ? fallback : n;
}


function propertyField(value) {
    return value !== undefined && value !== null ? { type: "Property", value } : undefined;
}

export function createSensorEntity({ id, name, areaName, longitude, latitude, location, status, installedAt, lastMaintenance, description, waterLevel, batteryLevel, lastReadingAt }) {
    let sensorId = id;
    if (!sensorId || !/^urn:ngsi-ld:FloodSensor:/.test(sensorId)) {
        const safeName = toUriSafe(name);
        sensorId = `urn:ngsi-ld:FloodSensor:${safeName}:${Date.now()}`;
    }
    // Ưu tiên lấy longitude/latitude, nếu không có thì lấy từ location.coordinates
    let lon = longitude, lat = latitude;
    if ((!lon || !lat) && location && Array.isArray(location.coordinates)) {
        [lon, lat] = location.coordinates;
    }
    const entity = {
        "@context": "http://host.docker.internal:5001/context.jsonld",
        "id": sensorId,
        "type": "FloodSensor",
        "name": propertyField(name),
        "areaName": propertyField(areaName),
        "status": propertyField(status),
        "location": {
            "type": "GeoProperty",
            "value": {
                "type": "Point",
                "coordinates": [safeNumber(lon), safeNumber(lat)]
            }
        },
        "installedAt": propertyField(installedAt),
        "lastMaintenance": propertyField(lastMaintenance),
        "description": propertyField(description),
        "waterLevel": propertyField(waterLevel),
        "batteryLevel": propertyField(batteryLevel),
        "lastReadingAt": propertyField(lastReadingAt)
    };
    // Loại bỏ các field undefined
    Object.keys(entity).forEach(key => entity[key] === undefined && delete entity[key]);
    return entity;
}
