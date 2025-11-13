import express from "express";
import { createReportHandler, listReportsHandler, getReportByIdHandler, approveReportHandler, rejectReportHandler } from "../controllers/report.controller.js";

const router = express.Router();

router.post("/", createReportHandler);
router.get("/", listReportsHandler);
router.get("/:id", getReportByIdHandler);
router.patch("/:id", approveReportHandler);
router.delete("/:id", rejectReportHandler);

export default router;
