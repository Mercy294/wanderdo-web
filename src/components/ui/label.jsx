import { forwardRef } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const variantStyles = {
  default: "text-gray-900",
  muted: "text-gray-500",
  accent: "text-blue-600",
};

const sizeStyles = {
  default: "text-sm",
  xs: "text-xs",
  sm: "text-sm",
  lg: "text-base",
};

const base =
  "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

const Label = forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        base,
        variantStyles[variant] ?? variantStyles.default,
        sizeStyles[size] ?? sizeStyles.default,
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";

export { Label };
