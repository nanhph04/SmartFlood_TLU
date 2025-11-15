function Footer() {
  return (
    <footer className="mt-6 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-slate-200 text-xs py-4 px-6 lg:px-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span>© 2025 Hệ thống giám sát ngập đô thị - Nền tảng dữ liệu mở</span>
        <div className="flex gap-4">
          <button className="hover:text-sky-300">Về dự án</button>
          <button className="hover:text-sky-300">API Documentation</button>
          <button className="hover:text-sky-300">Liên hệ</button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;