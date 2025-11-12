import Sensor from "../models/Sensor.js";

// Tạo cảm biến mới
export const createSensor = async (req, res) => {
    try {
        const sensor = new Sensor(req.body);
        await sensor.save();
        res.status(201).json(sensor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Lấy cảm biến theo id
export const getSensorById = async (req, res) => {
    try {
        const { id } = req.params;
        const sensor = await Sensor.findOne({ id });
        if (!sensor) return res.status(404).json({ error: "Sensor not found" });
        res.json(sensor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Sửa thông tin cảm biến
export const updateSensor = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Sensor.findOneAndUpdate({ id }, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "Sensor not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Xem chi tiết thông tin cảm biến (giống getSensorById, nhưng có thể mở rộng thêm thông tin liên quan nếu cần)
export const getSensorDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const sensor = await Sensor.findOne({ id });
        if (!sensor) return res.status(404).json({ error: "Sensor not found" });
        // Có thể populate thêm thông tin liên quan ở đây nếu cần
        res.json(sensor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lấy toàn bộ cảm biến
export const getAllSensors = async (req, res) => {
    try {
        const sensors = await Sensor.find();
        res.json(sensors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lấy cảm biến theo tuyến đường (theo areaName hoặc streetId truyền qua query)
export const getSensorsByStreet = async (req, res) => {
    try {
        const { street } = req.query;
        if (!street) return res.status(400).json({ error: "Missing street parameter" });
        // Giả sử cảm biến có trường areaName hoặc streetId
        const sensors = await Sensor.find({ areaName: street });
        res.json(sensors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Xuất dữ liệu NGSI-LD
export const exportSensorsNGSILD = async (req, res) => {
    try {
        const sensors = await Sensor.find();
        const ngsiData = sensors.map(s => s.toNGSILD());
        res.json(ngsiData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
