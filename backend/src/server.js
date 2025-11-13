import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './configs/db.js';
import weather from './routes/weather.routes.js';
import reportRoutes from './routes/report.routes.js';
import initSocket from './socket/index.js';
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';

dotenv.config();

const {
  PORT = 5001,
  NODE_ENV = 'development',
  CORS_ORIGIN = '*',
  JSON_LIMIT = '5mb',
  URLENCODED_LIMIT = '5mb',
} = process.env;

const app = express();

// --- Middlewares cơ bản ---
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: URLENCODED_LIMIT }));
if (NODE_ENV !== 'production') app.use(morgan('dev'));

// Tạo HTTP server và Socket.IO trước khi mount routes cần req.io
const server = http.createServer(app);
const io = initSocket(server, CORS_ORIGIN);

// Gắn io vào req (middleware đúng chữ ký)
app.use((req, _res, next) => { req.io = io; next(); });

// --- Routes ---
app.get('/', (_req, res) => {
  res.send('Chào mừng đến với API Smart Flood Management System');
});

app.use('/api/weather', weather);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);

// --- 404 handler ---
app.use((req, res, _next) => res.status(404).json({ message: 'Not Found' }));

// --- Error handler 4 tham số ---
app.use((err, _req, res, _next) => {
  if (NODE_ENV !== 'production') console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// --- Khởi động server sau khi DB sẵn sàng ---
const start = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (e) {
    console.error('❌ Failed to start server:', e);
    process.exit(1);
  }
};

start();
