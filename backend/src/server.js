import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';


import connectDB from './configs/db.js';
import apiRoutes from './api/index.js';
import contextRoute from './api/context.api.js';
import { setupSocket } from './socket/index.js';
import { createFakeReadingsForAllSensors } from './scripts/fakeSensorData.js';


dotenv.config();

const {
    PORT = 5001,
    NODE_ENV = 'development',
    CORS_ORIGIN = '*',
    JSON_LIMIT = '5mb',
    URLENCODED_LIMIT = '5mb',
} = process.env;

const app = express();

// --- Middlewares ---
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: URLENCODED_LIMIT }));
// Debug: log incoming requests for troubleshooting JSON issues

if (NODE_ENV !== 'production') app.use(morgan('dev'));

// --- Routes ---
app.get('/', (_req, res) => res.send('Chào mừng đến với API Smart Flood Management System'));

// Route phục vụ context.jsonld
app.use(contextRoute);

app.use('/api', apiRoutes);

// --- 404 handler ---
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// --- Error handler ---
app.use((err, _req, res, _next) => {
    if (NODE_ENV !== 'production') console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// --- Socket.io setup ---
const { io, server } = setupSocket(app);
export { io };

const start = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

        // --- Chạy fake data ngay sau khi server start ---
        await createFakeReadingsForAllSensors();

        // --- Set interval chạy định kỳ ---
        setInterval(async () => {
            console.log('--- Interval: sinh dữ liệu giả ---');
            try {
                await createFakeReadingsForAllSensors();
            } catch (err) {
                console.error('Error in interval fake data:', err.message);
            }
        }, 30 * 60 * 1000); // 30 phút
    } catch (e) {
        console.error('❌ Failed to start server:', e);
        process.exit(1);
    }
};

start();

