import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ── Overlay ──────────────────────────────────────────────────────────────────

function AlertDialogOverlay({ className, onClick }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
        className,
      )}
      style={{ animation: "fadeIn 0.15s ease" }}
    />
  );
}

// ── Content ───────────────────────────────────────────────────────────────────

function AlertDialogContent({ className, children }) {
  // Trap focus inside the dialog
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.focus();
    return () => prev?.focus();
  }, []);

  // Close on Escape is intentionally omitted for alert dialogs
  // (user must explicitly choose an action)

  return createPortal(
    <>
      <AlertDialogOverlay />
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-gray-200 bg-white p-6 shadow-lg rounded-lg",
          className,
        )}
        style={{ animation: "dialogIn 0.2s ease", outline: "none" }}
      >
        {children}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes dialogIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>,
    document.body,
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

function AlertDialog({ open, children }) {
  if (!open) return null;
  return <>{children}</>;
}

// ── Trigger ───────────────────────────────────────────────────────────────────

function AlertDialogTrigger({ onClick, children, className }) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

// ── Header / Footer ───────────────────────────────────────────────────────────

function AlertDialogHeader({ className, children }) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className,
      )}
    >
      {children}
    </div>
  );
}

function AlertDialogFooter({ className, children }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ── Title / Description ───────────────────────────────────────────────────────

function AlertDialogTitle({ className, children }) {
  return (
    <h2 className={cn("text-lg font-semibold text-gray-900", className)}>
      {children}
    </h2>
  );
}

function AlertDialogDescription({ className, children }) {
  return (
    <p className={cn("text-sm text-gray-500 mt-2", className)}>{children}</p>
  );
}

// ── Action / Cancel ───────────────────────────────────────────────────────────

const baseButton =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4";

function AlertDialogAction({ className, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        baseButton,
        "bg-blue-600 text-white hover:bg-blue-700",
        className,
      )}
    >
      {children}
    </button>
  );
}

function AlertDialogCancel({ className, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        baseButton,
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 mt-2 sm:mt-0",
        className,
      )}
    >
      {children}
    </button>
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
