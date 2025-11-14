import WeatherMap from "./components/WeatherMap";
import Header from './layouts/Header/Header';
import SearchPanel from "./layouts/SearchPanel/SearchPanel";
import LoginModal from "./layouts/LoginModal/LoginModal";
import React, { useState } from 'react';
import InfoPanel from "./layouts/InfoPanel/InfoPanel";

function App() {

  //Tạo state để quản lý việc mở/đóng modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  //Tạo các hàm để thay đổi state
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <>
      <Header onLoginClick={openLoginModal} />

      <div className="search-panel-container">
        <SearchPanel />
      </div>

      <div style={{ height: '24px' }} />
      <InfoPanel />
      <div style={{ height: '24px' }} />

      <div>
        <h1 style={{ textAlign: "center" }}>🌦 Bản đồ thời tiết theo điểm</h1>
        <WeatherMap />
      </div>

      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
    </>
  );
}

export default App;
