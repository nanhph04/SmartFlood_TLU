import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import morgan from 'morgan';
import weather from './routes/weather.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/weather", weather);
// app.use("/api/users", userRoutes);
// app.use("/api/reports", reportRoutes);
// app.use("/api/sensors", sensorRoutes);
// app.use("/api/rdf", rdfRoutes);

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
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));