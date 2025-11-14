import React, { useState } from 'react';
import './SearchPanel.css'; // File CSS cho component này
import { IoSearchOutline, IoLocationOutline } from 'react-icons/io5'; // Import icon

// -----------------------------------------------------------------
// PHẦN DÀNH CHO API "RỖNG" VÀ DỮ LIỆU MẪU
// -----------------------------------------------------------------

// 1. DỮ LIỆU MẪU (Mock Data)
// Thay vì gọi API, chúng ta dùng 1 mảng cứng cho các tag
const mockQuickSearchTags = [
    'Quận 1',
    'Quận 3',
    'Quận 10',
];

// 2. CÁC HÀM "RỖNG" (Để trống)

// Hàm này sẽ được gọi khi người dùng tìm kiếm (VD: nhấn Enter)
const handleSearchSubmit = (searchTerm) => {
    if (!searchTerm.trim()) return; // Không tìm kiếm nếu rỗng
    console.log(`Đang tìm kiếm (chờ API): "${searchTerm}"`);
    // TƯƠNG LAI: Bạn sẽ gọi API tìm kiếm thật ở đây
};

// Hàm này được gọi khi nhấn nút tìm kiếm nhanh
const handleQuickSearch = (location) => {
    console.log(`Đang tìm kiếm nhanh (chờ API): "${location}"`);
    // TƯƠNG LAI: Bạn sẽ gọi API tìm kiếm cho vị trí này
};


// -----------------------------------------------------------------
// COMPONENT SEARCHPANEL
// -----------------------------------------------------------------

function SearchPanel() {
    // State để lưu giá trị của ô tìm kiếm (controlled component)
    const [searchTerm, setSearchTerm] = useState('');

    // Xử lý khi gõ vào ô tìm kiếm
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Xử lý khi nhấn Enter trong ô tìm kiếm
    const handleSubmit = (e) => {
        // e.key === 'Enter' có nghĩa là người dùng nhấn phím Enter
        if (e.key === 'Enter') {
            handleSearchSubmit(searchTerm);
        }
    };

    return (
        <div className="search-panel">
            {/* 1. Ô tìm kiếm chính */}
            <div className="search-input-wrapper">
                <IoSearchOutline className="search-icon" size={22} />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên đường, khu vực (VD: Nguyễn Huệ, Quận 1)..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleSubmit} // Dùng onKeyDown (hoặc onKeyPress) để bắt sự kiện Enter
                />
            </div>

            {/* 2. Phần tìm kiếm nhanh */}
            <div className="quick-search">
                <p className="quick-search-label">Tìm kiếm nhanh</p>
                <div className="quick-search-tags">
                    {/* Dùng .map() để render DỮ LIỆU MẪU ra các nút bấm */}
                    {mockQuickSearchTags.map((tag) => (
                        <button
                            key={tag}
                            className="quick-search-tag"
                            onClick={() => handleQuickSearch(tag)} // Gắn hàm "rỗng"
                        >
                            <IoLocationOutline size={16} />
                            <span>{tag}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchPanel;