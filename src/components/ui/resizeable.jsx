import * as React from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ResizableGroupContext = React.createContext({ direction: "horizontal" });

// ─── ResizablePanelGroup ──────────────────────────────────────────────────────

/**
 * Container that lays out panels and handles.
 *
 * Props:
 *   direction  – "horizontal" (default) | "vertical"
 *   className  – extra classes
 */
export function ResizablePanelGroup({
  className,
  direction = "horizontal",
  children,
  ...props
}) {
  return (
    <ResizableGroupContext.Provider value={{ direction }}>
      <div
        data-panel-group-direction={direction}
        className={cn(
          "flex h-full w-full",
          direction === "vertical" && "flex-col",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ResizableGroupContext.Provider>
  );
}

// ─── ResizablePanel ───────────────────────────────────────────────────────────

/**
 * An individual panel inside a ResizablePanelGroup.
 *
 * Props:
 *   defaultSize  – initial size as a % of the group (0–100). Defaults to auto.
 *   minSize      – minimum size as % (default 10)
 *   maxSize      – maximum size as % (default 90)
 *   className    – extra classes
 *
 * Sizing is done via a `flex` style so adjacent panels fill the remaining space
 * naturally without needing explicit sizes on every panel.
 */
export const ResizablePanel = React.forwardRef(
  ({ className, defaultSize, style, children, ...props }, ref) => {
    const flexStyle =
      defaultSize !== undefined
        ? { flex: `0 0 ${defaultSize}%`, overflow: "hidden" }
        : { flex: "1 1 0%", overflow: "hidden" };

    return (
      <div
        ref={ref}
        data-panel=""
        style={{ ...flexStyle, ...style }}
        className={cn("overflow-hidden", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
ResizablePanel.displayName = "ResizablePanel";

// ─── GripVertical icon (replaces lucide-react import) ────────────────────────

function GripVertical({ className, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="2" cy="2" r="1" opacity=".5" />
      <circle cx="2" cy="5" r="1" opacity=".5" />
      <circle cx="2" cy="8" r="1" opacity=".5" />
      <circle cx="6" cy="2" r="1" opacity=".5" />
      <circle cx="6" cy="5" r="1" opacity=".5" />
      <circle cx="6" cy="8" r="1" opacity=".5" />
    </svg>
  );
}

// ─── ResizableHandle ──────────────────────────────────────────────────────────

/**
 * A drag handle between two ResizablePanels.
 *
 * Props:
 *   withHandle  – renders the visible grip widget (default false)
 *   className   – extra classes
 *   onDrag      – optional callback ({ delta, direction }) fired on each drag move
 *
 * Keyboard support: Arrow keys move the handle by 10px steps.
 * The handle resizes the *previous* sibling panel (flex: 0 0 Npx).
 */
export function ResizableHandle({
  withHandle = false,
  className,
  onDrag,
  ...props
}) {
  const { direction } = React.useContext(ResizableGroupContext);
  const isVertical = direction === "vertical";

  const handleRef = React.useRef(null);
  const dragging = React.useRef(false);
  const startPos = React.useRef(0);
  const startSize = React.useRef(0);

  // ── Drag logic ──────────────────────────────────────────────────────────────

  const getPrevPanel = () => handleRef.current?.previousElementSibling;

  const clampSize = (el, size) => {
    const parent = el.parentElement;
    const groupSize = isVertical ? parent.offsetHeight : parent.offsetWidth;
    return Math.min(Math.max(size, groupSize * 0.1), groupSize * 0.9);
  };

  const applySize = (el, size) => {
    el.style.flex = `0 0 ${size}px`;
  };

  const onMouseDown = (e) => {
    const prev = getPrevPanel();
    if (!prev) return;
    dragging.current = true;
    startPos.current = isVertical ? e.clientY : e.clientX;
    startSize.current = isVertical ? prev.offsetHeight : prev.offsetWidth;
    handleRef.current.classList.add("data-dragging");
    document.body.style.cursor = isVertical ? "row-resize" : "col-resize";
    document.body.style.userSelect = "none";
  };

  React.useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging.current) return;
      const prev = getPrevPanel();
      if (!prev) return;
      const delta = isVertical
        ? e.clientY - startPos.current
        : e.clientX - startPos.current;
      const newSize = clampSize(prev, startSize.current + delta);
      applySize(prev, newSize);
      onDrag?.({ delta, direction });
    };

    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      handleRef.current?.classList.remove("data-dragging");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isVertical, onDrag]);

  // ── Keyboard support ────────────────────────────────────────────────────────

  const onKeyDown = (e) => {
    const prev = getPrevPanel();
    if (!prev) return;
    const step = 10;
    const current = isVertical ? prev.offsetHeight : prev.offsetWidth;
    const decrease = isVertical ? "ArrowUp" : "ArrowLeft";
    const increase = isVertical ? "ArrowDown" : "ArrowRight";
    if (e.key === decrease) applySize(prev, clampSize(prev, current - step));
    if (e.key === increase) applySize(prev, clampSize(prev, current + step));
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      ref={handleRef}
      role="separator"
      tabIndex={0}
      aria-orientation={isVertical ? "horizontal" : "vertical"}
      data-panel-group-direction={direction}
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      className={cn(
        // Base — horizontal handle (1px wide vertical bar)
        "relative flex w-px items-center justify-center bg-border/50",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
        "cursor-col-resize",
        // Vertical handle overrides (1px tall horizontal bar)
        isVertical && [
          "h-px w-full cursor-row-resize",
          "after:left-0 after:h-1 after:w-full after:-translate-y-1/2 after:translate-x-0",
          "flex-col",
        ],
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "z-10 flex h-4 w-3 items-center justify-center rounded-sm",
            "border border-border/50 bg-border/30 hover:bg-border/50 transition-colors",
            isVertical && "rotate-90",
          )}
        >
          <GripVertical className="h-2.5 w-2.5 text-primary/40" />
        </div>
      )}
    </div>
  );
}

// ─── Example usage ────────────────────────────────────────────────────────────
//
// Horizontal (default):
// <ResizablePanelGroup direction="horizontal" className="min-h-[200px] rounded-lg border">
//   <ResizablePanel defaultSize={50}>
//     <div className="flex h-full items-center justify-center p-6">
//       <span className="font-semibold">One</span>
//     </div>
//   </ResizablePanel>
//   <ResizableHandle withHandle />
//   <ResizablePanel defaultSize={50}>
//     <div className="flex h-full items-center justify-center p-6">
//       <span className="font-semibold">Two</span>
//     </div>
//   </ResizablePanel>
// </ResizablePanelGroup>
//
// Vertical:
// <ResizablePanelGroup direction="vertical" className="min-h-[400px] rounded-lg border">
//   <ResizablePanel defaultSize={60}>Top</ResizablePanel>
//   <ResizableHandle />
//   <ResizablePanel>Bottom</ResizablePanel>
// </ResizablePanelGroup>
//
// Three panels:
// <ResizablePanelGroup direction="horizontal">
//   <ResizablePanel defaultSize={25}>Sidebar</ResizablePanel>
//   <ResizableHandle withHandle />
//   <ResizablePanel defaultSize={50}>Main</ResizableHandle>
//   <ResizableHandle withHandle />
//   <ResizablePanel>Details</ResizablePanel>
// </ResizablePanelGroup>
