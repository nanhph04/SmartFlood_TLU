import { useEffect, useState } from "react";
import axios from "axios";
import KpiCard from "../components/admin/KpiCard.jsx";
import WeatherMap from "../components/WeatherMap.jsx";
import { recentActivities, sensorStatusSummary } from "../mock/mockData.js";

// Hàm tiện ích để đảm bảo giá trị là một số (hoặc 0 nếu không phải)
const safeGetTotal = (data) => {
  // Lấy data.total, nếu không tồn tại hoặc không phải là số thì trả về 0
  const total = data?.total;
  return typeof total === 'number' ? total : 0;
}

function OverviewPage() {
  const [sensorKpi, setSensorKpi] = useState({ total: 0, danger: 0, warning: 0 });
  const [pendingReports, setPendingReports] = useState(0);
  const [approvedReports, setApprovedReports] = useState(0);

  useEffect(() => {
    async function fetchSensorsKpi() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/sensors`);
        const sensors = res.data || [];
        let danger = 0, warning = 0;
        sensors.forEach(s => {
          if (s.severity === "nguyhiem") danger++;
          else if (s.severity === "canhbao") warning++;
        });
        setSensorKpi({ total: sensors.length, danger, warning });
      } catch (error) {
        console.error("Lỗi khi tải KPI cảm biến:", error);
        setSensorKpi({ total: 0, danger: 0, warning: 0 });
      }
    }

    async function fetchReportsKpi() {
      try {
        const pendingRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports/pending`);
        setPendingReports(safeGetTotal(pendingRes.data));

        const approvedRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports/approved`);
        setApprovedReports(safeGetTotal(approvedRes.data));
      } catch (error) {
        console.error("Lỗi khi tải KPI báo cáo:", error);
        setPendingReports(0);
        setApprovedReports(0);
      }
    }

    fetchSensorsKpi();
    fetchReportsKpi();
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Tổng số cảm biến"
          value={sensorKpi.total}
          subtitle={`${sensorKpi.danger} nguy hiểm · ${sensorKpi.warning} cảnh báo`}
          tone="blue"
          icon="wave"
        />

        {/* Báo cáo chờ duyệt (Đã cập nhật) */}
        <KpiCard
          title={"Báo cáo chờ duyệt"}
          value={pendingReports}
          subtitle={pendingReports > 0 ? `${pendingReports} chờ xác minh` : "Không có báo cáo chờ duyệt"}
          tone="amber"
          icon="alert"
        />

        {/* Báo cáo đã xác minh (Đã cập nhật) */}
        <KpiCard
          title={"Báo cáo đã xác minh"}
          value={approvedReports}
          subtitle={approvedReports > 0 ? `${approvedReports} đã xác minh` : "Không có báo cáo đã xác minh"}
          tone="green"
          icon="check"
        />

        <KpiCard
          title={"Điểm ngập trọng yếu"}
          value={sensorKpi.danger}
          subtitle={"Số điểm có mức nguy hiểm"}
          tone="red"
          icon="pin"
        />
      </section>

      <WeatherMap />

      {/* Sensor status + activities */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-3xl shadow-lg shadow-sky-100 p-6">
          <h3 className="text-base font-semibold mb-4">
            Cảm biến theo trạng thái
          </h3>
          <div className="space-y-3">
            {sensorStatusSummary.map((item) => (
              <div
                key={item.type}
                className="flex items-center justify-between rounded-2xl px-4 py-3 bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${item.type === "normal"
                      ? "bg-emerald-500"
                      : item.type === "warning"
                        ? "bg-amber-400"
                        : "bg-rose-500"
                      }`}
                  />
                  <span className="text-sm">{item.label}</span>
                </div>
                <span className="text-sm font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg shadow-sky-100 p-6">
          <h3 className="text-base font-semibold mb-4">Hoạt động gần đây</h3>
          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between rounded-2xl px-4 py-3 bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                  <span className="text-sm">{act.text}</span>
                </div>
                <span className="text-xs text-slate-500">
                  {act.timeAgo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default OverviewPage;