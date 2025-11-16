// src/pages/ReportsPage.jsx
import { useEffect, useState, useCallback } from "react";
import {
  getPendingReports,
  getApprovedReports,
  approveReportApi,
  rejectReportApi,
} from "../services/reportApi";
import { io } from "socket.io-client";

// helper: đổi level (1–5) thành chữ
const getLevelLabel = (level) => {
  switch (Number(level)) {
    case 1:
      return "Nhẹ";
    case 2:
      return "Trung bình";
    case 3:
      return "Khá nghiêm trọng";
    case 4:
      return "Nghiêm trọng";
    case 5:
      return "Đặc biệt nghiêm trọng";
    default:
      return "Không rõ";
  }
};

const formatTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleString("vi-VN");
};

function ReportsPage() {
  const [pendingReports, setPendingReports] = useState([]);
  const [approvedReports, setApprovedReports] = useState([]);

  const [loadingPending, setLoadingPending] = useState(false);
  const [loadingApproved, setLoadingApproved] = useState(false);

  const [errorPending, setErrorPending] = useState(null);
  const [errorApproved, setErrorApproved] = useState(null);

  const [actionId, setActionId] = useState(null); // id đang xử lý approve/reject

  // nên lấy URL từ env cho đỡ hard-code
  const SOCKET_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Hàm load lại cả 2 list (dùng lại được nhiều chỗ)
  const fetchLists = useCallback(async () => {
    try {
      setLoadingPending(true);
      setLoadingApproved(true);
      setErrorPending(null);
      setErrorApproved(null);

      const [pendingData, approvedData] = await Promise.all([
        getPendingReports(),
        getApprovedReports(),
      ]);

      setPendingReports(pendingData.items || []);
      setApprovedReports(approvedData.items || []);
    } catch (err) {
      console.error("Lỗi load reports:", err);
      const msg =
        err?.response?.data?.message || "Không tải được danh sách báo cáo.";
      setErrorPending(msg);
      setErrorApproved(msg);
    } finally {
      setLoadingPending(false);
      setLoadingApproved(false);
    }
  }, []);

  useEffect(() => {
    // 1. Load lần đầu
    fetchLists();

    // 2. Kết nối socket
    const token = localStorage.getItem("sf_token");

    const socket = io(`${SOCKET_BASE_URL}/reports`, {
      auth: token ? { token } : undefined,
    });

    socket.on("connect", () => {
      console.log("Connected to /reports namespace:", socket.id);
    });

    // ✅ Khi có report mới được tạo (client citizen gửi)
    socket.on("report:created", (report) => {
      // Nếu report mới có status pending (mặc định của bạn là 'pending')
      if (report.status === "pending") {
        setPendingReports((prev) => {
          // tránh trùng nếu đã tồn tại
          const without = prev.filter((r) => r._id !== report._id);
          return [report, ...without];
        });
      }
    });

    // Khi có report được approve ở bất kỳ client nào
    socket.on("report:approved", (report) => {
      setPendingReports((prev) => prev.filter((r) => r._id !== report._id));
      setApprovedReports((prev) => {
        const without = prev.filter((r) => r._id !== report._id);
        return [report, ...without];
      });
    });

    // Khi có report bị reject
    socket.on("report:rejected", (report) => {
      setPendingReports((prev) => prev.filter((r) => r._id !== report._id));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from /reports namespace");
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchLists, SOCKET_BASE_URL]);

  // Xác minh báo cáo
  const handleApprove = async (report) => {
    if (!report?._id) return;
    try {
      setActionId(report._id);

      // Gọi API approve
      const updated = await approveReportApi(report._id); // có thể trả { message, data } hoặc report

      // Cho client hiện tại: cập nhật UI ngay (socket sẽ lo cho client khác)
      const approvedItem =
        updated?.data || updated || { ...report, status: "approved" };

      setPendingReports((prev) => prev.filter((r) => r._id !== report._id));
      setApprovedReports((prev) => {
        const without = prev.filter((r) => r._id !== approvedItem._id);
        return [approvedItem, ...without];
      });
    } catch (err) {
      console.error("Lỗi approve:", err);
      alert(
        err?.response?.data?.message ||
          "Không thể xác minh báo cáo, vui lòng thử lại."
      );
    } finally {
      setActionId(null);
    }
  };

  // Từ chối báo cáo
  const handleReject = async (report) => {
    if (!report?._id) return;
    try {
      setActionId(report._id);
      await rejectReportApi(report._id);

      // Cho client hiện tại: xóa khỏi pending
      setPendingReports((prev) => prev.filter((r) => r._id !== report._id));
    } catch (err) {
      console.error("Lỗi reject:", err);
      alert(
        err?.response?.data?.message ||
          "Không thể từ chối báo cáo, vui lòng thử lại."
      );
    } finally {
      setActionId(null);
    }
  };

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

        {loadingPending && (
          <p className="text-sm text-slate-500">Đang tải danh sách...</p>
        )}
        {errorPending && (
          <p className="text-sm text-rose-500 mb-2">{errorPending}</p>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b">
                <th className="pb-2 pr-4 font-medium">Vị trí</th>
                <th className="pb-2 pr-4 font-medium">Mô tả</th>
                <th className="pb-2 pr-4 font-medium">Mức độ</th>
                <th className="pb-2 pr-4 font-medium">Thời gian</th>
                <th className="pb-2 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pendingReports.map((r) => (
                <tr
                  key={r._id}
                  className="border-b last:border-0 border-slate-100"
                >
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="mr-1">📍</span>
                    {r.address ||
                      [r.ward, r.district, r.city].filter(Boolean).join(", ")}
                  </td>
                  <td className="py-3 pr-4">{r.description}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700">
                      {getLevelLabel(r.level)}
                    </span>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {formatTime(r.createdAt)}
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1.5 rounded-full text-xs bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60"
                        onClick={() => handleApprove(r)}
                        disabled={actionId === r._id}
                      >
                        ✓ Xác minh
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-full text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-60"
                        onClick={() => handleReject(r)}
                        disabled={actionId === r._id}
                      >
                        ✕ Từ chối
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loadingPending && pendingReports.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 text-center text-sm text-slate-500"
                  >
                    Không có báo cáo chờ xác minh.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Approved / Verified */}
      <section className="bg-white rounded-3xl shadow-lg shadow-sky-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Báo cáo đã xác minh</h2>
            <p className="text-xs text-slate-500">
              {approvedReports.length} báo cáo
            </p>
          </div>
          {approvedReports.length > 0 && (
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
              {approvedReports.length} đã xác minh
            </span>
          )}
        </div>

        {loadingApproved && (
          <p className="text-sm text-slate-500">Đang tải danh sách...</p>
        )}
        {errorApproved && (
          <p className="text-sm text-rose-500 mb-2">{errorApproved}</p>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b">
                <th className="pb-2 pr-4 font-medium">Vị trí</th>
                <th className="pb-2 pr-4 font-medium">Mô tả</th>
                <th className="pb-2 pr-4 font-medium">Mức độ</th>
                <th className="pb-2 pr-4 font-medium">Thời gian</th>
                <th className="pb-2 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {approvedReports.map((r) => {
                const levelLabel = getLevelLabel(r.level);
                const isSevere = Number(r.level) >= 4;
                return (
                  <tr
                    key={r._id}
                    className="border-b last:border-0 border-slate-100"
                  >
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span className="mr-1">📍</span>
                      {r.address ||
                        [r.ward, r.district, r.city]
                          .filter(Boolean)
                          .join(", ")}
                    </td>
                    <td className="py-3 pr-4">{r.description}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          isSevere
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {levelLabel}
                      </span>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {formatTime(r.createdAt)}
                    </td>
                    <td className="py-3 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700">
                        {r.status || "approved"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!loadingApproved && approvedReports.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 text-center text-sm text-slate-500"
                  >
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
