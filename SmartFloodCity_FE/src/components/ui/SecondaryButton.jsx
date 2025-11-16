export default function SecondaryButton({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      className={
        "w-full py-2.5 rounded-2xl text-sm font-medium text-slate-700 " +
        "bg-white border border-slate-200 hover:bg-slate-50 " +
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
