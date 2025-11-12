import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import L from "leaflet";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// SVG icon cho sensor (cảm biến)
const sensorSVG = encodeURIComponent(`
<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="14" cy="14" r="13" fill="#fff" stroke="#333" stroke-width="2"/>
<rect x="9" y="8" width="10" height="12" rx="3" fill="#2196f3"/>
<rect x="12" y="12" width="4" height="6" rx="2" fill="#fff"/>
<circle cx="14" cy="11" r="1.5" fill="#2196f3"/>
</svg>`);
const sensorIcon = new L.Icon({
    iconUrl: `data:image/svg+xml,${sensorSVG}`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
});

// SVG icon cho weather (mây mưa)
const weatherSVG = encodeURIComponent(`
<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="14" cy="18" rx="8" ry="4" fill="#90caf9"/>
<ellipse cx="14" cy="13" rx="7" ry="6" fill="#fff"/>
<ellipse cx="19" cy="15" rx="4" ry="3" fill="#90caf9"/>
<ellipse cx="9" cy="15" rx="4" ry="3" fill="#90caf9"/>
</svg>`);
const weatherIcon = new L.Icon({
    iconUrl: `data:image/svg+xml,${weatherSVG}`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
});

// Custom marker icons by rainfall
const getRainColor = (rainfall) => {
    if (rainfall >= 50) return "#d73027"; // đỏ
    if (rainfall >= 20) return "#fc8d59"; // cam
    if (rainfall >= 5) return "#fee08b"; // vàng
    return "#1a9850"; // xanh lá
};

const createColoredIcon = (color) => new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 4px #333;display:flex;align-items:center;justify-content:center;font-size:14px;color:#fff;font-weight:bold;">●</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
});

// icon fix for Leaflet in React (Leaflet default icon bị lỗi nếu không thêm dòng này)
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

export default function WeatherMap() {
    const [weatherData, setWeatherData] = useState([]);
    const [sensorData, setSensorData] = useState([]);
    // Khởi tạo socket chỉ 1 lần
    const [socket] = useState(() => io("http://localhost:5001"));

    useEffect(() => {
        // Gọi API lấy dữ liệu thời tiết
        axios.get("http://localhost:5001/api/weather")
            .then(res => setWeatherData(res.data))
            .catch(err => console.error(err));
        // Gọi API lấy bản ghi cảm biến mới nhất của từng sensor
        axios.get("http://localhost:5001/api/readings/latest")
            .then(res => setSensorData(res.data))
            .catch(err => console.error(err));
    }, []);

    // Lắng nghe realtime sensor-update
    useEffect(() => {
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
        return () => socket.off("sensor-update");
    }, [socket]);

    return (
        <MapContainer center={[21.03, 105.85]} zoom={6} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marker thời tiết */}
            {weatherData.map((item) => {
                const [lon, lat] = item.location.coordinates;
                const rainfall = item.rainfall || 0;
                return (
                    <Marker key={item.id} position={[lat, lon]} icon={weatherIcon}>
                        <Popup>
                            <strong>📍 {item.areaName || item.id}</strong><br />
                            🌡 Nhiệt độ: {item.temperature}°C<br />
                            💧 Độ ẩm: {item.humidity}%<br />
                            🌧 Lượng mưa: {rainfall} mm<br />
                            🕒 {new Date(item.observedAt).toLocaleString()}
                        </Popup>
                    </Marker>
                );
            })}

            {/* Marker cảm biến */}
            {sensorData.map((sensor) => {
                const [lon, lat] = sensor.location.coordinates;
                return (
                    <Marker key={sensor.id} position={[lat, lon]} icon={sensorIcon}>
                        <Popup>
                            <strong>📍 {sensor.areaName || sensor.sensorId}</strong><br />
                            💧 Độ ngập: {sensor.waterLevel} m<br />
                            🏠 Vị trí: {sensor.areaName || 'Chưa rõ'}<br />
                            ⚠️ Mức cảnh báo: <span style={{ color: sensor.severity === 'high' ? '#d73027' : sensor.severity === 'medium' ? '#fee08b' : '#1a9850', fontWeight: 'bold' }}>{sensor.severity}</span><br />
                            🕒 {new Date(sensor.observedAt).toLocaleString()}
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}

