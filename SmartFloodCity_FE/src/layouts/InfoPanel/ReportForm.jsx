import React, { useState } from "react";
import {
  IoLocationSharp,
  IoPaperPlaneOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import { createReport } from "../../services/reportService";
import ImageUploader from "./ImageUploader";

import "./InfoPanel.css";

const LEVEL_MAP = {
  nhe: 1,
  trungbinh: 2,
  nghiemtrong: 3,
};

export default function ReportForm() {
  const [address, setAddress] = useState("");
  const [level, setLevel] = useState("");
  const [waterDepthCm, setWaterDepthCm] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!address || !level || !description || !waterDepthCm) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      setSubmitting(true);

      const levelNumber = LEVEL_MAP[level] || 1;

      const payload = {
        address,
        level: levelNumber,
        waterDepthCm: Number(waterDepthCm),
        description,
        images: imageUrls, // mảng URL đã upload
      };

      const created = await createReport(payload);
      console.log("Report created:", created);

      alert("Gửi báo cáo thành công!");
      // reset form
      setAddress("");
      setLevel("");
      setWaterDepthCm("");
      setDescription("");
      setImageUrls([]);
    } catch (err) {
      console.log(err);
      alert("Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report-page-layout">
      {/* Cột 1: Form */}
      <div className="report-form-container">
        <div className="report-form-header">
          <div className="report-form-icon">
            <IoLocationSharp />
          </div>
          <h3>Báo cáo tình trạng ngập</h3>
        </div>

        <form className="report-form" onSubmit={handleFormSubmit}>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ / vị trí ngập</label>
            <input
              type="text"
              id="address"
              placeholder="Ví dụ: 123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="level">Mức độ nghiêm trọng</label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="" disabled>
                Chọn mức độ
              </option>
              <option value="nhe">Nhẹ (&lt; 20cm)</option>
              <option value="trungbinh">Trung bình (20-40cm)</option>
              <option value="nghiemtrong">Nghiêm trọng (&gt; 40cm)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="waterDepth">Mức nước ước tính (cm)</label>
            <input
              type="number"
              id="waterDepth"
              min="0"
              placeholder="Ví dụ: 45"
              value={waterDepthCm}
              onChange={(e) => setWaterDepthCm(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả chi tiết</label>
            <textarea
              id="description"
              rows="4"
              placeholder="Mô tả tình trạng ngập, mức độ ảnh hưởng đến giao thông và sinh hoạt..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Component upload ảnh */}
          <ImageUploader imageUrls={imageUrls} onChange={setImageUrls} />

          <button
            type="submit"
            className="button-submit-report"
            disabled={submitting}
          >
            <IoPaperPlaneOutline />
            {submitting ? "Đang gửi..." : "Gửi báo cáo"}
          </button>
        </form>

        <div className="form-notice">
          <IoAlertCircleOutline />
          <span>
            Thông tin của bạn sẽ giúp cơ quan chức năng nhanh chóng nắm bắt
            tình hình và có biện pháp xử lý kịp thời.
          </span>
        </div>
      </div>

      {/* Cột 2: Hướng dẫn */}
      <div className="report-sidebar">
        <div className="sidebar-widget">
          <h4>Hướng dẫn báo cáo</h4>
          <ul className="guide-list">
            <li>
              <span>1</span>Nhập địa chỉ càng chi tiết càng tốt
            </li>
            <li>
              <span>2</span>Ước lượng mực nước &amp; chọn mức độ ngập
            </li>
            <li>
              <span>3</span>Thêm hình ảnh hiện trường (nếu có)
            </li>
            <li>
              <span>4</span>Gửi báo cáo và chờ phản hồi
            </li>
          </ul>
        </div>

        <div className="sidebar-widget alert-notice">
          <h4>
            <IoAlertCircleOutline /> Lưu ý an toàn
          </h4>
          <ul>
            <li>Không đi qua vùng nước ngập sâu</li>
            <li>Tránh xa các trụ điện, cột điện trong vùng ngập</li>
            <li>Theo dõi cảnh báo từ cơ quan chức năng</li>
            <li>Liên hệ 114 trong trường hợp khẩn cấp</li>
          </ul>
        </div>
      </div>
    </div>
  );
}