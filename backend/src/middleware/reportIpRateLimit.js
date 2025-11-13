import Report from "../models/Report.model.js";

export const reportIpRateLimit = (opts = {}) => {
  const maxPerDay = Number(
    opts.maxPerDay ?? process.env.MAX_REPORTS_PER_IP ?? 5
  );

  return async (req, res, next) => {
    try {
      const ip = req.ip || "unknown";
      // khung ngày theo giờ máy chủ (đơn giản). Nếu muốn theo múi giờ khác, tự set TZ của server hoặc tính thủ công.
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);

      const count = await Report.countDocuments({
        ip,
        createdAt: { $gte: start, $lt: end },
      });
      if (count >= maxPerDay) {
        return res
          .status(429)
          .json({
            message:
              "Bạn đã đạt giới hạn số lần báo cáo trong ngày. Vui lòng thử lại ngày mai.",
          });
      }

      // gắn ip vào body để lưu cùng report
      req.body.ip = ip;
      next();
    } catch (e) {
      next(e);
    }
  };
};
