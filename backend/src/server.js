import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { Server } from 'socket.io';

import connectDB from './configs/db.js';
import weather from './routes/weather.routes.js';
import streetRoutes from './routes/monitoringarea.route.js';
import sensorRoutes from './routes/sensor.route.js';
import { fetchAndSaveWeatherForAllAreas } from './services/weatherService.js';
import readingRoutes from './routes/reading.route.js';

dotenv.config();

const {
    PORT = 5001,
    NODE_ENV = 'development',
    CORS_ORIGIN = '*',
    JSON_LIMIT = '5mb',
    URLENCODED_LIMIT = '5mb',
} = process.env;

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// --- Middlewares ---
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: URLENCODED_LIMIT }));
if (NODE_ENV !== 'production') app.use(morgan('dev'));

// --- Routes ---
app.get('/', (_req, res) => res.send('Chào mừng đến với API Smart Flood Management System'));
app.use('/api/weather', weather);
app.use('/api/streets', streetRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/readings', readingRoutes);

// --- 404 handler ---
app.use((req, res, _next) => res.status(404).json({ message: 'Not Found' }));

// --- Error handler ---
app.use((err, _req, res, _next) => {
    if (NODE_ENV !== 'production') console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
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
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
});

const start = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            fetchWeatherAndFakeSensor();
            setInterval(fetchWeatherAndFakeSensor, 60 * 60 * 1000);
        });
    } catch (e) {
        console.error('❌ Failed to start server:', e);
        process.exit(1);
    }
};

start();
