// ========== FloodObservation NGSI-LD Entity Builder ==========

/**
 * Helper to create NGSI-LD Property field
 */
function propertyField(value) {
    return value !== undefined && value !== null ? { type: "Property", value } : undefined;
}

/**
 * Helper to create NGSI-LD GeoProperty field
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
 * Helper to create NGSI-LD Relationship field
 */
function relationshipField(type, object) {
    return object ? { type, object } : undefined;
}

/**
 * Tạo entity NGSI-LD cho FloodObservation (Observation)
 * @param {Object} params - Observation params
 * @returns {Object} NGSI-LD entity
 */
export function createObservationEntity({ id, sensorId, longitude, latitude, waterLevel, temperature, humidity, observedAt, note, severity }) {
    const entity = {
        "@context": "http://host.docker.internal:5001/context.jsonld",
        id: id || `urn:ngsi-ld:FloodObservation:${sensorId}:${Date.now()}`,
        type: "FloodObservation",
        refDevice: relationshipField("Relationship", sensorId ? `urn:ngsi-ld:FloodSensor:${sensorId}` : undefined),
        location: geoProperty(longitude, latitude),
        waterLevel: propertyField(waterLevel),
        temperature: propertyField(temperature),
        humidity: propertyField(humidity),
        "https://uri.etsi.org/ngsi-ld/observedAt": propertyField(observedAt),
        severity: propertyField(severity),
        note: propertyField(note)
    };
    // Remove any undefined/null properties (top-level only)
    return Object.fromEntries(Object.entries(entity).filter(([k, v]) => v !== undefined && v !== null));
}
