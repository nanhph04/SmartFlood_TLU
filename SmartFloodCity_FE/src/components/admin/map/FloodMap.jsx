import StatusChip from "../StatusChip.jsx";

function FloodMap() {
  return (
    <section className="bg-white rounded-3xl shadow-lg shadow-sky-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Bản đồ giám sát ngập lụt</h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <StatusChip type="normal">Bình thường</StatusChip>
          <StatusChip type="warning">Cảnh báo</StatusChip>
          <StatusChip type="danger">Nguy hiểm</StatusChip>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50 to-sky-100 border border-sky-100 h-[260px] md:h-[330px]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#dbeafe33_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe33_1px,transparent_1px)] bg-[size:40px_40px]" />

        <MapDot x="15%" y="30%" type="normal" />
        <MapDot x="35%" y="45%" type="danger" />
        <MapDot x="50%" y="40%" type="warning" />
        <MapDot x="70%" y="60%" type="danger" />
        <MapDot x="80%" y="75%" type="warning" />
        <MapDot x="90%" y="85%" type="normal" />

        <div className="absolute left-4 bottom-4 px-4 py-1.5 rounded-full bg-white/90 text-xs shadow-sm">
          TP. Hồ Chí Minh - Khu vực trung tâm
        </div>
      </div>
    </section>
  );
}

function MapDot({ x, y, type }) {
  const colorClasses =
    type === "danger"
      ? "bg-rose-500 shadow-rose-300"
      : type === "warning"
      ? "bg-amber-400 shadow-amber-300"
      : "bg-emerald-400 shadow-emerald-300";

  const shapeClasses =
    type === "danger" || type === "warning"
      ? "w-4 h-4 rotate-45"
      : "w-4 h-4 rounded-full";

  return (
    <div
      className="absolute"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      <div className={`relative ${shapeClasses} ${colorClasses} shadow-lg`} />
    </div>
  );
}

export default FloodMap;
