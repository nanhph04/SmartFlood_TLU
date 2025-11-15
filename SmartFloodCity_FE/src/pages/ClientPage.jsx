import WeatherMap from '../components/WeatherMap';
import Header from '../layouts/Header/Header';
import SearchPanel from "../layouts/SearchPanel/SearchPanel";
import InfoPanel from "../layouts/InfoPanel/InfoPanel";

function ClientPage() {
  return (
    <>
      <Header />

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
    </>
  );
}

export default ClientPage;
