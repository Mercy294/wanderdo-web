import * as React from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ─── ScrollArea ───────────────────────────────────────────────────────────────

/**
 * A scrollable container with a custom styled scrollbar.
 * The native scrollbar is hidden; a synthetic one is rendered and synced.
 *
 * Props:
 *   hideScrollbar  – hides the custom scrollbar entirely (default false)
 *   scrollbarProps – passed through to the inner <ScrollBar>
 */
export const ScrollArea = React.forwardRef(
  (
    {
      className,
      children,
      hideScrollbar = false,
      scrollbarOrientation = "vertical",
      ...props
    },
    ref,
  ) => {
    const viewportRef = React.useRef(null);

    // Merge the forwarded ref with our internal one
    React.useImperativeHandle(ref, () => viewportRef.current);

    return (
      <div className={cn("relative overflow-hidden", className)} {...props}>
        {/* Viewport — native scrollbar hidden via CSS */}
        <div
          ref={viewportRef}
          className="h-full w-full rounded-[inherit] overflow-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* WebKit scrollbar hidden via a <style> tag injected once */}
          <HideNativeScrollbar />
          {children}
        </div>

        {!hideScrollbar && (
          <ScrollBar
            viewportRef={viewportRef}
            orientation={scrollbarOrientation}
          />
        )}

        {/* Corner fills the gap when both scrollbars are visible */}
        <div className="absolute bottom-0 right-0 h-2 w-2" />
      </div>
    );
  },
);
ScrollArea.displayName = "ScrollArea";

// ─── HideNativeScrollbar ──────────────────────────────────────────────────────
// Injects a <style> block once to hide WebKit's native scrollbar on the
// viewport element. Using a style tag avoids adding a global CSS file dependency.

let injected = false;
function HideNativeScrollbar() {
  React.useEffect(() => {
    if (injected) return;
    injected = true;
    const style = document.createElement("style");
    style.textContent = `[data-scroll-viewport]::-webkit-scrollbar { display: none; }`;
    document.head.appendChild(style);
  }, []);

  return <span data-scroll-viewport="" style={{ display: "none" }} />;
}

// ─── ScrollBar ────────────────────────────────────────────────────────────────

/**
 * Custom scrollbar that syncs with a viewport ref.
 * Can be used standalone or is rendered automatically by <ScrollArea>.
 *
 * Props:
 *   viewportRef   – ref to the scrollable div (required when used standalone)
 *   orientation   – "vertical" (default) | "horizontal"
 *   className     – extra classes on the track
 */
