// src/models/report.model.js
import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    ip: { type: String, index: true },
    status: { type: String, enum: ['pending','approved','rejected'], default: 'pending', index: true },
    address: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    level: { type: Number, min: 1, max: 5, required: true },
    waterDepthCm: { type: Number, min: 0 },
    description: String,
    images: [String],
    city: String,
    district: String,
    ward: String,
    approvedBy: String,
    approvedAt: Date,
  },
  { timestamps: true }
);

// Index sẵn có...
ReportSchema.index({ location: '2dsphere' });
ReportSchema.index({ status: 1, location: '2dsphere' });
ReportSchema.index({ status: 1, createdAt: -1 });

// 👇 thêm index hỗ trợ đếm theo IP trong ngày
ReportSchema.index({ ip: 1, createdAt: 1 });

export default mongoose.model('Report', ReportSchema);
