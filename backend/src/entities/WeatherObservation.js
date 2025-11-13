// Hàm tạo entity mẫu Weather NGSI-LD
export function createWeatherEntity({ id, areaName, longitude, latitude, temperature, humidity, rainfall, pressure, windSpeed, observedAt, source }) {
    const entity = {
        "@context": "http://host.docker.internal:5001/context.jsonld",
        "id": id || `urn:ngsi-ld:WeatherObservation:${areaName || ''}:${Date.now()}`,
        "type": "WeatherObservation",
    };
    if (areaName !== undefined && areaName !== null) entity["areaName"] = { "type": "Property", "value": areaName };
    if (longitude !== undefined && latitude !== undefined && longitude !== null && latitude !== null) {
        entity["location"] = {
            "type": "GeoProperty",
            "value": {
                "type": "Point",
                "coordinates": [longitude, latitude]
            }
        };
    }
    if (temperature !== undefined && temperature !== null) entity["temperature"] = { "type": "Property", "value": temperature };
    if (humidity !== undefined && humidity !== null) entity["humidity"] = { "type": "Property", "value": humidity };
    if (rainfall !== undefined && rainfall !== null) entity["rainfall"] = { "type": "Property", "value": rainfall };
    if (pressure !== undefined && pressure !== null) entity["pressure"] = { "type": "Property", "value": pressure };
    if (windSpeed !== undefined && windSpeed !== null) entity["windSpeed"] = { "type": "Property", "value": windSpeed };
    if (observedAt !== undefined && observedAt !== null) entity["https://uri.etsi.org/ngsi-ld/observedAt"] = { "type": "Property", "value": observedAt };
    if (source !== undefined && source !== null) entity["source"] = { "type": "Property", "value": source };
    return entity;
}
