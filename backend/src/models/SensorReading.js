import mongoose from "mongoose";

const SensorReadingSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    type: { type: String, default: "FloodObservation" },

    // Liên kết tới cảm biến
    sensorId: { type: String, required: true, ref: "Sensor" },

    // Vị trí đo
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true } // [lon, lat]
    },

    // Giá trị đo
    waterLevel: { type: Number, required: true }, // mét
    temperature: Number, // C
    humidity: Number, // %

    // Thời gian quan sát
    observedAt: { type: Date, default: Date.now },

    // Trạng thái, ghi chú
    note: String,
    severity: { type: String, enum: ["low", "medium", "high"], default: "low" }
}, { timestamps: true });

// Tạo chỉ mục không gian
SensorReadingSchema.index({ location: "2dsphere" });

// Xuất NGSI-LD format
SensorReadingSchema.methods.toNGSILD = function () {
    return {
        "@context": "https://smartdatamodels.org/context.jsonld",
        "id": `urn:ngsi-ld:FloodObservation:${this.id}`,
        "type": "FloodObservation",
        "refDevice": {
            "type": "Relationship",
            "object": `urn:ngsi-ld:FloodSensor:${this.sensorId}`
        },
        "location": {
            "type": "GeoProperty",
            "value": {
                "type": "Point",
                "coordinates": this.location.coordinates
            }
        },
        "waterLevel": { "type": "Property", "value": this.waterLevel },
        "temperature": { "type": "Property", "value": this.temperature },
        "humidity": { "type": "Property", "value": this.humidity },
        "observedAt": { "type": "Property", "value": this.observedAt },
        "severity": { "type": "Property", "value": this.severity },
        "note": { "type": "Property", "value": this.note }
    };
};

const SensorReading = mongoose.model("SensorReading", SensorReadingSchema);
export default SensorReading;
