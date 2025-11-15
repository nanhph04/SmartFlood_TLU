export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-indigo-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
