import { createContext, useContext, useState, useRef, useEffect } from "react";

const CollapsibleContext = createContext(null);

function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
  ...props
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const toggle = () => {
    const next = !open;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <CollapsibleContext.Provider value={{ open, toggle }}>
      <div
        data-state={open ? "open" : "closed"}
        className={className}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({ children, className, asChild, ...props }) {
  const { toggle } = useContext(CollapsibleContext);
  return (
    <button type="button" onClick={toggle} className={className} {...props}>
      {children}
    </button>
  );
}

function CollapsibleContent({ children, className, ...props }) {
  const { open } = useContext(CollapsibleContext);
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(open ? ref.current.scrollHeight : 0);
  }, [open]);

  return (
    <div
      style={{
        overflow: "hidden",
        maxHeight: height,
        transition: "max-height 0.3s ease",
      }}
    >
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </div>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
