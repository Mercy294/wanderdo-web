import { forwardRef, useContext } from "react";
import { OTPInput, OTPInputContext } from "input-otp";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function DotIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ── InputOTP ──────────────────────────────────────────────────────────────────

const InputOTP = forwardRef(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  ),
);
InputOTP.displayName = "InputOTP";

// ── InputOTPGroup ─────────────────────────────────────────────────────────────

const InputOTPGroup = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

// ── InputOTPSlot ──────────────────────────────────────────────────────────────

const InputOTPSlot = forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-gray-300 bg-white text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-blue-600 border-blue-400",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-blue-600 duration-700" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

// ── InputOTPSeparator ─────────────────────────────────────────────────────────

const InputOTPSeparator = forwardRef(({ ...props }, ref) => (
  <div ref={ref} role="separator" className="text-gray-400" {...props}>
    <DotIcon />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
