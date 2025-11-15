import httpStatus from "http-status";
import {
  createReport,
  listReports,
  getReportById,
  approveReport,
  rejectReport,
} from "../services/report.service.js";
import { geocodeService } from "../services/geocode.service.js";
import { getListApprovedReports, getListPendingReports } from "../services/report.service.js";
export const createReportHandler = async (req, res, next) => {
  try {
    const {
      address,
      level,
      waterDepthCm,
      description,
      images = [],
    } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Thiếu địa chỉ ngập" });
    }

    if (!level) {
      return res.status(400).json({ message: "Thiếu mức độ nghiêm trọng" });
    }

    // Gọi geocode để lấy city/district/ward + tọa độ
    const { city, district, ward, location } = await geocodeService(address);

    const payload = {
      citizenId: req.ip, // hoặc userId nếu bạn có auth
      address,
      level: Number(level),
      waterDepthCm: waterDepthCm ? Number(waterDepthCm) : undefined,
      description,
      images, // mảng URL từ frontend
      city,
      district,
      ward,
      location, // { type: 'Point', coordinates: [lng,lat] }
    };

    const report = await createReport(payload);
    req.io?.of("/reports").emit("report:created", report);

    return res.status(httpStatus.CREATED).json(report);
  } catch (e) {
    next(e);
  }
};

export const getPendingReports = async (req, res, next) => {
  try {
    const data = await getListPendingReports(req.query); // có thể phân trang, filter city...
    res.json(data);
  } catch (err) {
    next(err);
  }
};



export const getApprovedReports = async (req, res, next) => {
  try {
    const data = await getListApprovedReports(req.query);
    res.json(data);
  } catch (err) {
    next(err);
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

    if (!updated) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Report not found" });
    }

    // Nếu có socket thì emit, KHÔNG có thì thôi, không lỗi
    req.io?.of("/reports").emit("report:approved", updated);

    return res.json({
      message: "Báo cáo đã được xác minh",
      data: updated,
    });
  } catch (e) {
    next(e);
  }
};

export const rejectReportHandler = async (req, res, next) => {
  try {
    const updated = await rejectReport(
      req.params.id,
      req.user?.id || "system"
    );

    if (!updated) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Report not found" });
    }

    req.io?.of("/reports").emit("report:rejected", updated);

    return res.json({
      message: "Báo cáo đã bị từ chối",
      data: updated,
    });
  } catch (e) {
    next(e);
  }
};
