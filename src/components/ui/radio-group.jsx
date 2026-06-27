import * as React from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ─── Context ──────────────────────────────────────────────────────────────────

const RadioGroupContext = React.createContext(null);

// ─── RadioGroup ───────────────────────────────────────────────────────────────

/**
 * Wraps a set of RadioGroupItems. Manages the shared `value` state and
 * propagates it to each item via context.
 *
 * Props mirror Radix's RadioGroup.Root:
 *   value         – controlled value
 *   defaultValue  – uncontrolled initial value
 *   onValueChange – called with the new value on change
 *   disabled      – disables all items
 *   required      – marks the group as required
 *   name          – HTML name for native form submission
 *   orientation   – "horizontal" | "vertical" (affects aria-orientation)
 *   loop          – whether arrow-key navigation wraps (handled natively by browser)
 */
export const RadioGroup = React.forwardRef(
  (
    {
      className,
      value: controlledValue,
      defaultValue,
      onValueChange,
      disabled = false,
      required = false,
      name,
      orientation = "vertical",
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue ?? "",
    );

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const handleChange = React.useCallback(
      (newValue) => {
        if (!isControlled) setUncontrolledValue(newValue);
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange],
    );

    return (
      <RadioGroupContext.Provider
        value={{ value, onChange: handleChange, disabled, name, required }}
      >
        <div
          ref={ref}
          role="radiogroup"
          aria-orientation={orientation}
          aria-required={required || undefined}
          className={cn("grid gap-2", className)}
          {...props}
        />
      </RadioGroupContext.Provider>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

// ─── RadioGroupItem ───────────────────────────────────────────────────────────

/**
 * A single radio button within a RadioGroup.
 *
 * Props mirror Radix's RadioGroup.Item:
 *   value     – the value this item represents (required)
 *   disabled  – overrides or inherits group-level disabled
 *   id        – links to a <label htmlFor>
 */
export const RadioGroupItem = React.forwardRef(
  ({ className, value, disabled: itemDisabled, id, ...props }, ref) => {
    const group = React.useContext(RadioGroupContext);

    if (!group) {
      throw new Error("RadioGroupItem must be used inside a RadioGroup");
    }

    const {
      value: groupValue,
      onChange,
      disabled: groupDisabled,
      name,
      required,
    } = group;
    const isDisabled = itemDisabled ?? groupDisabled;
    const isChecked = groupValue === value;

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="radio"
        aria-checked={isChecked}
        aria-disabled={isDisabled || undefined}
        disabled={isDisabled}
        data-state={isChecked ? "checked" : "unchecked"}
        data-disabled={isDisabled || undefined}
        onClick={() => !isDisabled && onChange(value)}
        className={cn(
          // Track (outer circle)
          "aspect-square h-4 w-4 rounded-full border border-primary/60 text-primary",
          "ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200",
          className,
        )}
        {...props}
      >
        {/* Indicator (inner filled dot) — only rendered when checked */}
        {isChecked && (
          <span className="flex items-center justify-center">
            <svg
              viewBox="0 0 10 10"
              className="h-2.5 w-2.5 fill-current text-current animate-in zoom-in-0 duration-200"
              aria-hidden="true"
            >
              <circle cx="5" cy="5" r="5" />
            </svg>
          </span>
        )}

        {/* Hidden native input for form submission */}
        {isChecked && (
          <input
            type="hidden"
            name={name}
            value={value}
            required={required}
            aria-hidden="true"
          />
        )}
      </button>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

// ─── Example usage ────────────────────────────────────────────────────────────
//
// Uncontrolled:
// <RadioGroup defaultValue="option-1" onValueChange={(v) => console.log(v)}>
//   <div className="flex items-center gap-2">
//     <RadioGroupItem value="option-1" id="r1" />
//     <label htmlFor="r1">Option 1</label>
//   </div>
//   <div className="flex items-center gap-2">
//     <RadioGroupItem value="option-2" id="r2" />
//     <label htmlFor="r2">Option 2</label>
//   </div>
// </RadioGroup>
//
// Controlled:
// const [currency, setCurrency] = useState("ugx");
// <RadioGroup value={currency} onValueChange={setCurrency} name="currency">
//   <div className="flex items-center gap-2">
//     <RadioGroupItem value="ugx" id="ugx" />
//     <label htmlFor="ugx">UGX</label>
//   </div>
//   <div className="flex items-center gap-2">
//     <RadioGroupItem value="ngn" id="ngn" />
//     <label htmlFor="ngn">NGN</label>
//   </div>
// </RadioGroup>
//
// With a disabled item:
// <RadioGroupItem value="usd" id="usd" disabled />
