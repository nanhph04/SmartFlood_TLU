import mongoose from 'mongoose';
import Report from '../models/Report.model.js';

const assertObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    const err = new Error('Report not found');
    err.status = 404;
    throw err;
  }
};

export const createReport = async (payload) => {
  const doc = await Report.create(payload);
  return doc.toObject();
};

export const listReports = async ({
  status = 'pending',
  page = 1,
  limit = 20,
  city,
  district,
  ward,
  from,
  to,
}) => {
  // Ép kiểu và chặn giá trị xấu
  page = Number(page) || 1;
  limit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const query = {};
  if (status) query.status = status;
  if (city) query.city = city;
  if (district) query.district = district;
  if (ward) query.ward = ward;

  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) {
      // inclusive tới cuối ngày nếu chuỗi yyyy-mm-dd
      const dt = new Date(to);
      if (!isNaN(dt)) {
        dt.setHours(23, 59, 59, 999);
        query.createdAt.$lte = dt;
      }
    }
  }

  const [items, total] = await Promise.all([
    Report.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Report.countDocuments(query),
  ]);

  return { items, page, limit, total, pages: Math.ceil(total / limit) };
};

export const getListPendingReports = async (params = {}) => {
  return listReports({ ...params, status: "pending" });
};

export const getListApprovedReports = async (params = {}) => {
  return listReports({ ...params, status: "approved" });
};

export const getReportById = async (id) => {
  assertObjectId(id);
  const doc = await Report.findById(id).lean();
  if (!doc) {
    const err = new Error('Report not found');
    err.status = 404;
    throw err;
  }
  return doc;
};

/**
 * Approve/Reject dùng update có điều kiện để tránh race condition:
 * chỉ cập nhật khi status đang là 'pending'
 */
export const approveReport = async (id, approverId) => {
  assertObjectId(id);
  const updated = await Report.findOneAndUpdate(
    { _id: id, status: 'pending' },
    {
      $set: {
        status: 'approved',
        reviewedBy: approverId,
        reviewedAt: new Date(),
      },
    },
    { new: true }
  ).lean();

  return updated;
};

export const rejectReport = async (id, approverId) => {
  assertObjectId(id);
  const updated = await Report.findOneAndUpdate(
    { _id: id, status: 'pending' },
    {
      $set: {
        status: 'rejected',
      },
    },
    { new: true }
  ).lean();

  return updated;
};
