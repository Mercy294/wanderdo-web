function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

const variantStyles = {
  default: "border-transparent bg-blue-600 text-white hover:bg-blue-500",
  secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
  destructive: "border-transparent bg-red-500 text-white hover:bg-red-400",
  outline: "text-gray-900 border-gray-300",
  success: "border-green-500/30 bg-green-500/20 text-green-700",
  warning: "border-yellow-500/30 bg-yellow-500/20 text-yellow-700",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-600",
};

const sizeStyles = {
  default: "px-2.5 py-0.5 text-xs",
  sm: "px-2 py-0.5 text-[10px]",
  lg: "px-3 py-0.5 text-sm",
};

function badgeVariants({ variant = "default", size = "default" } = {}) {
  return cn(
    base,
    variantStyles[variant] ?? variantStyles.default,
    sizeStyles[size] ?? sizeStyles.default,
  );
}

function Badge({ className, variant = "default", size = "default", ...props }) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
