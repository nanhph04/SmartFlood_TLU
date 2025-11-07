import { getWeatherData } from "../services/weather.service.js";

export const getWeather = async (req, res) => {
    try {
        const data = await getWeatherData();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Không lấy được dữ liệu thời tiết" });
    }
};