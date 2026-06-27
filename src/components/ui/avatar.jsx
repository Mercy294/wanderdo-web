import { forwardRef, useState } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const sizeStyles = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const Avatar = forwardRef(
  ({ className, size = "md", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full border border-gray-200 ring-offset-background",
        sizeStyles[size] ?? sizeStyles.md,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
Avatar.displayName = "Avatar";

const AvatarImage = forwardRef(
  ({ className, src, alt = "", onError, ...props }, ref) => {
    const [errored, setErrored] = useState(false);

    if (!src || errored) return null;

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        onError={(e) => {
          setErrored(true);
          onError?.(e);
        }}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
      />
    );
  },
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-500",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
