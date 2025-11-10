import { getWeatherDataForLocation, getAllWeatherData } from "../services/weatherService.js";

// Lấy toàn bộ dữ liệu lưu trong Mongo
import Weather from "../models/Weather.js";

export const getWeather = async (req, res) => {
    try {
        // Lấy bản ghi mới nhất cho mỗi tuyến phố (theo id)
        const data = await Weather.aggregate([
            { $sort: { observedAt: -1 } },
            {
                $group: {
                    _id: "$id",
                    doc: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$doc" } }
        ]);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Không lấy được dữ liệu thời tiết" });
    }
};

// Lấy dữ liệu thời tiết theo tọa độ (lat, lon)
export const getWeatherByLocation = async (req, res) => {
    const { lat, lon } = req.query; // dùng query ?lat=...&lon=...

    if (!lat || !lon) {
        return res.status(400).json({ error: "Thiếu tham số lat hoặc lon" });
    }

    try {
        const data = await getWeatherDataForLocation(lat, lon);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Không lấy được dữ liệu thời tiết cho vị trí này" });
    }
};
