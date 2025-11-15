import { pendingReports, verifiedReports } from "../mock/mockData.js";

function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Pending */}
      <section className="bg-white rounded-3xl shadow-lg shadow-sky-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Báo cáo chờ xác minh</h2>
            <p className="text-xs text-slate-500">
              {pendingReports.length} báo cáo
            </p>
          </div>
          {pendingReports.length > 0 && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700">
              {pendingReports.length} chờ xử lý
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b">
                <th className="pb-2 pr-4 font-medium">Vị trí</th>
                <th className="pb-2 pr-4 font-medium">Mô tả</th>
                <th className="pb-2 pr-4 font-medium">Mức độ</th>
                <th className="pb-2 pr-4 font-medium">Người báo cáo</th>
                <th className="pb-2 pr-4 font-medium">Thời gian</th>
                <th className="pb-2 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pendingReports.map((r) => (
                <tr
                  key={r.id}
                  className="border-b last:border-0 border-slate-100"
                >
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="mr-1">📍</span>
                    {r.location}
                  </td>
                  <td className="py-3 pr-4">{r.description}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700">
                      {r.level}
                    </span>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {r.reporter}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {r.timeAgo}
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 rounded-full text-xs bg-emerald-500 text-white hover:bg-emerald-600">
                        ✓ Xác minh
                      </button>
                      <button className="px-3 py-1.5 rounded-full text-xs bg-rose-50 text-rose-600 hover:bg-rose-100">
                        ✕ Từ chối
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pendingReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-sm text-slate-500">
                    Không có báo cáo chờ xác minh.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Verified */}
      <section className="bg-white rounded-3xl shadow-lg shadow-sky-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Báo cáo đã xác minh</h2>
            <p className="text-xs text-slate-500">
              {verifiedReports.length} báo cáo
            </p>
          </div>
          {verifiedReports.length > 0 && (
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
              {verifiedReports.length} đã xác minh
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b">
                <th className="pb-2 pr-4 font-medium">Vị trí</th>
                <th className="pb-2 pr-4 font-medium">Mô tả</th>
                <th className="pb-2 pr-4 font-medium">Mức độ</th>
                <th className="pb-2 pr-4 font-medium">Người báo cáo</th>
                <th className="pb-2 pr-4 font-medium">Thời gian</th>
                <th className="pb-2 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {verifiedReports.map((r) => (
                <tr
                  key={r.id}
                  className="border-b last:border-0 border-slate-100"
                >
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="mr-1">📍</span>
                    {r.location}
                  </td>
                  <td className="py-3 pr-4">{r.description}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        r.level === "Nghiêm trọng"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {r.level}
                    </span>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {r.reporter}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {r.timeAgo}
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {verifiedReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-sm text-slate-500">
                    Chưa có báo cáo đã xác minh.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default ReportsPage;
