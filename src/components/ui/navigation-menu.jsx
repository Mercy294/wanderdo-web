import { useState, useEffect, useRef, createContext, useContext } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────

const NavigationMenuContext = createContext(null);

// ─── Root ─────────────────────────────────────────────────────────────────────

export function NavigationMenu({ className = "", children, ...props }) {
  const [activeItem, setActiveItem] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setActiveItem(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setActiveItem(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <NavigationMenuContext.Provider value={{ activeItem, setActiveItem }}>
      <nav
        ref={ref}
        className={`relative z-10 flex max-w-max flex-1 items-center justify-center ${className}`}
        {...props}
      >
        {children}
        {/* Viewport renders active content below the nav */}
        <NavigationMenuViewport />
      </nav>
    </NavigationMenuContext.Provider>
  );
}

// ─── List ─────────────────────────────────────────────────────────────────────

export function NavigationMenuList({ className = "", children, ...props }) {
  return (
    <ul
      className={`group flex flex-1 list-none items-center justify-center space-x-1 ${className}`}
      {...props}
    >
      {children}
    </ul>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────

export function NavigationMenuItem({ id, className = "", children, ...props }) {
  return (
    <li className={`relative ${className}`} data-nav-item-id={id} {...props}>
      {children}
    </li>
  );
}

// ─── Trigger style helper (mirrors navigationMenuTriggerStyle from cva) ────────

export function navigationMenuTriggerStyle(extra = "") {
  return `group inline-flex h-10 w-max items-center justify-center rounded-md bg-background/50 px-4 py-2 text-sm font-medium transition-all hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/60 data-[state=open]:bg-accent/60 ${extra}`;
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

export function NavigationMenuTrigger({
  className = "",
  children,
  itemId,
  ...props
}) {
  const { activeItem, setActiveItem } = useContext(NavigationMenuContext);
  const isOpen = activeItem === itemId;

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-haspopup="true"
      data-state={isOpen ? "open" : "closed"}
      className={navigationMenuTriggerStyle(`group ${className}`)}
      onClick={() => setActiveItem(isOpen ? null : itemId)}
      {...props}
    >
      {children}{" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        className={`relative top-[1px] ml-1 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`}
      >
        <polyline points="2,4 6,8 10,4" />
      </svg>
    </button>
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────
// Each item's content registers itself so the Viewport can render it.

const contentRegistry = new Map();

export function NavigationMenuContent({
  itemId,
  className = "",
  children,
  ...props
}) {
  // Register content in the registry so Viewport can pick it up
  contentRegistry.set(itemId, { children, className, props });
  return null; // Rendered via Viewport
}

// ─── Viewport ─────────────────────────────────────────────────────────────────

export function NavigationMenuViewport({ className = "", ...props }) {
  const { activeItem } = useContext(NavigationMenuContext);
  const entry = activeItem ? contentRegistry.get(activeItem) : null;

  if (!entry) return null;

  return (
    <div className="absolute left-0 top-full flex justify-center">
      <div
        className={`relative mt-1.5 min-w-[200px] overflow-hidden rounded-md border border-border/40 bg-popover/95 backdrop-blur-sm text-popover-foreground shadow-lg animate-in zoom-in-90 fade-in-0 duration-200 ${entry.className ?? ""} ${className}`}
        {...props}
      >
        {entry.children}
      </div>
    </div>
  );
}

// ─── Link ─────────────────────────────────────────────────────────────────────

export function NavigationMenuLink({ className = "", children, ...props }) {
  return (
    <a
      className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

// ─── Indicator ────────────────────────────────────────────────────────────────

export function NavigationMenuIndicator({ className = "", ...props }) {
  const { activeItem } = useContext(NavigationMenuContext);

  if (!activeItem) return null;

  return (
    <div
      className={`top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden animate-in fade-in-0 ${className}`}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-primary/20 shadow-md" />
    </div>
  );
}

// ─── Example usage ────────────────────────────────────────────────────────────
//
// IMPORTANT: NavigationMenuTrigger and NavigationMenuContent must share the
// same `itemId` string so the viewport knows what to render.
//
// <NavigationMenu>
//   <NavigationMenuList>
//     <NavigationMenuItem id="getting-started">
//       <NavigationMenuTrigger itemId="getting-started">
//         Getting started
//       </NavigationMenuTrigger>
//       <NavigationMenuContent itemId="getting-started">
//         <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
//           <li className="row-span-3">
//             <NavigationMenuLink href="/">
//               <div className="mb-2 mt-4 text-lg font-medium">EKI Marketplace</div>
//               <p className="text-sm leading-tight text-muted-foreground">
//                 Multi-vendor platform for African commerce.
//               </p>
//             </NavigationMenuLink>
//           </li>
//           <ListItem href="/docs" title="Introduction">
//             Overview of the platform.
//           </ListItem>
//         </ul>
//       </NavigationMenuContent>
//     </NavigationMenuItem>
//
//     <NavigationMenuItem id="components">
//       <NavigationMenuTrigger itemId="components">Components</NavigationMenuTrigger>
//       <NavigationMenuContent itemId="components">
//         <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
//           <ListItem href="/docs/alert-dialog" title="Alert dialog">
//             A modal dialog for confirmations.
//           </ListItem>
//         </ul>
//       </NavigationMenuContent>
//     </NavigationMenuItem>
//
//     <NavigationMenuItem>
//       <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>
//         Documentation
//       </NavigationMenuLink>
//     </NavigationMenuItem>
//   </NavigationMenuList>
// </NavigationMenu>
//
// Helper component used inside content panels:
//
// function ListItem({ title, children, href, ...props }) {
//   return (
//     <li>
//       <NavigationMenuLink href={href} {...props}>
//         <div className="text-sm font-medium leading-none">{title}</div>
//         <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
//           {children}
//         </p>
//       </NavigationMenuLink>
//     </li>
//   );
// }
