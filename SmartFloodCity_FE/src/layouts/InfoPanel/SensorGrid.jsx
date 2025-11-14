import React, { useState, useEffect } from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import './InfoPanel.css';

// --- DỮ LIỆU MẪU & API RỖNG ---
const fetchSensorData = () => {
    console.log("Đang gọi API (giả) lấy dữ liệu cảm biến...");
    // Dữ liệu mẫu
    const mockSensors = [
        { id: 1, name: "Cảm biến Nguyễn Huệ", location: "Đường Nguyễn Huệ, Quận 1", waterLevel: 41.45, maxLevel: 100, status: "Bình thường" },
        { id: 2, name: "Cảm biến Lê Lợi", location: "Đường Lê Lợi, Quận 1", waterLevel: 70.33, maxLevel: 100, status: "Nguy hiểm" },
        { id: 3, name: "Cảm biến Lý Tự Trọng", location: "Đường Lý Tự Trọng, Quận 1", waterLevel: 92.93, maxLevel: 100, status: "Nguy hiểm" },
        { id: 4, name: "Cảm biến Nguyễn Thị Minh Khai", location: "Đường Nguyễn Thị Minh Khai, Quận 3", waterLevel: 33.79, maxLevel: 100, status: "Bình thường" },
        { id: 5, name: "Cảm biến Cách Mạng Tháng 8", location: "Đường Cách Mạng Tháng 8, Quận 10", waterLevel: 56.57, maxLevel: 100, status: "Cảnh báo" },
        { id: 6, name: "Cảm biến Võ Văn Tần", location: "Đường Võ Văn Tần, Quận 3", waterLevel: 31.51, maxLevel: 100, status: "Bình thường" },
    ];

    return new Promise(resolve => setTimeout(() => resolve(mockSensors), 500));
};

// --- COMPONENT ---
export default function SensorGrid() {
    const [sensors, setSensors] = useState([]);

    useEffect(() => {
        fetchSensorData().then(data => setSensors(data));
    }, []);

    // Hàm helper để lấy class màu cho status và thanh progress
    const getStatusClass = (status) => {
        if (status === "Nguy hiểm") return 'danger';
        if (status === "Cảnh báo") return 'warning';
        return 'normal';
    };

    return (
        <div className="sensor-grid-container">
            <h3>Cảm biến thời gian thực</h3>
            <div className="sensor-grid">
                {sensors.map(sensor => (
                    <div className="sensor-card" key={sensor.id}>
                        <div className="sensor-card-header">
                            <div className="sensor-card-icon"><IoLocationSharp /></div>
                            <div className="sensor-card-title">
                                <strong>{sensor.name}</strong>
                                <span>{sensor.location}</span>
                            </div>
                        </div>

                        <div className="sensor-card-body">
                            <span className="sensor-label">Mực nước</span>
                            <div className={`sensor-status ${getStatusClass(sensor.status)}`}>
                                {sensor.status}
                            </div>
                        </div>

                        <div className="sensor-progress-bar">
                            <div
                                className={`progress-bar-fill ${getStatusClass(sensor.status)}`}
                                style={{ width: `${(sensor.waterLevel / sensor.maxLevel) * 100}%` }}
                            ></div>
                        </div>

                        <div className="sensor-card-footer">
                            <span className="sensor-value">
                                {sensor.waterLevel.toFixed(2)} / {sensor.maxLevel}cm
                            </span>
                            <span className="sensor-update-time">Cập nhật vài giây trước</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}