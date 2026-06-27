import { useState, useRef, useEffect } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ChevronDown({ className }) {
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
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function AccordionItem({ className, children, value, openItem, onToggle }) {
  return (
    <div
      className={cn("border-b border-gray-200", className)}
      data-state={openItem === value ? "open" : "closed"}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { value, openItem, onToggle }),
      )}
    </div>
  );
}

function AccordionTrigger({ className, children, value, openItem, onToggle }) {
  const isOpen = openItem === value;
  return (
    <div className="flex">
      <button
        onClick={() => onToggle(value)}
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-colors hover:text-blue-600",
          isOpen && "text-blue-600",
          className,
        )}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {children}
        <ChevronDown
          className={cn(
            "shrink-0 text-gray-400 transition-transform duration-300 ease-in-out",
            isOpen && "rotate-180",
          )}
        />
      </button>
    </div>
  );
}

function AccordionContent({ className, children, value, openItem }) {
  const isOpen = openItem === value;
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(isOpen ? ref.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      style={{
        overflow: "hidden",
        maxHeight: height,
        transition: "max-height 0.3s ease",
      }}
    >
      <div
        ref={ref}
        className={cn("pb-4 pt-0 text-sm text-gray-500", className)}
      >
        {children}
      </div>
    </div>
  );
}

function Accordion({ children, defaultValue, className }) {
  const [openItem, setOpenItem] = useState(defaultValue ?? null);

  const handleToggle = (value) => {
    setOpenItem((prev) => (prev === value ? null : value));
  };

  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { openItem, onToggle: handleToggle }),
      )}
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
