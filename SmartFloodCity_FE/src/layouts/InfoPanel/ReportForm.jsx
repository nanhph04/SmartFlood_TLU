import React, { useState } from 'react';
import { IoLocationSharp, IoPaperPlaneOutline, IoAlertCircleOutline, IoCheckbox } from 'react-icons/io5';
import './InfoPanel.css';

// --- HÀM "RỖNG" ---
const handleSubmitReport = (reportData) => {
    console.log("Đang gửi báo cáo (chờ API)...", reportData);
    alert("Gửi báo cáo thành công!");
};

// --- COMPONENT ---
export default function ReportForm() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [level, setLevel] = useState('');
    const [description, setDescription] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!name || !location || !level || !description) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        handleSubmitReport({ name, location, level, description });
    };

    return (
        <div className="report-page-layout">
            {/* Cột 1: Form */}
            <div className="report-form-container">
                <div className="report-form-header">
                    <div className="report-form-icon"><IoLocationSharp /></div>
                    <h3>Báo cáo tình trạng ngập</h3>
                </div>

                <form className="report-form" onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Họ và tên</label>
                        <input type="text" id="name" placeholder="Nhập họ tên của bạn" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Vị trí ngập</label>
                        <input type="text" id="location" placeholder="Ví dụ: Ngã tư Nguyễn Huệ - Lê Lợi, Quận 1" value={location} onChange={e => setLocation(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="level">Mức độ nghiêm trọng</label>
                        <select id="level" value={level} onChange={e => setLevel(e.target.value)}>
                            <option value="" disabled>Chọn mức độ</option>
                            <option value="nhe">Nhẹ (&lt; 20cm)</option>
                            <option value="trungbinh">Trung bình (20-40cm)</option>
                            <option value="nghiemtrong">Nghiêm trọng (&gt; 40cm)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Mô tả chi tiết</label>
                        <textarea id="description" rows="4" placeholder="Mô tả tình trạng ngập, mức độ ảnh hưởng đến giao thông và sinh hoạt..." value={description} onChange={e => setDescription(e.target.value)}></textarea>
                    </div>

                    <button type="submit" className="button-submit-report">
                        <IoPaperPlaneOutline /> Gửi báo cáo
                    </button>
                </form>
                <div className="form-notice">
                    <IoAlertCircleOutline />
                    <span>Thông tin của bạn sẽ giúp cơ quan chức năng nhanh chóng nắm bắt tình hình và có biện pháp xử lý kịp thời.</span>
                </div>
            </div>

            {/* Cột 2: Hướng dẫn */}
            <div className="report-sidebar">
                <div className="sidebar-widget">
                    <h4>Hướng dẫn báo cáo</h4>
                    <ul className="guide-list">
                        <li><span>1</span>Xác định chính xác vị trí ngập (tên đường, ngã tư, quận/huyện)</li>
                        <li><span>2</span>Đánh giá mức độ ngập: nhẹ, trung bình, nghiêm trọng</li>
                        <li><span>3</span>Mô tả chi tiết tình hình: mức độ, ảnh hưởng giao thông, tài sản</li>
                        <li><span>4</span>Gửi báo cáo và theo dõi phản hồi từ cơ quan chức năng</li>
                    </ul>
                </div>
                <div className="sidebar-widget alert-notice">
                    <h4><IoAlertCircleOutline /> Lưu ý an toàn</h4>
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