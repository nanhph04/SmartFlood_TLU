export default function PrimaryButton({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      className={
        "w-full py-2.5 rounded-2xl text-sm font-semibold text-white " +
        "bg-gradient-to-r from-fuchsia-500 to-pink-500 shadow-md " +
        "hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed " +
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-400 " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
