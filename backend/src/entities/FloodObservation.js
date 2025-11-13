// Hàm tạo entity NGSI-LD cho FloodObservation (Observation)
export function createObservationEntity({ id, sensorId, longitude, latitude, waterLevel, temperature, humidity, observedAt, note, severity }) {
    const entity = {
        "@context": "http://host.docker.internal:5001/context.jsonld",
        "id": id || `urn:ngsi-ld:FloodObservation:${sensorId}:${Date.now()}`,
        "type": "FloodObservation",
        "refDevice": sensorId ? {
            "type": "Relationship",
            "object": `urn:ngsi-ld:FloodSensor:${sensorId}`
        } : undefined,
        "location": (longitude !== undefined && latitude !== undefined) ? {
            "type": "GeoProperty",
            "value": {
                "type": "Point",
                "coordinates": [longitude, latitude]
            }
        } : undefined,
        "waterLevel": waterLevel !== undefined ? { "type": "Property", "value": waterLevel } : undefined,
        "temperature": temperature !== undefined ? { "type": "Property", "value": temperature } : undefined,
        "humidity": humidity !== undefined ? { "type": "Property", "value": humidity } : undefined,
        "https://uri.etsi.org/ngsi-ld/observedAt": observedAt !== undefined ? { "type": "Property", "value": observedAt } : undefined,
        "severity": severity !== undefined ? { "type": "Property", "value": severity } : undefined,
        "note": note !== undefined ? { "type": "Property", "value": note } : undefined
    };
    // Remove any undefined/null properties (top-level only)
    return Object.fromEntries(Object.entries(entity).filter(([k, v]) => v !== undefined && v !== null));
}
