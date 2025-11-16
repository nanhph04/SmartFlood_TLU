import api from "./apiClient";

export const getPendingReports = async (params = {}) => {
  const res = await api.get("/reports/pending", { params });
  return res.data; // { items, ... }
};

export const getApprovedReports = async (params = {}) => {
  const res = await api.get("/reports/approved", { params });
  return res.data;
};

export const approveReportApi = async (id) => {
  const res = await api.patch(`/reports/approved/${id}`);
  return res.data; // report đã được update
};

export const rejectReportApi = async (id) => {
  const res = await api.patch(`/reports/reject/${id}`);
  return res.data; // report đã được update hoặc null
};
