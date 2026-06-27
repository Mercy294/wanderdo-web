import { forwardRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function XIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Dialog (root) ─────────────────────────────────────────────────────────────

function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return <>{children}</>;
}

// ── DialogTrigger ─────────────────────────────────────────────────────────────

function DialogTrigger({ children, onClick, className, ...props }) {
  return (
    <button type="button" onClick={onClick} className={className} {...props}>
      {children}
    </button>
  );
}

// ── DialogOverlay ─────────────────────────────────────────────────────────────

const DialogOverlay = forwardRef(({ className, onClick, ...props }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    className={cn("fixed inset-0 z-50 bg-black/80 backdrop-blur-sm", className)}
    style={{ animation: "fadeIn 0.15s ease" }}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

// ── DialogContent ─────────────────────────────────────────────────────────────

const DialogContent = forwardRef(
  ({ className, children, onClose, ...props }, ref) => {
    const innerRef = useRef(null);
    const resolvedRef = ref || innerRef;

    // Focus trap
    useEffect(() => {
      const prev = document.activeElement;
      resolvedRef.current?.focus();
      return () => prev?.focus();
    }, []);

    // Close on Escape
    useEffect(() => {
      const handleKey = (e) => {
        if (e.key === "Escape") onClose?.();
      };
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return createPortal(
      <>
        <DialogOverlay onClick={onClose} />
        <div
          ref={resolvedRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4",
            "border border-gray-200 bg-white p-6 shadow-lg sm:rounded-lg",
            "outline-none",
            className,
          )}
          style={{ animation: "dialogIn 0.2s ease" }}
          {...props}
        >
          {children}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
        </div>
        <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes dialogIn {
          from { opacity:0; transform:translate(-50%,-50%) scale(0.95) }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1) }
        }
      `}</style>
      </>,
      document.body,
    );
  },
);
DialogContent.displayName = "DialogContent";

// ── DialogClose ───────────────────────────────────────────────────────────────

function DialogClose({ children, onClick, className, ...props }) {
  return (
    <button type="button" onClick={onClick} className={className} {...props}>
      {children}
    </button>
  );
}

// ── DialogHeader ──────────────────────────────────────────────────────────────

function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  );
}
DialogHeader.displayName = "DialogHeader";

// ── DialogFooter ──────────────────────────────────────────────────────────────

function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...props}
    />
  );
}
DialogFooter.displayName = "DialogFooter";

// ── DialogTitle ───────────────────────────────────────────────────────────────

const DialogTitle = forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-gray-900",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

// ── DialogDescription ─────────────────────────────────────────────────────────

const DialogDescription = forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props} />
));
DialogDescription.displayName = "DialogDescription";

// ── DialogPortal (no-op passthrough) ─────────────────────────────────────────
// Included for drop-in compatibility; DialogContent already portals itself.
function DialogPortal({ children }) {
  return <>{children}</>;
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
