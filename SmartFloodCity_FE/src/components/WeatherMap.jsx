// File: src/components/WeatherMap/WeatherMap.jsx

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import L from "leaflet";

// 1. IMPORT CSS MỚI
import "./WeatherMap.css";
import "leaflet/dist/leaflet.css";

// Fix icon default của Leaflet (GIỮ NGUYÊN)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

// -----------------------------------------------------------------
// 2. TẠO CÁC HÀM ICON MỚI (THAY THẾ CÁC SVG CŨ)
// -----------------------------------------------------------------

// Hàm tạo icon CẢM BIẾN (Hình tròn)
const getSensorIcon = (severity) => {
    let color = "#28a745"; // Xanh (Bình thường)
    if (severity === 'medium') {
        color = "#ffc107"; // Vàng (Cảnh báo)
    } else if (severity === 'high') {
        color = "#dc3545"; // Đỏ (Nguy hiểm)
    }

    // Dùng L.DivIcon để tạo icon bằng HTML/CSS (SVG)
    return new L.DivIcon({
        className: 'custom-marker', // Lớp CSS chung
        html: `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="${color}" stroke="#ffffff" stroke-width="2"/>
            </svg>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
};

// Hàm tạo icon THỜI TIẾT (Hình tam giác)
const getWeatherIcon = (rainfall) => {
    // Trong ảnh, tam giác có màu cam và đỏ
    let color = rainfall >= 20 ? "#d73027" : "#fc8d59"; // Đỏ (nhiều) hoặc Cam (ít)

    return new L.DivIcon({
        className: 'custom-marker',
        html: `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 22H22L12 2Z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
            </svg>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
};


// -----------------------------------------------------------------
// COMPONENT CHÍNH (LOGIC GIỮ NGUYÊN, JSX THAY ĐỔI)
// -----------------------------------------------------------------

export default function WeatherMap() {
    // --- PHẦN LOGIC DATA CỦA BẠN (GIỮ NGUYÊN) ---
    const [weatherData, setWeatherData] = useState([]);
    const [sensorData, setSensorData] = useState([]);
    const [socket] = useState(() => io("http://localhost:5001"));

    // Helper: convert NGSI-LD FloodSensor entity (keyValues format) to flat format used by map
    const flattenFloodSensor = (ent) => {
        if (!ent) return null;
        // keyValues format from Orion-LD: properties are direct values, not nested objects
        const waterLevel = ent.waterLevel;
        const location = ent.location;
        const observedAt = ent.lastReadingAt ?? ent.observedAt ?? new Date().toISOString();
        const areaName = ent.areaName;
        const sensorId = ent.id?.split(':').pop();
        const status = ent.status;
        // Severity heuristic
        let severity = status || 'normal';
        if (typeof waterLevel === 'number') {
            if (waterLevel >= 0.7) severity = 'high';
            else if (waterLevel >= 0.3) severity = 'medium';
        }
        return {
            id: ent.id,
            sensorId,
            waterLevel,
            location,
            areaName,
            status,
            severity,
            observedAt
        };
    };

    const normalizeInitialSensors = (arr) => arr.map(s => {
        const flat = flattenFloodSensor({ ...s, id: s.id || s.id, lastReadingAt: s.lastReadingAt });
        return flat;
    });

    useEffect(() => {
        axios.get("http://localhost:5001/api/weather")
            .then(res => setWeatherData(res.data))
            .catch(err => console.error(err));
        axios.get("http://localhost:5001/api/sensors")
            .then(res => setSensorData(normalizeInitialSensors(res.data)))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        // Legacy event name
        socket.on("sensor-update", (newReading) => {
            setSensorData(prev => {
                const idx = prev.findIndex(r => r.sensorId === newReading.sensorId);
                if (idx !== -1) {
                    const updated = [...prev];
                    updated[idx] = newReading;
                    return updated;
                }
                return [...prev, newReading];
            });
        });

        // New NGSI-LD driven updates for FloodSensor
        socket.on('floodSensorUpdate', (entity) => {
            console.log('[WebSocket] Received floodSensorUpdate:', entity);
            const flat = flattenFloodSensor(entity);
            if (!flat || !flat.location?.coordinates) {
                console.warn('[WebSocket] Invalid entity or missing location:', entity);
                return;
            }

            setSensorData(prev => {
                const idx = prev.findIndex(s => s.id === flat.id);
                if (idx !== -1) {
                    const updated = [...prev];
                    updated[idx] = { ...updated[idx], ...flat };
                    console.log('[WebSocket] Updated sensor:', flat.id);
                    return updated;
                }
                console.log('[WebSocket] Added new sensor:', flat.id);
                return [...prev, flat];
            });
        });

        // New NGSI-LD driven updates for WeatherObservation
        socket.on('weatherUpdate', (entity) => {
            console.log('[WebSocket] Received weatherUpdate:', entity);
            if (!entity || !entity.location?.coordinates) {
                console.warn('[WebSocket] Invalid weather entity or missing location:', entity);
                return;
            }

            setWeatherData(prev => {
                const idx = prev.findIndex(w => w.id === entity.id);
                if (idx !== -1) {
                    const updated = [...prev];
                    updated[idx] = { ...updated[idx], ...entity };
                    console.log('[WebSocket] Updated weather:', entity.id);
                    return updated;
                }
                console.log('[WebSocket] Added new weather:', entity.id);
                return [...prev, entity];
            });
        });

        return () => {
            socket.off("sensor-update");
            socket.off("floodSensorUpdate");
            socket.off("weatherUpdate");
        };
    }, [socket]);
    // --- KẾT THÚC PHẦN LOGIC ---


    // --- 3. THAY ĐỔI JSX ĐỂ GIỐNG VỚI ẢNH ---
    return (
        <div className="map-wrapper">

            {/* Tiêu đề và Chú thích (Legend) */}
            <div className="map-header">
                <h2 className="map-title">Bản đồ giám sát ngập lụt</h2>
                <div className="map-legend">
                    <div className="legend-item">
                        <span className="legend-color normal"></span> Bình thường
                    </div>
                    <div className="legend-item">
                        <span className="legend-color warning"></span> Cảnh báo
                    </div>
                    <div className="legend-item">
                        <span className="legend-color danger"></span> Nguy hiểm
                    </div>
                </div>
            </div>

            {/* MapContainer được bo góc và có chiều cao cố định */}
            <MapContainer
                center={[21.03, 105.85]}
                zoom={12} // Zoom vào gần hơn 1 chút
                style={{ height: "600px", width: "100%", borderRadius: "16px", zIndex: 400 }}
                scrollWheelZoom={false} // Tắt zoom bằng cuộn chuột cho đẹp
            >
                {/* 4. THAY ĐỔI NỀN BẢN ĐỒ */}
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {/* Marker thời tiết (Tam giác) */}
                {weatherData.map((item) => {
                    const [lon, lat] = item.location.coordinates;
                    const rainfall = item.rainfall || 0;
                    return (
                        <Marker
                            key={item.id}
                            position={[lat, lon]}
                            // 5. SỬ DỤNG ICON MỚI
                            icon={getWeatherIcon(rainfall)}
                        >
                            <Popup>
                                <strong>📍 {item.areaName || item.id} (Trạm thời tiết)</strong><br />
                                🌡 Nhiệt độ: {item.temperature}°C<br />
                                💧 Độ ẩm: {item.humidity}%<br />
                                🌧 Lượng mưa: {rainfall} mm<br />
                                🕒 {new Date(item.observedAt).toLocaleString()}
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Marker cảm biến (Hình tròn) */}
                {sensorData.map((sensor) => {
                    const [lon, lat] = sensor.location.coordinates;
                    return (
                        <Marker
                            key={sensor.id}
                            position={[lat, lon]}
                            // 6. SỬ DỤNG ICON MỚI
                            icon={getSensorIcon(sensor.severity)}
                        >
                            <Popup>
                                <strong>📍 {sensor.areaName || sensor.sensorId} (Cảm biến)</strong><br />
                                💧 Độ ngập: {sensor.waterLevel} m<br />
                                ⚠️ Cảnh báo: <span style={{ fontWeight: 'bold' }}>{sensor.severity}</span><br />
                                🕒 {new Date(sensor.observedAt).toLocaleString()}
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Tag vị trí ở góc */}
            <div className="map-footer-tag">
                TP. Hà Nội - Khu vực trung tâm
            </div>
        </div>
    );
}