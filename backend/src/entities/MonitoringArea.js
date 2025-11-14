// ========== MonitoringArea NGSI-LD Entity Builder ==========

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
 * Tạo entity NGSI-LD cho MonitoringArea
 * @param {Object} params - Area params
 * @returns {Object} NGSI-LD entity
 */
export function createAreaEntity({ id, name, longitude, latitude, osm_id }) {
    return {
        "@context": "http://host.docker.internal:5001/context.jsonld",
        id: id || `urn:ngsi-ld:MonitoringArea:${osm_id || name}`,
        type: "MonitoringArea",
        name: propertyField(name),
        location: geoProperty(longitude, latitude),
        osm_id: propertyField(osm_id)
    };
}