import mongoose from 'mongoose';

const WeatherSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    type: { type: String, default: 'WeatherObservation' },
    areaName: { type: String }, // tên phố/khu vực
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true },
    },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    rainfall: Number,
    pressure: Number,
    windSpeed: Number,
    observedAt: { type: Date, default: Date.now },
    source: { type: String, default: 'OpenWeatherMap' }
}, { timestamps: true });

WeatherSchema.index({ location: '2dsphere' });

const Weather = mongoose.model('Weather', WeatherSchema);
export default Weather;
