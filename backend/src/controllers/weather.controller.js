
import { createWeatherEntity } from "../entities/WeatherObservation.js";
import axios from "axios";

const ORION_LD_URL = process.env.ORION_LD_URL;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// ========== Helper Functions ==========

// Lấy danh sách MonitoringArea từ Orion-LD
async function getAllAreas() {
    const res = await axios.get(`${ORION_LD_URL}?type=MonitoringArea`, {
        headers: { 'Accept': 'application/ld+json' }
    });
    return res.data;
}

// Lấy bản ghi thời tiết mới nhất cho 1 area theo lat, lon
async function getLatestWeatherByCoords(lat, lon) {
    const res = await axios.get(`${ORION_LD_URL}?type=WeatherObservation`, {
        headers: { 'Accept': 'application/ld+json' }
    });
    const arr = res.data.filter(e => {
        const coords = e.location?.value?.coordinates;
        if (!coords || coords.length !== 2) return false;
        // So sánh số thực, làm tròn 5 chữ số sau dấu phẩy
        return (
            Math.abs(Number(coords[0]) - Number(lon)) < 1e-5 &&
            Math.abs(Number(coords[1]) - Number(lat)) < 1e-5
        );
    });
    if (!arr.length) return null;
    arr.sort((a, b) => new Date(b.observedAt?.value || 0) - new Date(a.observedAt?.value || 0));
    return arr[0];
}

// ========== API Controllers ==========

/**
 * Lấy bản ghi thời tiết mới nhất cho tất cả area
 * GET /api/weather/latest
 */
export const getLatestWeatherForAllAreas = async (req, res) => {
    try {
        const areas = await getAllAreas();
        const results = [];
        for (const area of areas) {
            const areaId = area.id;
            const coords = area.location?.value?.coordinates;
            if (!areaId || !coords || coords.length !== 2) continue;
            const [lon, lat] = coords;
            const weather = await getLatestWeatherByCoords(lat, lon);
            if (weather) {
                results.push(flattenWeatherEntity(weather, areaId, lat, lon));
            }
        }
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Không lấy được dữ liệu thời tiết mới nhất cho các area' });
    }
};

/**
 * Cập nhật thời tiết cho tất cả area (gọi OpenWeatherMap và ghi vào Orion-LD)
 * POST /api/weather/update
 */
export const updateWeatherForAllAreas = async (req, res) => {
    try {
        const areas = await getAllAreas();
        const errors = [];
        for (const area of areas) {
            const areaName = extractAreaName(area);
            const coords = area.location?.value?.coordinates;
            if (coords && coords.length === 2 && areaName) {
                const [lon, lat] = coords;
                try {
                    const weatherData = await fetchWeatherFromOpenWeatherMap(lat, lon);
                    const entity = buildWeatherEntity(areaName, lat, lon, weatherData);
                    await axios.post(ORION_LD_URL, entity, {
                        headers: { 'Content-Type': 'application/ld+json' }
                    });
                } catch (err) {
                    const msg = `Lỗi tạo bản ghi thời tiết cho area ${areaName}: ${err.message}`;
                    console.error(msg);
                    errors.push(msg);
                }
            }
        }
        if (errors.length > 0) {
            res.status(500).json({ error: 'Có lỗi khi tạo bản ghi thời tiết cho một số area', details: errors });
        } else {
            res.json({ message: 'Đã tạo bản ghi thời tiết mới cho tất cả area' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi tạo bản ghi thời tiết cho tất cả area' });
    }
};

// ========== Utility Functions ==========

// Trích xuất tên area từ entity area
function extractAreaName(area) {
    return area.name?.value || area.name || area["https://uri.etsi.org/ngsi-ld/name"]?.value || null;
}

// Gọi OpenWeatherMap API lấy dữ liệu thời tiết
async function fetchWeatherFromOpenWeatherMap(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);
    return response.data;
}

// Tạo entity WeatherObservation từ dữ liệu OpenWeatherMap
function buildWeatherEntity(areaName, lat, lon, data) {
    const rain = data.rain ? data.rain["1h"] || data.rain["3h"] || 0 : 0;
    const observedAt = data.dt ? new Date(data.dt * 1000).toISOString() : new Date().toISOString();
    const safeAreaName = (areaName || '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeLat = String(lat).replace(/[^0-9.\-]/g, '');
    const safeLon = String(lon).replace(/[^0-9.\-]/g, '');
    const entityId = `urn:ngsi-ld:WeatherObservation:${safeAreaName}:${safeLat}_${safeLon}:${Date.now()}`;
    return createWeatherEntity({
        id: entityId,
        areaName,
        longitude: lon,
        latitude: lat,
        temperature: data.main && data.main.temp,
        humidity: data.main && data.main.humidity,
        rainfall: rain,
        pressure: data.main && data.main.pressure,
        windSpeed: data.wind && data.wind.speed,
        observedAt,
        source: "OpenWeatherMap"
    });
}

// Làm phẳng entity weather để trả về cho frontend
function flattenWeatherEntity(weather, areaId, lat, lon) {
    return {
        id: weather.id,
        type: weather.type,
        areaId,
        areaName: weather.areaName?.value,
        temperature: weather["https://smart-data-models.github.io/data-models/terms.jsonld#/definitions/temperature"]?.value || weather.temperature?.value,
        humidity: weather["https://uri.fiware.org/ns/data-models#humidity"]?.value || weather.humidity?.value,
        rainfall: weather["https://uri.fiware.org/ns/data-models#rainfall"]?.value || weather.rainfall?.value,
        windSpeed: weather["https://smart-data-models.github.io/data-models/terms.jsonld#/definitions/windSpeed"]?.value || weather.windSpeed?.value,
        pressure: weather["https://uri.fiware.org/ns/data-models#pressure"]?.value || weather.pressure?.value,
        observedAt: weather.observedAt?.value,
        location: weather.location?.value,
        lat,
        lon
    };
}



