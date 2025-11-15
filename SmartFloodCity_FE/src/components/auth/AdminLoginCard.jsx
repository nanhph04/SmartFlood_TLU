import LoginHeader from "./LoginHeader";
import RoleBadge from "./RoleBadge";
import AdminLoginForm from "./AdminLoginForm";
import DemoInfoBox from "./DemoInfoBox";

export default function AdminLoginCard({
  loading,
  error,
  onSubmit,
  onDemoSubmit,
}) {
  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl px-7 py-8">
      <LoginHeader />
      <RoleBadge />
      <AdminLoginForm
        loading={loading}
        error={error}
        onSubmit={onSubmit}
        onDemoSubmit={onDemoSubmit}
      />
      <DemoInfoBox />
    </div>
  );
}
