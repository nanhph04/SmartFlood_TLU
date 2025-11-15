import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import AdminLoginCard from "../components/auth/AdminLoginCard";
import { loginAdminApi } from "../services/authApi";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/admin";

  const handleLogin = async ({ email, password }) => {
    setError("");
    setLoading(true);
    try {
      const data = await loginAdminApi(email, password);
      // data = { accessToken, user }
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản/mật khẩu.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AdminLoginCard
        loading={loading}
        error={error}
        onSubmit={handleLogin}
        onDemoSubmit={handleLogin}
      />
    </AuthLayout>
  );
}
