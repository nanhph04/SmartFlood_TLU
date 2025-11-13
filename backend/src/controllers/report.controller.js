import httpStatus from "http-status";
import {
  createReport,
  listReports,
  getReportById,
  approveReport,
  rejectReport,
} from "../services/report.service.js";

export const createReportHandler = async (req, res, next) => {
  try {
    const data = { ip: req.ip, ...req.body };
    const created = await createReport(data);
    req.io.of("/reports").emit("report:created", created);
    res.status(httpStatus.CREATED).json(created);
  } catch (e) {
    next(e);
  }
};

export const listReportsHandler = async (req, res, next) => {
  try {
    const data = await listReports(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

export const getReportByIdHandler = async (req, res, next) => {
  try {
    const doc = await getReportById(req.params.id);
    if (!doc)
      return res.status(httpStatus.NOT_FOUND).json({ message: "Not found" });
    res.json(doc);
  } catch (e) {
    next(e);
  }
};

export const approveReportHandler = async (req, res, next) => {
  try {
    const updated = await approveReport(
      req.params.id,
      req.user?.id || "system"
    );
    if (!updated)
      return res.status(httpStatus.NOT_FOUND).json({ message: "Not found" });
    req.io.of("/reports").emit("report:approved", updated);
    res.json(updated);
  } catch (e) {
    next(e);
  }
};

export const rejectReportHandler = async (req, res, next) => {
  try {
    console.log(req.params.id, req.user?.id);

    const updated = await rejectReport(req.params.id, req.user?.id || "system");
    if (!updated)
      return res.status(httpStatus.NOT_FOUND).json({ message: "Not found" });
    req.io.of("/reports").emit("report:rejected", updated);
    res.json(updated);
  } catch (e) {
    next(e);
  }
};
