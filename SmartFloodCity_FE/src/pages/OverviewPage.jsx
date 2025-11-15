import KpiCard from "../components/admin/KpiCard.jsx";
import FloodMap from "../components/admin/map/FloodMap.jsx";
import { kpiCards, recentActivities, sensorStatusSummary } from "../mock/mockData.js";

function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* KPI */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title={kpiCards.totalSensors.title}
          value={kpiCards.totalSensors.total}
          subtitle={`${kpiCards.totalSensors.danger} nguy hiểm · ${kpiCards.totalSensors.warning} cảnh báo`}
          tone="blue"
          icon="wave"
        />
        <KpiCard
          title={kpiCards.pendingReports.title}
          value={kpiCards.pendingReports.total}
          subtitle={kpiCards.pendingReports.note}
          tone="amber"
          icon="alert"
        />
        <KpiCard
          title={kpiCards.verifiedReports.title}
          value={kpiCards.verifiedReports.total}
          subtitle={kpiCards.verifiedReports.note}
          tone="green"
          icon="check"
        />
        <KpiCard
          title={kpiCards.criticalLocations.title}
          value={kpiCards.criticalLocations.total}
          subtitle={kpiCards.criticalLocations.note}
          tone="red"
          icon="pin"
        />
      </section>

      <FloodMap />

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
                    className={`h-2.5 w-2.5 rounded-full ${
                      item.type === "normal"
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
