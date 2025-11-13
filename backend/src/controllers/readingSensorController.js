import SensorReading from "../models/SensorReading.js";
import { io } from "../server.js";

// Lấy bản ghi cảm biến mới nhất của từng sensor
export const getLatestReadingForEachSensor = async (req, res) => {
    try {
        // Sử dụng aggregation để lấy bản ghi mới nhất cho mỗi sensorId
        const latestReadings = await SensorReading.aggregate([
            { $sort: { observedAt: -1 } },
            {
                $group: {
                    _id: "$sensorId",
                    latest: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$latest" } }
        ]);
        res.json(latestReadings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



export const createReading = async (req, res) => {
    try {
        const reading = new SensorReading(req.body);
        await reading.save();
        // Emit realtime tới client
        io.emit("sensor-update", reading);
        res.status(201).json(reading);
    } catch (err) {
        res.status(400).json({ error: "Không thể tạo dữ liệu quan sát", details: err });
    }
};

export const getReadings = async (req, res) => {
    try {
        const format = req.query.format || "json";
        const readings = await SensorReading.find().limit(100).sort({ observedAt: -1 });

        if (format === "ngsi-ld") {
            res.json(readings.map(r => r.toNGSILD()));
        } else {
            res.json(readings);
        }
    } catch (err) {
        res.status(500).json({ error: "Không thể lấy danh sách quan sát" });
    }
};

export const getReadingsBySensor = async (req, res) => {
    try {
        const { sensorId } = req.params;
        const readings = await SensorReading.find({ sensorId }).sort({ observedAt: -1 }).limit(10);
        res.json(readings);
    } catch (err) {
        res.status(500).json({ error: "Không thể lấy dữ liệu cho cảm biến này" });
    }
};