export const ScrollBar = React.forwardRef(
  ({ className, orientation = "vertical", viewportRef, ...props }, ref) => {
    const trackRef = React.useRef(null);
    const thumbRef = React.useRef(null);

    // Merge forwarded ref
    React.useImperativeHandle(ref, () => trackRef.current);

    const isVertical = orientation === "vertical";

    // ── Sync thumb size and position with viewport scroll ──────────────────

    const syncThumb = React.useCallback(() => {
      const vp = viewportRef?.current;
      const thumb = thumbRef.current;
      const track = trackRef.current;
      if (!vp || !thumb || !track) return;

      if (isVertical) {
        const ratio = vp.clientHeight / vp.scrollHeight;
        const trackH = track.clientHeight;
        thumb.style.height = Math.max(ratio * trackH, 20) + "px";
        thumb.style.marginTop =
          (vp.scrollTop / vp.scrollHeight) * trackH + "px";
        track.style.opacity = ratio >= 1 ? "0" : "1";
        track.style.pointerEvents = ratio >= 1 ? "none" : "auto";
      } else {
        const ratio = vp.clientWidth / vp.scrollWidth;
        const trackW = track.clientWidth;
        thumb.style.width = Math.max(ratio * trackW, 20) + "px";
        thumb.style.marginLeft =
          (vp.scrollLeft / vp.scrollWidth) * trackW + "px";
        track.style.opacity = ratio >= 1 ? "0" : "1";
        track.style.pointerEvents = ratio >= 1 ? "none" : "auto";
      }
    }, [isVertical, viewportRef]);

    React.useEffect(() => {
      const vp = viewportRef?.current;
      if (!vp) return;

      syncThumb();
      vp.addEventListener("scroll", syncThumb, { passive: true });

      const ro = new ResizeObserver(syncThumb);
      ro.observe(vp);

      return () => {
        vp.removeEventListener("scroll", syncThumb);
        ro.disconnect();
      };
    }, [syncThumb, viewportRef]);

    // ── Thumb drag ────────────────────────────────────────────────────────

    const drag = React.useRef({ active: false, startPos: 0, startScroll: 0 });

    const onThumbMouseDown = (e) => {
      e.preventDefault();
      const vp = viewportRef?.current;
      if (!vp) return;
      drag.current = {
        active: true,
        startPos: isVertical ? e.clientY : e.clientX,
        startScroll: isVertical ? vp.scrollTop : vp.scrollLeft,
      };
      document.body.style.userSelect = "none";
      document.body.style.cursor = isVertical ? "ns-resize" : "ew-resize";
    };

    React.useEffect(() => {
      const onMouseMove = (e) => {
        if (!drag.current.active) return;
        const vp = viewportRef?.current;
        const track = trackRef.current;
        if (!vp || !track) return;

        const delta = isVertical
          ? e.clientY - drag.current.startPos
          : e.clientX - drag.current.startPos;

        const trackSize = isVertical ? track.clientHeight : track.clientWidth;
        const scrollSize = isVertical ? vp.scrollHeight : vp.scrollWidth;

        if (isVertical) {
          vp.scrollTop =
            drag.current.startScroll + (delta / trackSize) * scrollSize;
        } else {
          vp.scrollLeft =
            drag.current.startScroll + (delta / trackSize) * scrollSize;
        }
      };

      const onMouseUp = () => {
        if (!drag.current.active) return;
        drag.current.active = false;
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      return () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
    }, [isVertical, viewportRef]);

    // ── Render ────────────────────────────────────────────────────────────

    return (
      <div
        ref={trackRef}
        data-orientation={orientation}
        className={cn(
          "flex touch-none select-none transition-all duration-300",
          isVertical
            ? "absolute right-0 top-0 h-full w-2 flex-col border-l border-l-transparent p-[1px] hover:w-2.5"
            : "absolute bottom-0 left-0 h-2 w-full flex-row border-t border-t-transparent p-[1px] hover:h-2.5",
          className,
        )}
        style={{ transition: "opacity 300ms, width 200ms, height 200ms" }}
        {...props}
      >
        <div
          ref={thumbRef}
          onMouseDown={onThumbMouseDown}
          className="relative rounded-full bg-border/50 hover:bg-border/80 transition-colors cursor-grab active:cursor-grabbing"
          style={isVertical ? { minHeight: 20 } : { minWidth: 20 }}
        />
      </div>
    );
  },
);
ScrollBar.displayName = "ScrollBar";

// ─── Example usage ────────────────────────────────────────────────────────────
//
// Vertical (default):
// <ScrollArea className="h-72 w-48 rounded-md border">
//   <div className="p-4">
//     {Array.from({ length: 50 }, (_, i) => (
//       <p key={i} className="text-sm">Item {i + 1}</p>
//     ))}
//   </div>
// </ScrollArea>
//
// Horizontal:
// <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
//   <div className="flex w-max p-4 gap-4">
//     {tags.map(tag => <span key={tag}>{tag}</span>)}
//   </div>
//   <ScrollBar orientation="horizontal" />
// </ScrollArea>
//
// Hide scrollbar (scroll still works, just no visible track):
// <ScrollArea hideScrollbar className="h-48">
//   ...
// </ScrollArea>
