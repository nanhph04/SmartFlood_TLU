function StatusChip({ type, children }) {
  const cls =
    type === "normal"
      ? "bg-emerald-50 text-emerald-700"
      : type === "warning"
      ? "bg-amber-50 text-amber-700"
      : "bg-rose-50 text-rose-700";

  const dot =
    type === "normal"
      ? "bg-emerald-500"
      : type === "warning"
      ? "bg-amber-400"
      : "bg-rose-500";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cls}`}
    >
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {children}
    </span>
  );
}

export default StatusChip;
