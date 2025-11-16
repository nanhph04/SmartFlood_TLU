// ========== FloodSensor NGSI-LD Entity Builder ==========

/**
 * Helper: Convert string to URI-safe (remove accents, replace special chars)
 */
function toUriSafe(str) {
    return (str || "")
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-");
}

/**
 * Helper: Safe number conversion with fallback
 */
function safeNumber(val, fallback = 0) {
    const n = Number(val);
    return isNaN(n) ? fallback : n;
}

/**
 * Helper: Create NGSI-LD Property field
 */
function propertyField(value) {
    return value !== undefined && value !== null ? { type: "Property", value } : undefined;
}

/**
 * Helper: Create NGSI-LD GeoProperty field
 */
function geoProperty(longitude, latitude) {
    if (longitude === undefined || latitude === undefined) return undefined;
    return {
        type: "GeoProperty",
        value: {
            type: "Point",
            coordinates: [safeNumber(longitude), safeNumber(latitude)]
        }
    };
}

/**
 * Tạo entity NGSI-LD cho FloodSensor
 * @param {Object} params - Sensor params
 * @returns {Object} NGSI-LD entity
 */
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
        id: sensorId,
        type: "FloodSensor",
        name: propertyField(name),
        areaName: propertyField(areaName),
        status: propertyField(status),
        location: geoProperty(lon, lat),
        installedAt: propertyField(installedAt),
        lastMaintenance: propertyField(lastMaintenance),
        description: propertyField(description),
        waterLevel: propertyField(waterLevel),
        batteryLevel: propertyField(batteryLevel),
        lastReadingAt: propertyField(lastReadingAt)
    };
    // Loại bỏ các field undefined
    return Object.fromEntries(Object.entries(entity).filter(([k, v]) => v !== undefined && v !== null));
}
