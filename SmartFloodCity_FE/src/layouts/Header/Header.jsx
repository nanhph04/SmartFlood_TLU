import React, { useState, useEffect } from 'react';
import './Header.css'; // File CSS để tạo kiểu
import {
    IoLocationSharp, // Icon cho logo
    IoWarning,       // Icon cảnh báo
    IoLayers,        // Icon lớp
    IoLogInOutline,  // Icon đăng nhập
    IoPersonCircleOutline // Icon quản lý/người dùng
} from 'react-icons/io5';

// -----------------------------------------------------------------
// PHẦN DÀNH CHO API "RỖNG" VÀ DỮ LIỆU MẪU
// -----------------------------------------------------------------

// 1. Hàm API "rỗng" (để trống) như bạn yêu cầu
// Tương lai, bạn sẽ thay thế hàm này bằng logic gọi API thật (fetch, axios)
const fetchHeaderData = () => {
    console.log("Đang gọi API (giả) để lấy dữ liệu header...");

    // 2. Dữ liệu mẫu (mock data)
    const mockData = {
        alertCount: 2,
        layerCount: 2,
    };

    // Giả lập việc gọi API mất 0.5 giây
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockData);
        }, 500);
    });
};

// -----------------------------------------------------------------
// COMPONENT HEADER
// -----------------------------------------------------------------

function Header() {
    const [alertCount, setAlertCount] = useState(0);
    const [layerCount, setLayerCount] = useState(0);

    // Dùng useEffect để gọi API "rỗng" một lần khi component tải
    useEffect(() => {
        // Gọi hàm API và cập nhật state bằng dữ liệu mẫu
        fetchHeaderData().then((data) => {
            setAlertCount(data.alertCount);
            setLayerCount(data.layerCount);
        });
    }, []); // Mảng rỗng [] nghĩa là chỉ chạy 1 lần

    // Các hàm "rỗng" cho các nút
    const handleShowAlerts = () => {
        console.log("Chức năng XEM CẢNH BÁO (chưa làm)");
    };

    const handleShowLayers = () => {
        console.log("Chức năng XEM LỚP DỮ LIỆU (chưa làm)");
    };


    const handleManage = () => {
        console.log("Chức năng QUẢN LÝ (chưa làm)");
    };

    return (
        <header className="app-header">
            <div className="header-container">
                {/* === Phần bên trái (Logo & Tiêu đề) === */}
                <div className="header-brand">
                    <div className="brand-icon-wrapper">
                        <IoLocationSharp size={28} />
                    </div>
                    <div className="brand-text">
                        <h1 className="brand-title">Giám sát ngập đô thị</h1>
                        <p className="brand-subtitle">Nền tảng dữ liệu mở</p>
                    </div>
                </div>

                {/* === Phần bên phải (Các nút điều hướng) === */}
                <nav className="header-nav">
                    <button className="nav-icon-button alert-button" onClick={handleShowAlerts}>
                        <IoWarning size={18} />
                        {alertCount > 0 && (
                            <span className="badge">{alertCount}</span>
                        )}
                    </button>

                    <button className="nav-icon-button layers-button" onClick={handleShowLayers}>
                        <IoLayers size={18} />
                        {layerCount > 0 && (
                            <span className="badge">{layerCount}</span>
                        )}
                    </button>

                </nav>
            </div>
        </header>
    );
}

export default Header;