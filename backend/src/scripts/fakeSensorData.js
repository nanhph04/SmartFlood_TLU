import Sensor from "../models/Sensor.js";
import SensorReading from "../models/SensorReading.js";
import Weather from "../models/Weather.js";
import mongoose from "mongoose";

// Hàm tìm weather gần nhất với sensor
async function getNearestWeather(sensor) {
    return await Weather.findOne({
        location: {
            $near: {
                $geometry: sensor.location,
                $maxDistance: 2000 // 2km
            }
        }
    }).sort({ observedAt: -1 });
}

// Hàm tạo dữ liệu giả cho 1 cảm biến dựa trên weather gần nhất
async function fakeReading(sensor) {
    const weather = await getNearestWeather(sensor);
    let temperature, humidity;
    if (weather) {
        // Thêm nhiễu nhỏ cho dữ liệu sensor
        temperature = +(weather.temperature + (Math.random() - 0.5) * 1.5).toFixed(1);
        humidity = +(weather.humidity + (Math.random() - 0.5) * 5).toFixed(1);
    } else {
        temperature = +(20 + Math.random() * 15).toFixed(1);
        humidity = +(60 + Math.random() * 30).toFixed(1);
    }
    // Water level phụ thuộc vào lượng mưa nếu có weather, ngẫu nhiên nếu không
    let waterLevel = 0;
    if (weather && weather.rainfall) {
        waterLevel = +(Math.max(0, Math.min(2, weather.rainfall * 0.1 + Math.random() * 0.5))).toFixed(2);
    } else {
        waterLevel = +(Math.random() * 2).toFixed(2);
    }
    const severity = waterLevel > 1.5 ? "high" : waterLevel > 1 ? "medium" : "low";
    return {
        id: `reading-${sensor.id}-${Date.now()}`,
        sensorId: sensor.id,
        location: sensor.location,
        waterLevel,
        temperature,
        humidity,
        observedAt: new Date(),
        severity
    };
}

async function createFakeReadingsForAllSensors() {
    const sensors = await Sensor.find();
    for (const sensor of sensors) {
        const readingData = await fakeReading(sensor);
        const reading = new SensorReading(readingData);
        await reading.save();
        console.log(`Created fake reading for sensor ${sensor.id}`);
    }
}

// Kết nối DB và chạy định kỳ
async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    await createFakeReadingsForAllSensors();
    setInterval(createFakeReadingsForAllSensors, 60 * 60 * 1000); // mỗi 1 tiếng
}

main();
