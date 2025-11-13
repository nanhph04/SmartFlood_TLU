import axios from "axios";
import { createAreaEntity } from '../entities/MonitoringArea.js';

const ORION_LD_URL = process.env.ORION_LD_URL || 'http://localhost:1026/ngsi-ld/v1/entities';

// Lấy tất cả khu vực giám sát
export const getAllAreas = async (req, res) => {
    try {
        const response = await axios.get(ORION_LD_URL + '?type=MonitoringArea', {
            headers: { 'Accept': 'application/ld+json' }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Không lấy được danh sách khu vực' });
    }
};

// Tạo mới khu vực giám sát
export const createArea = async (req, res) => {
    try {
        const entity = createAreaEntity(req.body);
        await axios.post(ORION_LD_URL, entity, {
            headers: { 'Content-Type': 'application/ld+json' }
        });
        res.status(201).json({ message: 'Đã tạo khu vực trên Orion-LD' });
    } catch (err) {
        res.status(400).json({ error: 'Không tạo được khu vực', detail: err.message });
    }
};

// Lấy khu vực theo id
export const getAreaById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${ORION_LD_URL}/${id}`, {
            headers: { 'Accept': 'application/ld+json' }
        });
        res.json(response.data);
    } catch (err) {
        res.status(404).json({ error: 'Không tìm thấy khu vực' });
    }
};

// Cập nhật khu vực
export const updateArea = async (req, res) => {
    try {
        let { id } = req.params;
        // Loại bỏ khoảng trắng và dấu / ở đầu/cuối id
        id = id.trim().replace(/^\/+|\/+$/g, '');
        id = id.replace(/[\s\/]+$/g, '');

        // Lọc bỏ các trường không hợp lệ khỏi body PATCH
        const attrs = { ...req.body };
        delete attrs.id;
        delete attrs.type;
        // Đảm bảo luôn có @context
        attrs['@context'] = attrs['@context'] || "http://host.docker.internal:5001/context.jsonld";

        await axios.patch(`${ORION_LD_URL}/${id}/attrs`, attrs, {
            headers: { 'Content-Type': 'application/ld+json' },
        });

        res.json({ message: 'Đã cập nhật khu vực' });
    } catch (err) {
        console.error('Lỗi cập nhật khu vực:', err.message);
        res.status(400).json({ error: 'Không cập nhật được khu vực', detail: err.message });
    }
};


// Xóa khu vực
export const deleteArea = async (req, res) => {
    try {
        const { id } = req.params;
        await axios.delete(`${ORION_LD_URL}/${id}`);
        res.json({ message: 'Đã xóa khu vực' });
    } catch (err) {
        res.status(400).json({ error: 'Không xóa được khu vực' });
    }
};