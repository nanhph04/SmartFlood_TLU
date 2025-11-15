export default function LoginHeader() {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600 text-white">
        {/* icon giọt nước */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2.69 7.05 9.44A7 7 0 1 0 16.95 9.44L12 2.69zm0 17.06A5 5 0 0 1 8.2 11.4L12 6.34l3.8 5.06A5 5 0 0 1 12 19.75z" />
        </svg>
      </div>
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          Giám sát ngập đô thị
        </h1>
        <p className="text-xs text-slate-500">
          Đăng nhập để truy cập trang quản trị hệ thống
        </p>
      </div>
    </div>
  );
}
