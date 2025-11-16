
import { createWeatherEntity } from "../entities/WeatherObservation.js";
import axios from "axios";
import WeatherHistory from "../models/WeatherHistory.model.js";

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
    // Chỉ cho phép truy vấn theo areaId để tối ưu
    const areaId = arguments[2];
    if (!areaId) throw new Error('areaId is required for getLatestWeatherByCoords');
    const url = `${ORION_LD_URL}?type=WeatherObservation&q=areaId==${encodeURIComponent(areaId)}&options=keyValues&limit=1&sort=-observedAt`;
    const res = await axios.get(url, { headers: { 'Accept': 'application/ld+json' } });
    return res.data && res.data.length ? res.data[0] : null;
}

// ========== API Controllers ==========

/**
 * Lấy bản ghi thời tiết mới nhất cho tất cả area
 * GET /api/weather/latest
 */
export const getLatestWeatherForAllAreas = async (req, res) => {
    try {
        // Lấy tất cả entity WeatherObservation từ Orion-LD
        const url = `${ORION_LD_URL}?type=WeatherObservation&options=keyValues`;
        const resOrion = await axios.get(url, { headers: { 'Accept': 'application/ld+json' } });
        const entities = resOrion.data || [];
        // Làm phẳng dữ liệu trả về cho frontend
        const results = entities.map(e => flattenWeatherEntity(e, e.areaId?.value, e.location?.value?.coordinates?.[1], e.location?.value?.coordinates?.[0]));
        res.json(results);
    } catch (err) {
        console.error('Lỗi lấy tất cả entity WeatherObservation:', err.message);
        res.status(500).json({ error: 'Không lấy được dữ liệu thời tiết' });
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
            const areaId = area.id;
            if (!areaId || typeof areaId !== 'string' || !coords || coords.length !== 2 || !areaName) continue;
            const [lon, lat] = coords;
            try {
                const weatherData = await fetchWeatherFromOpenWeatherMap(lat, lon);
                // Lưu lịch sử vào MongoDB
                await WeatherHistory.create({
                    areaId,
                    areaName,
                    longitude: lon,
                    latitude: lat,
                    temperature: weatherData.main && weatherData.main.temp,
                    humidity: weatherData.main && weatherData.main.humidity,
                    rainfall: weatherData.rain ? weatherData.rain["1h"] || weatherData.rain["3h"] || 0 : 0,
                    pressure: weatherData.main && weatherData.main.pressure,
                    windSpeed: weatherData.wind && weatherData.wind.speed,
                    observedAt: weatherData.dt ? new Date(weatherData.dt * 1000) : new Date(),
                    source: "OpenWeatherMap"
                });

                // Tạo entity mới nhất cho Orion-LD (ID cố định theo areaId)
                const entity = buildWeatherEntity(areaName, lat, lon, weatherData, areaId);
                console.log('Entity gửi lên Orion-LD:', JSON.stringify(entity, null, 2));
                // PATCH entity theo ID, nếu chưa có thì POST mới
                try {
                    await axios.patch(`${ORION_LD_URL}/${encodeURIComponent(entity.id)}/attrs`, entity, {
                        headers: { 'Content-Type': 'application/ld+json' }
                    });
                } catch (patchErr) {
                    // Nếu PATCH lỗi 404 (chưa có entity), thì POST mới
                    if (patchErr.response && patchErr.response.status === 404) {
                        await axios.post(ORION_LD_URL, entity, {
                            headers: { 'Content-Type': 'application/ld+json' }
                        });
                    } else {
                        throw patchErr;
                    }
                }
            } catch (err) {
                const msg = `Lỗi tạo bản ghi thời tiết cho area ${areaName}: ${err.message}`;
                console.error(msg);
                errors.push(msg);
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
    // Tham số thứ 5 là areaId
    return createWeatherEntity({
        areaName,
        longitude: lon,
        latitude: lat,
        temperature: data.main && data.main.temp,
        humidity: data.main && data.main.humidity,
        rainfall: rain,
        pressure: data.main && data.main.pressure,
        windSpeed: data.wind && data.wind.speed,
        observedAt,
        source: "OpenWeatherMap",
        areaId: arguments[4]
    });
}

// Làm phẳng entity weather để trả về cho frontend
function flattenWeatherEntity(weather, areaId, lat, lon) {
    // Helper lấy giá trị: nếu là object có .value thì lấy .value, nếu là primitive thì lấy luôn
    const getVal = v => (v && typeof v === 'object' && 'value' in v) ? v.value : v;
    return {
        id: weather.id,
        type: weather.type,
        areaId: getVal(weather.areaId) || areaId,
        areaName: getVal(weather.areaName),
        temperature:
            getVal(weather["https://smart-data-models.github.io/data-models/terms.jsonld#/definitions/temperature"])
            ?? getVal(weather.temperature),
        humidity:
            getVal(weather["https://uri.fiware.org/ns/data-models#humidity"])
            ?? getVal(weather.humidity),
        rainfall:
            getVal(weather["https://uri.fiware.org/ns/data-models#rainfall"])
            ?? getVal(weather.rainfall),
        windSpeed:
            getVal(weather["https://smart-data-models.github.io/data-models/terms.jsonld#/definitions/windSpeed"])
            ?? getVal(weather.windSpeed),
        pressure:
            getVal(weather["https://uri.fiware.org/ns/data-models#pressure"])
            ?? getVal(weather.pressure),
        source:
            getVal(weather["https://smart-data-models.github.io/data-models/terms.jsonld#/definitions/source"])
            ?? getVal(weather.source),
        observedAt:
            getVal(weather["https://uri.etsi.org/ngsi-ld/observedAt"])
            ?? getVal(weather.observedAt),
        location: getVal(weather.location),
        lat: lat ?? (getVal(weather.location)?.coordinates?.[1]),
        lon: lon ?? (getVal(weather.location)?.coordinates?.[0])
    };
}



