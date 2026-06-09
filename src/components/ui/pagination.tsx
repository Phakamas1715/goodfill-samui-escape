import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================

interface PaginationProps extends React.ComponentProps<"nav"> {
  variant?: "default" | "gold" | "emerald";
}

interface PaginationLinkProps extends Pick<ButtonProps, "size">, React.ComponentProps<"a"> {
  isActive?: boolean;
  variant?: "default" | "gold" | "emerald";
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: {
    active: "bg-navy text-white hover:bg-navy/90 border-navy",
    normal: "hover:bg-navy/5",
  },
  gold: {
    active: "bg-gold text-emerald-deep hover:bg-gold/90 border-gold",
    normal: "hover:bg-gold/10",
  },
  emerald: {
    active: "bg-emerald text-white hover:bg-emerald/90 border-emerald",
    normal: "hover:bg-emerald/10",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Pagination = ({ className, variant = "default", ...props }: PaginationProps) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1.5", className)} {...props} />
  ),
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({ className, isActive, size = "icon", variant = "default", ...props }: PaginationLinkProps) => {
  const variantStyle = VARIANT_STYLES[variant];
  const activeStyle = isActive ? variantStyle.active : variantStyle.normal;

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: "ghost",
          size,
        }),
        "rounded-lg transition-all duration-200",
        "focus:ring-2 focus:ring-gold focus:ring-offset-2",
        activeStyle,
        className,
      )}
      {...props}
    />
  );
};
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, variant = "default", ...props }: PaginationLinkProps) => {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      variant={variant}
      className={cn("gap-1.5 pl-2.5 rounded-lg", variantStyle.normal, className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </PaginationLink>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, variant = "default", ...props }: PaginationLinkProps) => {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      variant={variant}
      className={cn("gap-1.5 pr-2.5 rounded-lg", variantStyle.normal, className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
};
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Pagination with gold theme
 */
const GoldPagination = (props: PaginationProps) => <Pagination variant="gold" {...props} />;

/**
 * Pagination with emerald theme
 */
const EmeraldPagination = (props: PaginationProps) => <Pagination variant="emerald" {...props} />;

/**
 * Compact pagination for mobile
 */
const CompactPagination = (props: PaginationProps) => (
  <Pagination className="gap-0" {...props}>
    <PaginationContent className="gap-0.5">{props.children}</PaginationContent>
  </Pagination>
);

/**
 * Pagination with page size selector
 */
interface PaginationWithSizeProps extends PaginationProps {
  pageSize: number;
  pageSizeOptions?: number[];
  onPageSizeChange: (size: number) => void;
}

const PaginationWithSize = ({
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  children,
  ...props
}: PaginationWithSizeProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-mint/30 bg-white/50 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>entries</span>
      </div>
      <Pagination {...props}>{children}</Pagination>
    </div>
  );
};
PaginationWithSize.displayName = "PaginationWithSize";

/**
 * Pagination info text
 */
const PaginationInfo = ({
  start,
  end,
  total,
  className,
}: {
  start: number;
  end: number;
  total: number;
  className?: string;
}) => (
  <div className={cn("text-sm text-muted-foreground", className)}>
    Showing {start} to {end} of {total} entries
  </div>
);
PaginationInfo.displayName = "PaginationInfo";

// ============================================================================
// Default Export
// ============================================================================

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  GoldPagination,
  EmeraldPagination,
  CompactPagination,
  PaginationWithSize,
  PaginationInfo,
};
