import axios from 'axios';

const ORION_LD_URL = process.env.ORION_LD_URL || 'http://localhost:1026/ngsi-ld/v1';
const SERVICE = process.env.FIWARE_SERVICE || 'openiot';
const SERVICE_PATH = process.env.FIWARE_SERVICE_PATH || '/';
const BACKEND_PORT = process.env.PORT || 5001;

// Use host.docker.internal for Windows Docker Desktop so Orion-LD container can call back
const NOTIFY_BASE = process.env.SUBSCRIPTION_NOTIFY_BASE || 'http://host.docker.internal';
const NOTIFY_URL = `${NOTIFY_BASE}:${BACKEND_PORT}/api/orion-notification`;

/**
 * Ensure a subscription for FloodSensor exists. If not, create it.
 */
export async function ensureFloodSensorSubscription() {
    try {
        // List existing subscriptions
        const listResp = await axios.get(`${ORION_LD_URL}/subscriptions`, {
            headers: {
                'Accept': 'application/ld+json',
                'Fiware-Service': SERVICE,
                'Fiware-ServicePath': SERVICE_PATH
            }
        });
        const existing = Array.isArray(listResp.data) ? listResp.data.find(s => s.description === 'Thông báo khi cảm biến lũ lụt có dữ liệu mới') : null;
        if (existing) {
            console.log('[Subscription] FloodSensor subscription already exists:', existing.id);
            return existing.id;
        }

        const body = {
            description: 'Thông báo khi cảm biến lũ lụt có dữ liệu mới',
            type: 'Subscription',
            entities: [{ type: 'FloodSensor' }],
            watchedAttributes: ['waterLevel', 'status'],
            notification: {
                attributes: ['waterLevel', 'status', 'lastReadingAt', 'location', 'areaName'],
                format: 'keyValues',
                endpoint: {
                    uri: NOTIFY_URL,
                    accept: 'application/json'
                }
            },
            '@context': 'https://smartdatamodels.org/context.jsonld'
        };

        const createResp = await axios.post(`${ORION_LD_URL}/subscriptions`, body, {
            headers: {
                'Content-Type': 'application/ld+json',
                'Fiware-Service': SERVICE,
                'Fiware-ServicePath': SERVICE_PATH
            }
        });

        const locationHeader = createResp.headers.location;
        console.log('[Subscription] Created FloodSensor subscription:', locationHeader || 'no-location-header');
        return locationHeader;
    } catch (err) {
        console.error('[Subscription] Error ensuring FloodSensor subscription:', err.response?.data || err.message);
        return null;
    }
}

/**
 * Ensure a subscription for WeatherObservation exists. If not, create it.
 */
export async function ensureWeatherSubscription() {
    try {
        // List existing subscriptions
        const listResp = await axios.get(`${ORION_LD_URL}/subscriptions`, {
            headers: {
                'Accept': 'application/ld+json',
                'Fiware-Service': SERVICE,
                'Fiware-ServicePath': SERVICE_PATH
            }
        });
        const existing = Array.isArray(listResp.data) ? listResp.data.find(s => s.description === 'Thông báo khi thời tiết có dữ liệu mới') : null;
        if (existing) {
            console.log('[Subscription] WeatherObservation subscription already exists:', existing.id);
            return existing.id;
        }

        const body = {
            description: 'Thông báo khi thời tiết có dữ liệu mới',
            type: 'Subscription',
            entities: [{ type: 'WeatherObservation' }],
            watchedAttributes: ['temperature', 'humidity', 'rainfall'],
            notification: {
                attributes: ['temperature', 'humidity', 'rainfall', 'observedAt', 'location', 'areaName'],
                format: 'keyValues',
                endpoint: {
                    uri: NOTIFY_URL,
                    accept: 'application/json'
                }
            },
            '@context': 'https://smartdatamodels.org/context.jsonld'
        };

        const createResp = await axios.post(`${ORION_LD_URL}/subscriptions`, body, {
            headers: {
                'Content-Type': 'application/ld+json',
                'Fiware-Service': SERVICE,
                'Fiware-ServicePath': SERVICE_PATH
            }
        });

        const locationHeader = createResp.headers.location;
        console.log('[Subscription] Created WeatherObservation subscription:', locationHeader || 'no-location-header');
        return locationHeader;
    } catch (err) {
        console.error('[Subscription] Error ensuring WeatherObservation subscription:', err.response?.data || err.message);
        return null;
    }
}
