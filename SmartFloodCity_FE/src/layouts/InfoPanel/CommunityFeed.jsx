import React, { useState, useEffect } from 'react';
import { IoCheckbox, IoCheckmarkDoneOutline, IoTimeOutline, IoPeopleOutline, IoDocumentTextOutline, IoAnalyticsOutline } from 'react-icons/io5';
import './InfoPanel.css'; // Dùng chung file CSS

// --- DỮ LIỆU MẪU & API RỖNG ---
const fetchCommunityData = () => {
    console.log("Đang gọi API (giả) lấy dữ liệu cộng đồng...");
    const mockData = {
        stats: {
            totalToday: 4,
            verified: 3,
            pending: 1,
        },
        feed: [
            { id: 1, location: "Ngã tư Nguyễn Huệ - Lê Lợi", status: "Trung bình", description: "Nước ngập cao khoảng 30cm, xe máy khó di chuyển", author: "Nguyễn Văn A", time: "10 phút trước", isVerified: true },
            { id: 2, location: "Đường Lý Tự Trọng gần công viên 30/4", status: "Nghiêm trọng", description: "Ngập sâu, có xe chết máy, không thể qua được.", author: "Trần B", time: "5 phút trước", isVerified: false },
        ],
        contribution: {
            users: 124,
            reportsMonth: 387,
            accuracy: 98,
        }
    };
    return new Promise(resolve => setTimeout(() => resolve(mockData), 500));
};

// --- COMPONENT ---
export default function CommunityFeed() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchCommunityData().then(setData);
    }, []);

    if (!data) return <div>Đang tải dữ liệu...</div>;

    const { stats, feed, contribution } = data;

    return (
        <div className="community-page-layout">
            {/* Cột 1: Feed báo cáo */}
            <div className="community-feed-container">
                <h3>Báo cáo gần đây</h3>
                <div className="feed-list">
                    {feed.map(item => (
                        <div className="feed-card" key={item.id}>
                            <div className="feed-card-header">
                                <div className={`feed-status ${item.status.toLowerCase()}`}>
                                    <IoCheckbox /> {item.status}
                                </div>
                                <span className="feed-time"><IoTimeOutline /> {item.time}</span>
                            </div>
                            <h4>{item.location}</h4>
                            <p>{item.description}</p>
                            <div className="feed-card-footer">
                                <span>Báo cáo bởi: {item.author}</span>
                                {item.isVerified ? (
                                    <span className="feed-verified"><IoCheckmarkDoneOutline /> Đã xác minh</span>
                                ) : (
                                    <span className="feed-pending">Đang chờ...</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cột 2: Thống kê */}
            <div className="community-sidebar">
                <div className="sidebar-widget stats-widget">
                    <h4>Thống kê báo cáo</h4>
                    <div className="stat-item total">
                        <span>Tổng số báo cáo hôm nay</span>
                        <strong>{stats.totalToday}</strong>
                    </div>
                    <div className="stat-item verified">
                        <span>Đã xác minh</span>
                        <strong>{stats.verified}</strong>
                    </div>
                    <div className="stat-item pending">
                        <span>Đang chờ xác minh</span>
                        <strong>{stats.pending}</strong>
                    </div>
                </div>
                <div className="sidebar-widget contribution-widget">
                    <h4>Đóng góp của bạn rất quan trọng!</h4>
                    <p>Mỗi báo cáo từ cộng đồng đều giúp chúng tôi... (v.v)</p>
                    <div className="contribution-stats">
                        <div className="contrib-item">
                            <IoPeopleOutline size={24} />
                            <strong>{contribution.users}</strong>
                            <span>Người đóng góp</span>
                        </div>
                        <div className="contrib-item">
                            <IoDocumentTextOutline size={24} />
                            <strong>{contribution.reportsMonth}</strong>
                            <span>Báo cáo tháng này</span>
                        </div>
                        <div className="contrib-item">
                            <IoAnalyticsOutline size={24} />
                            <strong>{contribution.accuracy}%</strong>
                            <span>Độ chính xác</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}