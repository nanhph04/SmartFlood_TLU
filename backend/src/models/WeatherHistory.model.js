import mongoose from 'mongoose';

const WeatherHistorySchema = new mongoose.Schema({
    areaId: { type: String, required: true, index: true },
    areaName: { type: String },
    longitude: { type: Number },
    latitude: { type: Number },
    temperature: { type: Number },
    humidity: { type: Number },
    rainfall: { type: Number },
    pressure: { type: Number },
    windSpeed: { type: Number },
    observedAt: { type: Date, required: true },
    source: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('WeatherHistory', WeatherHistorySchema);
