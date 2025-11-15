import React, { useState } from 'react';
import { IoMapOutline, IoDocumentTextOutline, IoChatbubblesOutline } from 'react-icons/io5';
import './InfoPanel.css'; // File CSS

// Import 3 component con
import SensorGrid from './SensorGrid';
import ReportForm from './ReportForm';
import CommunityFeed from './CommunityFeed';

export default function InfoPanel() {
    const [activeTab, setActiveTab] = useState('map'); // 'map', 'report', 'community'

    // Hàm để render nội dung tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'map':
                return <SensorGrid />;
            case 'report':
                return <ReportForm />;
            case 'community':
                return <CommunityFeed />;
            default:
                return <SensorGrid />;
        }
    };

    return (
        <div className="info-panel-wrapper">
            {/* Thanh Tab điều hướng */}
            <div className="info-panel-tabs">
                <button
                    className={`tab-nav-button ${activeTab === 'map' ? 'active' : ''}`}
                    onClick={() => setActiveTab('map')}
                >
                    <IoMapOutline /> Bản đồ
                </button>
                <button
                    className={`tab-nav-button ${activeTab === 'report' ? 'active' : ''}`}
                    onClick={() => setActiveTab('report')}
                >
                    <IoDocumentTextOutline /> Báo cáo
                </button>
                <button
                    className={`tab-nav-button ${activeTab === 'community' ? 'active' : ''}`}
                    onClick={() => setActiveTab('community')}
                >
                    <IoChatbubblesOutline /> Cộng đồng
                </button>
            </div>

            {/* Khung nội dung (thay đổi theo tab) */}
            <div className="info-panel-content">
                {renderTabContent()}
            </div>
        </div>
    );
}