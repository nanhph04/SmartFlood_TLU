import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import http from 'http';
import { Server } from 'socket.io';

import connectDB from './configs/db.js';
import weather from './routes/weather.routes.js';
import streetRoutes from './routes/monitoringarea.route.js';
import sensorRoutes from './routes/sensor.route.js';
import { fetchAndSaveWeatherForAllAreas } from './services/weatherService.js';
import readingRoutes from './routes/reading.route.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();


// --- App & Middleware ---
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// --- Routes ---
app.use('/api/weather', weather);
app.use('/api/streets', streetRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('   ', readingRoutes);

// --- DB ---
connectDB();

// --- Root route ---
app.get('/', (_req, res) => res.send('Chào mừng đến với API Smart Flood Management System'));

// --- Error handler ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});


// --- Weather + Fake Sensor Data ---
async function fetchWeatherAndFakeSensor() {
    await fetchAndSaveWeatherForAllAreas();
    exec('node ./src/scripts/fakeSensorData.js', { cwd: __dirname + '/../' }, (err, stdout, stderr) => {
        if (err) console.error('Fake sensor data error:', err);
        else console.log('Fake sensor data:', stdout);
    });
}

// --- Start server with socket.io ---
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
});

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    fetchWeatherAndFakeSensor();
    setInterval(fetchWeatherAndFakeSensor, 60 * 60 * 1000);
});