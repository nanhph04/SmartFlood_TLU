import { sensors } from "../mock/mockData.js";
import StatusPill from "../components/admin/StatusPill.jsx";

function SensorsPage() {
  return (
    <section className="bg-white rounded-3xl shadow-lg shadow-sky-100 p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Quản lý cảm biến</h2>
          <p className="text-xs text-slate-500">
            Tổng số: {sensors.length} cảm biến
          </p>
        </div>
        <button className="px-4 py-2 text-sm rounded-full bg-sky-500 text-white hover:bg-sky-600">
          + Thêm cảm biến
        </button>
      </div>

      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-500 border-b">
            <th className="pb-2 pr-4 font-medium">Tên cảm biến</th>
            <th className="pb-2 pr-4 font-medium">Vị trí</th>
            <th className="pb-2 pr-4 font-medium">Mực nước</th>
            <th className="pb-2 pr-4 font-medium">Trạng thái</th>
            <th className="pb-2 pr-4 font-medium">Cập nhật</th>
            <th className="pb-2 font-medium">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sensors.map((sensor) => (
            <tr
              key={sensor.id}
              className="border-b last:border-0 border-slate-100"
            >
              <td className="py-3 pr-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="text-sky-500">📡</span>
                  <span>{sensor.name}</span>
                </div>
              </td>
              <td className="py-3 pr-4 whitespace-nowrap">
                {sensor.location}
              </td>
              <td className="py-3 pr-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <span>
                    {sensor.waterLevel.toFixed(2)}cm / {sensor.capacity}cm
                  </span>
                  <div className="flex-1 w-32 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sensor.status === "danger"
                          ? "bg-rose-500"
                          : sensor.status === "warning"
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (sensor.waterLevel / sensor.capacity) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </td>
              <td className="py-3 pr-4 whitespace-nowrap">
                <StatusPill type={sensor.status} />
              </td>
              <td className="py-3 pr-4 whitespace-nowrap">
                {sensor.updatedAt}
              </td>
              <td className="py-3 whitespace-nowrap">
                <div className="flex items-center gap-3 text-slate-400">
                  <button className="hover:text-sky-500">✏️</button>
                  <button className="hover:text-rose-500">🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default SensorsPage;
