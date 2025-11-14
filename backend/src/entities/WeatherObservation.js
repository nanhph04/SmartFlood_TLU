// ========== WeatherObservation NGSI-LD Entity Builder ==========

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
            coordinates: [longitude, latitude]
        }
    };
}

/**
 * Tạo entity NGSI-LD cho WeatherObservation
 * @param {Object} params - Weather params
 * @returns {Object} NGSI-LD entity
 */
export function createWeatherEntity({ id, areaName, longitude, latitude, temperature, humidity, rainfall, pressure, windSpeed, observedAt, source }) {
    return {
        "@context": "http://host.docker.internal:5001/context.jsonld",
        id: id || `urn:ngsi-ld:WeatherObservation:${areaName || ''}:${Date.now()}`,
        type: "WeatherObservation",
        areaName: propertyField(areaName),
        location: geoProperty(longitude, latitude),
        temperature: propertyField(temperature),
        humidity: propertyField(humidity),
        rainfall: propertyField(rainfall),
        pressure: propertyField(pressure),
        windSpeed: propertyField(windSpeed),
        "https://uri.etsi.org/ngsi-ld/observedAt": propertyField(observedAt),
        source: propertyField(source)
    };
}
