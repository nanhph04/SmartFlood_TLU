function KpiCard({ title, value, subtitle, tone = "blue", icon }) {
  const toneClasses = {
    blue: { bg: "from-sky-100 to-sky-50", iconBg: "bg-sky-500/90" },
    amber: { bg: "from-amber-50 to-orange-50", iconBg: "bg-amber-500/90" },
    green: { bg: "from-emerald-50 to-green-50", iconBg: "bg-emerald-500/90" },
    red: { bg: "from-rose-50 to-red-50", iconBg: "bg-rose-500/90" },
  }[tone];

  const iconChar =
    icon === "wave"
      ? "📡"
      : icon === "alert"
      ? "⚠️"
      : icon === "check"
      ? "✅"
      : icon === "pin"
      ? "📍"
      : "•";

  return (
    <div
      className={`rounded-3xl bg-gradient-to-br ${toneClasses.bg} shadow-lg shadow-sky-100 p-5 flex items-center justify-between`}
    >
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>
      <div
        className={`h-12 w-12 rounded-2xl ${toneClasses.iconBg} flex items-center justify-center text-white text-xl shadow-md`}
      >
        {iconChar}
      </div>
    </div>
  );
}

export default KpiCard;
