// src/services/reportService.js
import apiClient from "./apiClient";

export async function createReport(payload) {
  const res = await apiClient.post("/reports", payload);
  return res.data;
}
