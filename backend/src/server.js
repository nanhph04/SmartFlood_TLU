import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import morgan from 'morgan';
import weather from './routes/weather.routes.js';
import streetRoutes from './routes/monitoringarea.route.js';
import { fetchAndSaveWeatherForAllAreas } from './services/weatherService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/weather", weather);
app.use("/api/streets", streetRoutes);

connectDB();

app.get('/', (_req, res) => {
    res.send('Chào mừng đến với API Smart Flood Management System');
});


// Xử lý lỗi tập trung
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // Gọi ngay khi khởi động
    fetchAndSaveWeatherForAllAreas();
    // Lặp lại mỗi 1 giờ
    setInterval(fetchAndSaveWeatherForAllAreas, 1 * 60 * 60 * 1000);
});