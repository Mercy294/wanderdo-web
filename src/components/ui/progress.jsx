import * as React from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * @typedef {"default" | "success" | "warning" | "error"} ProgressVariant
 *
 * @typedef {Object} ProgressProps
 * @property {number} [value]          - Current progress value (0–100).
 * @property {number} [max]            - Maximum value. Defaults to 100.
 * @property {ProgressVariant} [variant] - Visual variant. Defaults to "default".
 * @property {string} [className]      - Extra classes on the track element.
 */

// ─── Variant → class map ──────────────────────────────────────────────────────

const indicatorVariants = {
  default: "bg-primary",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-destructive",
};

// ─── Progress ─────────────────────────────────────────────────────────────────

/**
 * A simple accessible progress bar.
 *
 * Mirrors the Radix `Progress` API — `value` is a number from 0 to `max`
 * (default 100). The indicator slides in from the left using a `translateX`
 * transform so the CSS transition fires correctly even on initial render.
 */
export const Progress = React.forwardRef(
  ({ className, value, max = 100, variant = "default", ...props }, ref) => {
    const clamped = Math.min(Math.max(value ?? 0, 0), max);
    const percent = (clamped / max) * 100;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        data-state={clamped >= max ? "complete" : "loading"}
        data-value={clamped}
        data-max={max}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-secondary/40",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 transition-all duration-300 ease-in-out",
            indicatorVariants[variant] ?? indicatorVariants.default,
          )}
          style={{ transform: `translateX(-${100 - percent}%)` }}
        />
      </div>
    );
  },
);

Progress.displayName = "Progress";

// ─── Example usage ────────────────────────────────────────────────────────────
//
// <Progress value={60} />
// <Progress value={80} variant="success" />
// <Progress value={45} variant="warning" />
// <Progress value={25} variant="error" />
//
// With a custom max:
// <Progress value={3} max={10} variant="default" />
//
// Indeterminate (no value):
// Add a CSS animation class and omit `value`:
// <Progress className="animate-pulse" variant="default" />
