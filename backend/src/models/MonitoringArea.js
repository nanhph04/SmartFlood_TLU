import mongoose from 'mongoose';

const monitoringAreaSchema = new mongoose.Schema({
    name: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
        }
    },
    osm_id: String
}, { timestamps: true });

monitoringAreaSchema.index({ location: '2dsphere' });

const MonitoringArea = mongoose.model('MonitoringArea', monitoringAreaSchema, 'monitoringareas');
export default MonitoringArea;