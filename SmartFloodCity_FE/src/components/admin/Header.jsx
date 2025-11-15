function Header() {
  return (
    <header className="bg-sky-50/80 backdrop-blur border-b border-sky-100/70 px-6 lg:px-10 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-sky-500 flex items-center justify-center text-white text-xl">
          💧
        </div>
        <div>
          <div className="text-xl font-semibold text-slate-800">
            Giám sát ngập đô thị
          </div>
          <div className="text-xs text-slate-500">Nền tảng dữ liệu mở</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm shadow-sky-100 text-sm">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span>Quản lý</span>
        </span>

        <button className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm text-sm">
          <span className="h-6 w-6 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs">
            A
          </span>
          <span>admin</span>
        </button>

        <button className="px-3 py-1.5 rounded-full text-sm bg-white hover:bg-rose-50 text-rose-500 border border-rose-100">
          Đăng xuất
        </button>
      </div>
    </header>
  );
}

export default Header;
