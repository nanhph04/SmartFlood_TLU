function StatusPill({ type }) {
  const label =
    type === "normal" ? "Bình thường" : type === "warning" ? "Cảnh báo" : "Nguy hiểm";

  const cls =
    type === "normal"
      ? "bg-emerald-50 text-emerald-700"
      : type === "warning"
      ? "bg-amber-50 text-amber-700"
      : "bg-rose-50 text-rose-700";

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

export default StatusPill;
