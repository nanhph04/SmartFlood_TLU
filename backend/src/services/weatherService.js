import MonitoringArea from "../models/MonitoringArea.js";
import axios from "axios";
import Weather from "../models/Weather.js";

export const getWeatherDataForLocation = async (lat, lon, areaName = "") => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        const rain = data.rain ? data.rain["1h"] || data.rain["3h"] || 0 : 0;

        const weather = {
            id: `Weather-${lat}-${lon}`,
            type: "WeatherObservation",
            areaName, // tên phố/khu vực
            location: { type: "Point", coordinates: [lon, lat] },
            temperature: data.main && data.main.temp,
            humidity: data.main && data.main.humidity,
            rainfall: rain,
            pressure: data.main && data.main.pressure,
            windSpeed: data.wind && data.wind.speed,
            observedAt: data.dt ? new Date(data.dt * 1000) : new Date(),
            source: "OpenWeatherMap"
        };

        // Cập nhật hoặc thêm mới dữ liệu thời tiết
        const updated = await Weather.findOneAndUpdate(
            { id: weather.id },
            weather,
            { upsert: true, new: true }
        );

        return updated;
    } catch (error) {
        console.error("Không lấy được dữ liệu từ OpenWeatherMap:", error.message);
        throw error;
    }
};

// Lấy và lưu dữ liệu thời tiết cho tất cả monitoring areas
export const fetchAndSaveWeatherForAllAreas = async () => {
    try {
        const areas = await MonitoringArea.find({});
        for (const area of areas) {
            const [lon, lat] = area.location.coordinates;
            await getWeatherDataForLocation(lat, lon, area.name);
        }
        console.log('Đã cập nhật thời tiết cho tất cả monitoring areas');
    } catch (err) {
        console.error('Lỗi khi cập nhật thời tiết:', err.message);
    }
};


// Lấy tất cả dữ liệu thời tiết trong Mongo
export const getAllWeatherData = async () => {
    return await Weather.find().sort({ observedAt: -1 });
};
