import { useState } from "react";
import InputField from "../ui/InputField";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";

export default function AdminLoginForm({
  error,
  loading,
  onSubmit,
  onDemoSubmit,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  const handleDemoClick = () => {
    const demo = { email: "admin", password: "admin123" };
    setEmail(demo.email);
    setPassword(demo.password);
    onDemoSubmit?.(demo);
  };

  return (
    <>
      {error && (
        <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="email"
          label="Tên đăng nhập"
          placeholder="Nhập tên đăng nhập"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          leftIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-3.33 0-6 2.24-6 5v1h12v-1c0-2.76-2.67-5-6-5Z" />
            </svg>
          }
        />

        <InputField
          id="password"
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          leftIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17 9h-1V7a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V7Zm7 12H7v-8h10v8Z" />
            </svg>
          }
        />

        <PrimaryButton type="submit" disabled={loading} className="mt-2">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </PrimaryButton>

        <SecondaryButton type="button" onClick={handleDemoClick}>
          Dùng thử tài khoản demo
        </SecondaryButton>
      </form>
    </>
  );
}
