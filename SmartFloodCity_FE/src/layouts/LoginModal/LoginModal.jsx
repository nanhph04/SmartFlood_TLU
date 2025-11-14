import React, { useState } from 'react';
import './LoginModal.css'; // File CSS cho modal
import {
    IoWaterOutline,
    IoClose,
    IoPersonOutline,
    IoShieldCheckmarkOutline,
    IoPersonCircleOutline,
    IoLockClosedOutline,
    IoEyeOutline,
    IoEyeOffOutline
} from 'react-icons/io5';

// -----------------------------------------------------------------
// HÀM "RỖNG" (Để trống chờ API)
// -----------------------------------------------------------------

const handleLoginSubmit = (role, username, password) => {
    console.log(`Đang đăng nhập (chờ API)...`);
    console.log(`Vai trò: ${role}`);
    console.log(`Tên đăng nhập: ${username}`);
    console.log(`Mật khẩu: ${password}`);
    // TƯƠNG LAI: Gọi API đăng nhập thật ở đây
    // alert('Đăng nhập thành công!');
};

const handleDemoLogin = (role) => {
    const user = (role === 'user') ? 'user' : 'admin';
    const pass = (role === 'user') ? 'user123' : 'admin123';
    console.log(`Đăng nhập DEMO với vai trò: ${role}`);
    // Tự động điền form
    return { user, pass };
};

// -----------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------

function LoginModal({ onClose }) { // Nhận hàm "onClose" từ props
    const [activeRole, setActiveRole] = useState('user'); // 'user' hoặc 'admin'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Hàm xử lý khi nhấn nút Đăng nhập
    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn form reload trang
        handleLoginSubmit(activeRole, username, password);
        // onClose(); // Tùy chọn: Đóng modal sau khi nhấn đăng nhập
    };

    // Hàm xử lý khi nhấn nút Dùng thử Demo
    const handleDemoClick = () => {
        const { user, pass } = handleDemoLogin(activeRole);
        setUsername(user);
        setPassword(pass);
    };

    return (
        // Lớp phủ nền mờ
        <div className="modal-overlay" onClick={onClose}>
            {/* Nội dung Modal (ngăn sự kiện click từ overlay) */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* Nút đóng (X) */}
                <button className="modal-close-btn" onClick={onClose}>
                    <IoClose size={24} />
                </button>

                {/* Header của Modal */}
                <div className="modal-header">
                    <div className="modal-logo">
                        <IoWaterOutline size={26} />
                    </div>
                    <div className="modal-title">
                        <h2>Giám sát ngập đô thị</h2>
                        <p>Chọn vai trò và đăng nhập để truy cập nền tảng</p>
                    </div>
                </div>

                {/* Tabs chọn vai trò */}
                <div className="role-tabs">
                    <button
                        className={`tab-btn ${activeRole === 'user' ? 'active' : ''}`}
                        onClick={() => setActiveRole('user')}
                    >
                        <IoPersonOutline />
                        Người dùng
                    </button>
                    <button
                        className={`tab-btn ${activeRole === 'admin' ? 'active' : ''}`}
                        onClick={() => setActiveRole('admin')}
                    >
                        <IoShieldCheckmarkOutline />
                        Quản trị viên
                    </button>
                </div>

                {/* Form đăng nhập */}
                <form className="login-form" onSubmit={handleSubmit}>
                    {/* Tên đăng nhập */}
                    <div className="input-group">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <div className="input-wrapper">
                            <IoPersonCircleOutline className="input-icon" />
                            <input
                                type="text"
                                id="username"
                                placeholder="Nhập tên đăng nhập"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Mật khẩu */}
                    <div className="input-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <div className="input-wrapper">
                            <IoLockClosedOutline className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>
                    </div>

                    {/* Các nút bấm */}
                    <button type="submit" className="form-button primary-button">
                        Đăng nhập
                    </button>
                    <button
                        type="button"
                        className="form-button secondary-button"
                        onClick={handleDemoClick}
                    >
                        Dùng thử tài khoản demo
                    </button>
                </form>

                {/* Thông tin demo */}
                <div className="demo-info">
                    <p>Thông tin đăng nhập demo:</p>
                    <pre>Người dùng: user / user123</pre>
                    <pre>Quản trị: admin / admin123</pre>
                </div>

            </div>
        </div>
    );
}

export default LoginModal;