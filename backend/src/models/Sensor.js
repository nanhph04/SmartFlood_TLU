import mongoose from "mongoose";

const SensorSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    type: { type: String, default: "FloodSensor" },
    name: { type: String },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [lon, lat]
            required: true
        }
    },
    status: { type: String, enum: ["active", "inactive", "faulty"], default: "active" },
    installedAt: { type: Date, default: Date.now },
    lastMaintenance: { type: Date },
    description: { type: String },
    waterLevel: { type: Number },  // đơn vị: cm
    batteryLevel: { type: Number }, // %
    lastReadingAt: { type: Date }

});

// Chuyển sang GeoJSON chuẩn NGSI-LD khi xuất
SensorSchema.methods.toNGSILD = function () {
    return {
        "@context": "https://smartdatamodels.org/context.jsonld",
        "id": `urn:ngsi-ld:FloodSensor:${this.id}`,
        "type": "FloodSensor",
        "name": { "type": "Property", "value": this.name },
        "status": { "type": "Property", "value": this.status },
        "location": {
            "type": "GeoProperty",
            "value": {
                "type": "Point",
                "coordinates": this.location.coordinates
            }
        },
        "installedAt": {
            "type": "Property",
            "value": this.installedAt
        },
        "lastMaintenance": {
            "type": "Property",
            "value": this.lastMaintenance
        },
        "description": { "type": "Property", "value": this.description },
        "waterLevel": { "type": "Property", "value": this.waterLevel },
        "batteryLevel": { "type": "Property", "value": this.batteryLevel },
        "lastReadingAt": { "type": "Property", "value": this.lastReadingAt }

    };
};

export default mongoose.model("Sensor", SensorSchema);
