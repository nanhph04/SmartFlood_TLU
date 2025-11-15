import express from "express";
import {
  createReportHandler,
  listReportsHandler,
  getReportByIdHandler,
  approveReportHandler,
  rejectReportHandler,
  getPendingReports,
  getApprovedReports,
} from "../controllers/report.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Công dân gửi báo cáo
router.post("/", createReportHandler);

// Các route dưới đây cần admin
router.use(requireAuth);
router.use(requireAdmin);

// Danh sách chung (mặc định pending, hoặc status=all/approved/rejected tuỳ query)
router.get("/", listReportsHandler);

// ✅ Danh sách report đang chờ duyệt
router.get("/pending", getPendingReports);

// ✅ Danh sách report đã được duyệt
router.get("/approved", getApprovedReports);

// LẤY THEO ID – phải đặt SAU /pending và /approved
router.get("/:id", getReportByIdHandler);

// Duyệt báo cáo
router.patch("/approved/:id", approveReportHandler);

// Từ chối báo cáo
router.patch("/reject/:id", rejectReportHandler);

export default router;
