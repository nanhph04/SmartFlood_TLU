export default function DemoInfoBox() {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
      <p className="text-xs font-semibold text-slate-600 mb-2">
        Thông tin đăng nhập demo:
      </p>
      <div className="space-y-1 text-[11px] text-slate-500">
        <p>
          <span className="font-semibold">Quản trị:</span>{" "}
          <span className="font-mono">admin / admin123</span>
        </p>
      </div>
    </div>
  );
}
