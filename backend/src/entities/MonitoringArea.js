// Hàm tạo entity mẫu MonitoringArea NGSI-LD
export function createAreaEntity({ id, name, longitude, latitude, osm_id }) {
    return {
        "@context": "http://host.docker.internal:5001/context.jsonld",
        "id": id || `urn:ngsi-ld:MonitoringArea:${osm_id || name}`,
        "type": "MonitoringArea",
        "name": { "type": "Property", "value": name },
        "location": {
            "type": "GeoProperty",
            "value": {
                "type": "Point",
                "coordinates": [longitude, latitude]
            }
        },
        "osm_id": { "type": "Property", "value": osm_id }
    };
}