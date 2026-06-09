import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  variant?: "default" | "gold" | "emerald";
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: {
    header: "bg-navy/5 border-navy/10",
    row: "hover:bg-navy/5",
    footer: "bg-navy/5",
  },
  gold: {
    header: "bg-gold/10 border-gold/20",
    row: "hover:bg-gold/5",
    footer: "bg-gold/10",
  },
  emerald: {
    header: "bg-emerald/10 border-emerald/20",
    row: "hover:bg-emerald/5",
    footer: "bg-emerald/10",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = "default", striped = false, hoverable = true, compact = false, ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];

    return (
      <div className="relative w-full overflow-auto rounded-xl border border-mint/30 bg-white/50 backdrop-blur-sm">
        <table
          ref={ref}
          className={cn("w-full caption-bottom text-sm", compact ? "text-xs" : "text-sm", className)}
          {...props}
        />
      </div>
    );
  },
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { variant?: "default" | "gold" | "emerald" }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyle = VARIANT_STYLES[variant];

  return <thead ref={ref} className={cn("border-b", variantStyle.header, className)} {...props} />;
});
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { variant?: "default" | "gold" | "emerald" }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyle = VARIANT_STYLES[variant];

  return <tfoot ref={ref} className={cn("border-t font-medium", variantStyle.footer, className)} {...props} />;
});
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { variant?: "default" | "gold" | "emerald"; striped?: boolean }
>(({ className, variant = "default", striped, ...props }, ref) => {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <tr
      ref={ref}
      className={cn(
        "border-b border-mint/20 transition-colors duration-200",
        variantStyle.row,
        striped && "even:bg-muted/30",
        className,
      )}
      {...props}
    />
  );
});
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & { sortable?: boolean; sorted?: "asc" | "desc" }
>(({ className, sortable, sorted, children, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-semibold text-navy",
      "first:rounded-tl-lg last:rounded-tr-lg",
      sortable && "cursor-pointer select-none hover:bg-muted/30",
      className,
    )}
    {...props}
  >
    <div className={cn("flex items-center gap-2", sortable && "justify-between")}>
      {children}
      {sortable && (
        <div className="flex flex-col">
          <svg
            className={cn("h-2 w-2 transition-colors", sorted === "asc" ? "text-navy" : "text-muted-foreground")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          <svg
            className={cn(
              "h-2 w-2 -mt-0.5 transition-colors",
              sorted === "desc" ? "text-navy" : "text-muted-foreground",
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}
    </div>
  </th>
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("p-3 align-middle text-muted-foreground", "first:pl-4 last:pr-4", className)}
      {...props}
    />
  ),
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-3 text-xs text-muted-foreground text-center", className)} {...props} />
  ),
);
TableCaption.displayName = "TableCaption";

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Table with gold theme
 */
const GoldTable = (props: TableProps) => <Table variant="gold" {...props} />;

/**
 * Table with emerald theme
 */
const EmeraldTable = (props: TableProps) => <Table variant="emerald" {...props} />;

/**
 * Table skeleton loader
 */
const TableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div className="rounded-xl border border-mint/30 bg-white/50 p-4">
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-2 pb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-6 flex-1 animate-pulse rounded bg-navy/10" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-2">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={colIdx} className="h-8 flex-1 animate-pulse rounded bg-navy/5" />
          ))}
        </div>
      ))}
    </div>
  </div>
);
TableSkeleton.displayName = "TableSkeleton";

// ============================================================================
// Default Export
// ============================================================================

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  GoldTable,
  EmeraldTable,
  TableSkeleton,
};
