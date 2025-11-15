import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar đơn giản */}
      <aside className="w-56 bg-white border-r border-slate-200 p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Admin</h2>
        <nav className="flex-1 space-y-2 text-sm">
          <Link
            to="/admin"
            className="block px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            Dashboard
          </Link>
          {/* sau này thêm: /admin/reports, /admin/settings,... */}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 text-xs text-slate-500 hover:text-red-500"
        >
          Đăng xuất
        </button>
      </aside>

      {/* Nội dung */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
