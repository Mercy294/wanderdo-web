import { forwardRef } from "react";
import { createPortal } from "react-dom";
import { Command as CommandPrimitive } from "cmdk";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SearchIcon({ className }) {
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
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// ── Command ───────────────────────────────────────────────────────────────────

const Command = forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-gray-900",
      className,
    )}
    {...props}
  />
));
Command.displayName = "Command";

// ── CommandDialog ─────────────────────────────────────────────────────────────

function CommandDialog({ open, onOpenChange, children, ...props }) {
  if (!open) return null;

  const close = () => onOpenChange?.(false);

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={close}
        style={{ animation: "fadeIn 0.15s ease" }}
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-lg shadow-lg"
        style={{ animation: "dialogIn 0.2s ease" }}
        {...props}
      >
        <Command
          className={[
            "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium",
            "[&_[cmdk-group-heading]]:text-gray-400",
            "[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0",
            "[&_[cmdk-group]]:px-2",
            "[&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5",
            "[&_[cmdk-input]]:h-12",
            "[&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3",
            "[&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
          ].join(" ")}
        >
          {children}
        </Command>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes dialogIn {
          from { opacity:0; transform:translate(-50%,-4px) scale(0.97) }
          to   { opacity:1; transform:translate(-50%,0) scale(1) }
        }
      `}</style>
    </>,
    document.body,
  );
}

// ── CommandInput ──────────────────────────────────────────────────────────────

const CommandInput = forwardRef(({ className, ...props }, ref) => (
  <div
    className="flex items-center border-b border-gray-200 px-3"
    cmdk-input-wrapper=""
  >
    <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = "CommandInput";

// ── CommandList ───────────────────────────────────────────────────────────────

const CommandList = forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = "CommandList";

// ── CommandEmpty ──────────────────────────────────────────────────────────────

const CommandEmpty = forwardRef((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm text-gray-500"
    {...props}
  />
));
CommandEmpty.displayName = "CommandEmpty";

// ── CommandGroup ──────────────────────────────────────────────────────────────

const CommandGroup = forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-gray-900",
      "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5",
      "[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-400",
      className,
    )}
    {...props}
  />
));
CommandGroup.displayName = "CommandGroup";

// ── CommandSeparator ──────────────────────────────────────────────────────────

const CommandSeparator = forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-gray-200", className)}
    {...props}
  />
));
CommandSeparator.displayName = "CommandSeparator";

// ── CommandItem ───────────────────────────────────────────────────────────────

const CommandItem = forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      "data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-900",
      className,
    )}
    {...props}
  />
));
CommandItem.displayName = "CommandItem";

// ── CommandShortcut ───────────────────────────────────────────────────────────

function CommandShortcut({ className, ...props }) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-gray-400", className)}
      {...props}
    />
  );
}
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
