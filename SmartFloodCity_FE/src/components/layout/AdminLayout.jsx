import { NavLink, Outlet } from "react-router-dom";
import Header from "../admin/Header";
import Footer from "../admin/Footer";

const TABS = [
  { id: "overview", label: "Tổng quan", path: "/admin/overview" },
  { id: "sensors", label: "Cảm biến", path: "/admin/sensors" },
  { id: "reports", label: "Báo cáo", path: "/admin/reports" },
  { id: "analytics", label: "Phân tích", path: "/admin/analytics" },
];

function AdminLayout() {
  return (
    <div className="min-h-screen bg-sky-50 text-slate-800 flex flex-col">
      <Header />

      <main className="flex-1 px-6 lg:px-10 pb-10">
        {/* Tabs */}
        <div className="mt-6 bg-white rounded-full inline-flex p-1 shadow-sm shadow-sky-100">
          {TABS.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) =>
                `px-6 py-2 text-sm font-medium rounded-full transition ${
                  isActive
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        {/* Nội dung page */}
        <div className="mt-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminLayout;
