import { useState, useEffect, useRef, createContext, useContext } from "react";

// Context to close the whole menubar from anywhere inside it
const MenubarContext = createContext(null);

// ─── Root ────────────────────────────────────────────────────────────────────

export function Menubar({ className = "", children, ...props }) {
  const [openMenu, setOpenMenu] = useState(null);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <MenubarContext.Provider value={{ openMenu, setOpenMenu }}>
      <div
        ref={ref}
        role="menubar"
        className={`flex h-10 items-center space-x-1 rounded-md border border-border/50 bg-background/50 p-1 shadow-sm ${className}`}
        {...props}
      >
        {children}
      </div>
    </MenubarContext.Provider>
  );
}

// ─── Menu (wrapper for a single trigger + its content) ───────────────────────

export function MenubarMenu({ children }) {
  return <div className="relative">{children}</div>;
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

export function MenubarTrigger({ className = "", children, ...props }) {
  const { openMenu, setOpenMenu } = useContext(MenubarContext);
  const id = children?.toString(); // use label text as key
  const isOpen = openMenu === id;

  return (
    <button
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      className={`flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none transition-colors focus:bg-accent/60 focus:text-accent-foreground data-[state=open]:bg-accent/60 data-[state=open]:text-accent-foreground ${className}`}
      data-state={isOpen ? "open" : "closed"}
      onClick={() => setOpenMenu(isOpen ? null : id)}
      onMouseEnter={() => {
        if (openMenu) setOpenMenu(id);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Content (dropdown panel) ─────────────────────────────────────────────────

export function MenubarContent({
  className = "",
  align = "start",
  children,
  menuId, // must match the trigger's children string
  ...props
}) {
  const { openMenu } = useContext(MenubarContext);
  if (openMenu !== menuId) return null;

  return (
    <div
      role="menu"
      className={`absolute z-50 mt-1 min-w-[12rem] overflow-hidden rounded-md border border-border/40 bg-popover/95 backdrop-blur-sm p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 ${align === "start" ? "left-0" : "right-0"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────

export function MenubarItem({
  className = "",
  inset = false,
  disabled = false,
  onSelect,
  children,
  ...props
}) {
  const { setOpenMenu } = useContext(MenubarContext);

  return (
    <button
      role="menuitem"
      disabled={disabled}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent/60 focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 hover:bg-accent/60 hover:text-accent-foreground ${inset ? "pl-8" : ""} ${className}`}
      onClick={() => {
        onSelect?.();
        setOpenMenu(null);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Checkbox item ────────────────────────────────────────────────────────────

export function MenubarCheckboxItem({
  className = "",
  checked = false,
  onCheckedChange,
  children,
  ...props
}) {
  const { setOpenMenu } = useContext(MenubarContext);

  return (
    <button
      role="menuitemcheckbox"
      aria-checked={checked}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent/60 focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 hover:bg-accent/60 hover:text-accent-foreground ${className}`}
      onClick={() => {
        onCheckedChange?.(!checked);
        setOpenMenu(null);
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4 text-primary"
          >
            <polyline points="3,8 7,12 13,4" />
          </svg>
        )}
      </span>
      {children}
    </button>
  );
}

// ─── Radio group + item ───────────────────────────────────────────────────────

export function MenubarRadioGroup({ value, onValueChange, children }) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div role="group">{children}</div>
    </RadioGroupContext.Provider>
  );
}

const RadioGroupContext = createContext(null);

export function MenubarRadioItem({
  className = "",
  value,
  children,
  ...props
}) {
  const { value: groupValue, onValueChange } = useContext(RadioGroupContext);
  const { setOpenMenu } = useContext(MenubarContext);
  const checked = groupValue === value;

  return (
    <button
      role="menuitemradio"
      aria-checked={checked}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent/60 focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 hover:bg-accent/60 hover:text-accent-foreground ${className}`}
      onClick={() => {
        onValueChange?.(value);
        setOpenMenu(null);
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && (
          <svg
            viewBox="0 0 16 16"
            className="h-2 w-2 fill-current text-primary"
          >
            <circle cx="8" cy="8" r="4" />
          </svg>
        )}
      </span>
      {children}
    </button>
  );
}

// ─── Sub menu ─────────────────────────────────────────────────────────────────

export function MenubarSub({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <SubContext.Provider value={{ open, setOpen }}>
      <div className="relative" onMouseLeave={() => setOpen(false)}>
        {children}
      </div>
    </SubContext.Provider>
  );
}

const SubContext = createContext(null);

export function MenubarSubTrigger({
  className = "",
  inset = false,
  children,
  ...props
}) {
  const { setOpen } = useContext(SubContext);
  return (
    <button
      className={`flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent/60 focus:text-accent-foreground hover:bg-accent/60 hover:text-accent-foreground ${inset ? "pl-8" : ""} ${className}`}
      onMouseEnter={() => setOpen(true)}
      {...props}
    >
      {children}
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="ml-auto h-4 w-4"
      >
        <polyline points="6,4 10,8 6,12" />
      </svg>
    </button>
  );
}

export function MenubarSubContent({ className = "", children, ...props }) {
  const { open } = useContext(SubContext);
  if (!open) return null;

  return (
    <div
      role="menu"
      className={`absolute left-full top-0 z-50 min-w-[8rem] overflow-hidden rounded-md border border-border/40 bg-popover/95 backdrop-blur-sm p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function MenubarSeparator({ className = "", ...props }) {
  return (
    <div
      role="separator"
      className={`-mx-1 my-1 h-px bg-border/60 ${className}`}
      {...props}
    />
  );
}

export function MenubarLabel({
  className = "",
  inset = false,
  children,
  ...props
}) {
  return (
    <div
      className={`px-2 py-1.5 text-sm font-medium text-foreground/80 ${inset ? "pl-8" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function MenubarShortcut({ className = "", ...props }) {
  return (
    <span
      className={`ml-auto text-xs tracking-widest text-muted-foreground/70 ${className}`}
      {...props}
    />
  );
}

// Re-export group/portal as pass-throughs for API parity
export function MenubarGroup({ children }) {
  return <>{children}</>;
}
export function MenubarPortal({ children }) {
  return <>{children}</>;
}

// ─── Example usage ────────────────────────────────────────────────────────────
//
// <Menubar>
//   <MenubarMenu>
//     <MenubarTrigger>File</MenubarTrigger>
//     <MenubarContent menuId="File">
//       <MenubarItem onSelect={() => console.log("New Tab")}>
//         New tab <MenubarShortcut>⌘T</MenubarShortcut>
//       </MenubarItem>
//       <MenubarSeparator />
//       <MenubarSub>
//         <MenubarSubTrigger>Share</MenubarSubTrigger>
//         <MenubarSubContent>
//           <MenubarItem>Email link</MenubarItem>
//           <MenubarItem>Messages</MenubarItem>
//         </MenubarSubContent>
//       </MenubarSub>
//     </MenubarContent>
//   </MenubarMenu>
// </Menubar>
