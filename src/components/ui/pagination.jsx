import * as React from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Replaces buttonVariants({ variant, size }) from shadcn
function buttonVariants({ variant = "ghost", size = "icon" } = {}) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    ghost: "hover:bg-accent/50 hover:text-accent-foreground",
    outline:
      "border border-input bg-background hover:bg-accent/50 hover:text-accent-foreground",
  };

  const sizes = {
    default: "h-9 px-4 py-2",
    icon: "h-9 w-9",
  };

  return cn(
    base,
    variants[variant] ?? variants.ghost,
    sizes[size] ?? sizes.icon,
  );
}

// ─── Pagination (nav wrapper) ─────────────────────────────────────────────────

export const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

// ─── PaginationContent (ul) ───────────────────────────────────────────────────

export const PaginationContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  ),
);
PaginationContent.displayName = "PaginationContent";

// ─── PaginationItem (li) ──────────────────────────────────────────────────────

export const PaginationItem = React.forwardRef(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
  ),
);
PaginationItem.displayName = "PaginationItem";

// ─── PaginationLink (a) ───────────────────────────────────────────────────────

export const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({ variant: isActive ? "outline" : "ghost", size }),
      isActive &&
        "border-primary/50 bg-primary/5 text-primary hover:bg-primary/10",
      "transition-colors",
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

// ─── PaginationPrevious ───────────────────────────────────────────────────────

export const PaginationPrevious = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5 hover:text-primary", className)}
    {...props}
  >
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
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

// ─── PaginationNext ───────────────────────────────────────────────────────────

export const PaginationNext = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5 hover:text-primary", className)}
    {...props}
  >
    <span>Next</span>
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
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

// ─── PaginationEllipsis ───────────────────────────────────────────────────────

export const PaginationEllipsis = ({ className, ...props }) => (
  <span
    aria-hidden
    className={cn(
      "flex h-9 w-9 items-center justify-center text-muted-foreground",
      className,
    )}
    {...props}
  >
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
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

// ─── Example usage ────────────────────────────────────────────────────────────
//
// function getPageRange(current, total) {
//   if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
//   if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
//   if (current >= total - 3) return [1, "ellipsis", total-4, total-3, total-2, total-1, total];
//   return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
// }
//
// function MyPagination({ currentPage, totalPages, onPageChange }) {
//   return (
//     <Pagination>
//       <PaginationContent>
//         <PaginationItem>
//           <PaginationPrevious
//             href="#"
//             onClick={(e) => { e.preventDefault(); onPageChange(currentPage - 1); }}
//             aria-disabled={currentPage === 1}
//           />
//         </PaginationItem>
//
//         {getPageRange(currentPage, totalPages).map((page, i) =>
//           page === "ellipsis" ? (
//             <PaginationItem key={`ellipsis-${i}`}>
//               <PaginationEllipsis />
//             </PaginationItem>
//           ) : (
//             <PaginationItem key={page}>
//               <PaginationLink
//                 href="#"
//                 isActive={page === currentPage}
//                 onClick={(e) => { e.preventDefault(); onPageChange(page); }}
//               >
//                 {page}
//               </PaginationLink>
//             </PaginationItem>
//           )
//         )}
//
//         <PaginationItem>
//           <PaginationNext
//             href="#"
//             onClick={(e) => { e.preventDefault(); onPageChange(currentPage + 1); }}
//             aria-disabled={currentPage === totalPages}
//           />
//         </PaginationItem>
//       </PaginationContent>
//     </Pagination>
//   );
// }
