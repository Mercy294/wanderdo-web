import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  cloneElement,
} from "react";
import { createPortal } from "react-dom";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ─── Context ──────────────────────────────────────────────────────────────────

const PopoverContext = createContext(null);

// ─── Popover (root) ───────────────────────────────────────────────────────────

export function Popover({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const triggerRef = useRef(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (value) => {
      if (!isControlled) setUncontrolledOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange],
  );

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
}

// ─── PopoverTrigger ───────────────────────────────────────────────────────────

export function PopoverTrigger({ children, asChild = false }) {
  const { open, setOpen, triggerRef } = useContext(PopoverContext);

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen(!open);
    children.props.onClick?.(e);
  };

  if (asChild) {
    return cloneElement(children, {
      ref: triggerRef,
      onClick: handleClick,
      "aria-expanded": open,
      "aria-haspopup": "dialog",
    });
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={handleClick}
      aria-expanded={open}
      aria-haspopup="dialog"
    >
      {children}
    </button>
  );
}

// ─── PopoverContent ───────────────────────────────────────────────────────────

export const PopoverContent = ({
  className,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  children,
  onOpenAutoFocus,
  onCloseAutoFocus,
  ...props
}) => {
  const { open, setOpen, triggerRef } = useContext(PopoverContext);
  const contentRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, setOpen, triggerRef]);

  // Position relative to trigger
  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = 0;
    let left = 0;
    const contentWidth = 288; // w-72

    if (side === "bottom") top = rect.bottom + scrollY + sideOffset;
    if (side === "top") top = rect.top + scrollY - sideOffset; // adjusted after render
    if (side === "left") left = rect.left + scrollX - contentWidth - sideOffset;
    if (side === "right") left = rect.right + scrollX + sideOffset;

    if (side === "bottom" || side === "top") {
      if (align === "center")
        left = rect.left + scrollX + rect.width / 2 - contentWidth / 2;
      if (align === "start") left = rect.left + scrollX;
      if (align === "end") left = rect.right + scrollX - contentWidth;
    }
    if (side === "left" || side === "right") {
      if (align === "center") top = rect.top + scrollY + rect.height / 2;
      if (align === "start") top = rect.top + scrollY;
      if (align === "end") top = rect.bottom + scrollY;
    }

    setPosition({ top, left });
  }, [open, side, align, sideOffset, triggerRef]);

  // Auto-focus first focusable element on open
  useEffect(() => {
    if (!open || !contentRef.current) return;
    if (onOpenAutoFocus) {
      const syntheticEvent = { preventDefault: () => {} };
      onOpenAutoFocus(syntheticEvent);
      if (syntheticEvent._defaultPrevented) return;
    }
    const focusable = contentRef.current.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();
  }, [open, onOpenAutoFocus]);

  if (!open) return null;

  return createPortal(
    <div
      ref={contentRef}
      role="dialog"
      data-state={open ? "open" : "closed"}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 50,
      }}
      className={cn(
        "w-72 rounded-md border border-border/40 bg-popover p-4 text-popover-foreground shadow-md outline-none",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        className,
      )}
      {...props}
    >
      {children}
    </div>,
    document.body,
  );
};

PopoverContent.displayName = "PopoverContent";

// ─── PopoverClose (bonus) ─────────────────────────────────────────────────────
// Radix ships this too; handy for close buttons inside content.

export function PopoverClose({ children, asChild = false, ...props }) {
  const { setOpen } = useContext(PopoverContext);

  if (asChild) {
    return cloneElement(children, {
      onClick: (e) => {
        setOpen(false);
        children.props.onClick?.(e);
      },
      ...props,
    });
  }

  return (
    <button type="button" onClick={() => setOpen(false)} {...props}>
      {children}
    </button>
  );
}

// ─── Example usage ────────────────────────────────────────────────────────────
//
// <Popover>
//   <PopoverTrigger asChild>
//     <button>Open</button>
//   </PopoverTrigger>
//   <PopoverContent className="w-80" align="start">
//     <div className="grid gap-4">
//       <div className="space-y-2">
//         <h4 className="font-medium leading-none">Dimensions</h4>
//         <p className="text-sm text-muted-foreground">
//           Set the dimensions for the layer.
//         </p>
//       </div>
//       <div className="grid gap-2">
//         <div className="grid grid-cols-3 items-center gap-4">
//           <label htmlFor="width">Width</label>
//           <input id="width" defaultValue="100%" className="col-span-2 h-8" />
//         </div>
//       </div>
//     </div>
//     <PopoverClose asChild>
//       <button aria-label="Close">×</button>
//     </PopoverClose>
//   </PopoverContent>
// </Popover>
