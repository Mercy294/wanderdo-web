import { forwardRef, useId } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Check({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const Checkbox = forwardRef(
  (
    {
      className,
      checked,
      defaultChecked,
      onCheckedChange,
      onChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    const id = useId();

    const handleChange = (e) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <span className="relative inline-flex h-4 w-4 shrink-0">
        <input
          type="checkbox"
          ref={ref}
          id={id}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          className="peer sr-only"
          {...props}
        />
        <span
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-sm border border-blue-600/60 bg-white transition-colors duration-200",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            "peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:text-white",
            className,
          )}
        >
          <Check className="hidden h-3.5 w-3.5 transition-transform duration-200 peer-checked:block" />
        </span>
      </span>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
