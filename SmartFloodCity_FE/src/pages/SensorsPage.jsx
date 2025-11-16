
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import StatusPill from "../components/admin/StatusPill.jsx";
import SensorModal from "../components/admin/SensorModal.jsx";
import {
  getSensors,
  createSensor,
  deleteSensor,
} from "../services/sensorsApi";

function SensorsPage() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    waterLevel: 0,
    status: "normal",
  });
  // Socket instance (singleton)
  const [socket] = useState(() => io("http://localhost:5001"));

  const fetchSensors = async () => {
    setLoading(true);
    try {
      const res = await getSensors();
      setSensors(res.data || []);
      setError("");
    } catch (err) {
      setError("Không thể tải danh sách cảm biến");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
    // Realtime update: listen for floodSensorUpdate
    socket.on('floodSensorUpdate', (entity) => {
      // Flatten entity to match sensors list
      if (!entity || !entity.id) return;
      setSensors(prev => {
        const idx = prev.findIndex(s => s.id === entity.id);
        if (idx !== -1) {
          // Update existing sensor
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...entity };
          return updated;
        }
        // Add new sensor
        return [...prev, entity];
      });
    });
    return () => {
      socket.off('floodSensorUpdate');
    };
    // eslint-disable-next-line
  }, [socket]);

  const handleAdd = () => {
    setForm({
      deviceId: "",
      name: "",
      areaName: "",
      longitude: "",
      latitude: "",
      waterLevel: 0,
      batteryLevel: 100,
      // status will be set by waterLevel
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa cảm biến này?")) return;
    try {
      await deleteSensor(id);
      setSensors((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Xóa thất bại");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build location object from longitude/latitude
      const { deviceId, name, areaName, longitude, latitude, waterLevel, batteryLevel } = form;
      const wl = Number(waterLevel);
      let status = "active";
      if (wl >= 50) status = "danger";
      else if (wl >= 20) status = "warning";
      else status = "normal";
      const location = {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)]
      };
      const payload = {
        deviceId: deviceId || name.replace(/\s+/g, '-').toLowerCase(),
        name,
        areaName,
        waterLevel: wl,
        batteryLevel: Number(batteryLevel),
        status,
        location
      };
      const res = await createSensor(payload);
      setSensors((prev) => [...prev, res.data]);
      setShowModal(false);
    } catch {
      alert("Lưu thất bại");
    }
  };

  return (
    <section className="bg-white rounded-3xl shadow-lg shadow-sky-100 p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Quản lý cảm biến</h2>
          <p className="text-xs text-slate-500">
            Tổng số: {sensors.length} cảm biến
          </p>
        </div>
        <button
          className="px-4 py-2 text-sm rounded-full bg-sky-500 text-white hover:bg-sky-600"
          onClick={handleAdd}
        >
          + Thêm cảm biến
        </button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b">
              <th className="pb-2 pr-4 font-medium">ID</th>
              <th className="pb-2 pr-4 font-medium">Tên cảm biến</th>
              <th className="pb-2 pr-4 font-medium">Loại</th>
              <th className="pb-2 pr-4 font-medium">Vị trí (Kinh độ, Vĩ độ)</th>
              <th className="pb-2 pr-4 font-medium">Mực nước (cm)</th>
              <th className="pb-2 pr-4 font-medium">Cảnh báo ngập</th>
              <th className="pb-2 pr-4 font-medium">Pin (%)</th>
              <th className="pb-2 pr-4 font-medium">Trạng thái</th>
              <th className="pb-2 pr-4 font-medium">Lần đọc cuối</th>
              <th className="pb-2 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((sensor) => {
              // Xử lý mức độ cảnh báo ngập
              let severityLabel = 'Bình thường';
              let severityColor = 'bg-green-100 text-green-700';
              if (sensor.severity === 'canhbao') {
                severityLabel = 'Cảnh báo';
                severityColor = 'bg-yellow-100 text-yellow-800';
              } else if (sensor.severity === 'nguyhiem') {
                severityLabel = 'Nguy hiểm';
                severityColor = 'bg-red-100 text-red-700';
              }
              return (
                <tr
                  key={sensor.id}
                  className="border-b last:border-0 border-slate-100"
                >
                  <td className="py-3 pr-4 whitespace-nowrap text-xs text-slate-400 max-w-[180px] truncate" title={sensor.id}>{sensor.id}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sky-500">📡</span>
                      <span>{sensor.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">{sensor.type}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {typeof sensor.location === "object" && sensor.location !== null && Array.isArray(sensor.location.coordinates)
                      ? sensor.location.coordinates.join(", ")
                      : sensor.location || ""}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">{sensor.waterLevel !== undefined ? sensor.waterLevel : "-"}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${severityColor}`}>{severityLabel}</span>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">{sensor.batteryLevel !== undefined ? sensor.batteryLevel : "-"}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {(() => {
                      let label = 'Không xác định';
                      let color = 'bg-gray-100 text-gray-700';
                      if (sensor.status === 'active') {
                        label = 'Đang hoạt động';
                        color = 'bg-green-100 text-green-700';
                      } else if (sensor.status === 'inactive') {
                        label = 'Không hoạt động';
                        color = 'bg-slate-200 text-slate-600';
                      } else if (sensor.status === 'error') {
                        label = 'Lỗi';
                        color = 'bg-red-100 text-red-700';
                      }
                      return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{label}</span>;
                    })()}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {sensor.lastReadingAt ? new Date(sensor.lastReadingAt).toLocaleString() : "-"}
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3 text-slate-400">
                      <button
                        className="hover:text-rose-500"
                        onClick={() => handleDelete(sensor.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <SensorModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
      />
    </section>
  );
}

export default SensorsPage;
