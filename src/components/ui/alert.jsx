import { forwardRef } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const variantStyles = {
  default: "bg-white text-gray-900 border-gray-200",
  destructive: "border-red-500/50 text-red-600 [&>svg]:text-red-600",
  success:
    "border-green-500/50 text-green-600 bg-green-50 [&>svg]:text-green-600",
  warning:
    "border-yellow-500/50 text-yellow-600 bg-yellow-50 [&>svg]:text-yellow-600",
  info: "border-blue-500/50 text-blue-600 bg-blue-50 [&>svg]:text-blue-600",
};

const baseAlert =
  "relative w-full rounded-lg border p-4 shadow-sm " +
  "[&>svg~*]:pl-7 [&>svg+div]:-translate-y-[3px] " +
  "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4";

const Alert = forwardRef(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        baseAlert,
        variantStyles[variant] ?? variantStyles.default,
        className,
      )}
      {...props}
    />
  ),
);
Alert.displayName = "Alert";

const AlertTitle = forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90 [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
