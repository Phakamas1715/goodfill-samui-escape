import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Default variants
        default:
          "border-transparent bg-navy text-ivory shadow-sm hover:bg-navy/80",
        secondary:
          "border-transparent bg-cream text-navy shadow-sm hover:bg-cream/80",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-accent/10",

        // Status variants
        success:
          "border-transparent bg-emerald-100 text-emerald-800 shadow-sm hover:bg-emerald-200",
        warning:
          "border-transparent bg-amber-100 text-amber-800 shadow-sm hover:bg-amber-200",
        error:
          "border-transparent bg-coral-100 text-coral-800 shadow-sm hover:bg-coral-200",
        info:
          "border-transparent bg-sky-100 text-sky-800 shadow-sm hover:bg-sky-200",

        // Premium variants
        gold:
          "border-transparent bg-gradient-to-r from-gold to-gold-soft text-emerald-deep shadow-md hover:shadow-lg",
        emerald:
          "border-transparent bg-gradient-to-r from-emerald to-emerald-deep text-ivory shadow-md hover:shadow-lg",

        // Size variants
        dot: "w-2 h-2 p-0 rounded-full",
        pill: "rounded-full px-3 py-1 text-xs",
        large: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// ============================================================================
// Components
// ============================================================================

/**
 * Badge component for status, categories, and labels
 *
 * @example
 * // Basic usage
 * <Badge>New</Badge>
 *
 * @example
 * // Status badge
 * <Badge variant="success">Completed</Badge>
 *
 * @example
 * // Premium badge
 * <Badge variant="gold">Premium</Badge>
 */
function Badge({ className, variant, children, asChild, ...props }: BadgeProps) {
  const Component = asChild ? "span" : "div";
  return (
    <Component className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </Component>
  );
}

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Count badge for notifications and numbers
 *
 * @example
 * <CountBadge count={5} />
 */
interface CountBadgeProps extends Omit<BadgeProps, "children"> {
  count: number;
  max?: number;
  showZero?: boolean;
}

function CountBadge({ count, max = 99, showZero = false, ...props }: CountBadgeProps) {
  if (!showZero && count === 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <Badge
      variant="default"
      className={cn(
        "min-w-5 h-5 px-1 rounded-full text-[10px] font-medium flex items-center justify-center",
        props.className,
      )}
      {...props}
    >
      {displayCount}
    </Badge>
  );
}

/**
 * Status badge with built-in dot indicator
 *
 * @example
 * <StatusBadge status="active">Active</StatusBadge>
 */
interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: "active" | "inactive" | "pending" | "completed" | "cancelled";
  showDot?: boolean;
}

const STATUS_VARIANTS = {
  active: "success",
  inactive: "secondary",
  pending: "warning",
  completed: "emerald",
  cancelled: "error",
} as const;

const STATUS_DOT_COLORS = {
  active: "bg-emerald-500",
  inactive: "bg-gray-400",
  pending: "bg-amber-500",
  completed: "bg-emerald-600",
  cancelled: "bg-coral-500",
} as const;

function StatusBadge({ status, showDot = true, children, ...props }: StatusBadgeProps) {
  const variant = STATUS_VARIANTS[status] as BadgeProps["variant"];

  return (
    <Badge variant={variant} className="gap-1.5" {...props}>
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT_COLORS[status])} />
      )}
      {children || status}
    </Badge>
  );
}

/**
 * Category badge with icon support
 *
 * @example
 * <CategoryBadge icon={<Sparkles />}>Wellness</CategoryBadge>
 */
interface CategoryBadgeProps extends BadgeProps {
  icon?: React.ReactNode;
}

function CategoryBadge({ icon, children, ...props }: CategoryBadgeProps) {
  return (
    <Badge variant="outline" className="gap-1.5" {...props}>
      {icon && <span className="size-3">{icon}</span>}
      {children}
    </Badge>
  );
}

/**
 * Badge group for displaying multiple badges
 *
 * @example
 * <BadgeGroup>
 *   <Badge>Tag 1</Badge>
 *   <Badge>Tag 2</Badge>
 *   <Badge>Tag 3</Badge>
 * </BadgeGroup>
 */
function BadgeGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {children}
    </Grid>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function BadgeSkeleton() {
  return <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />;
}

// ============================================================================
// Default Export
// ============================================================================

export {
  Badge,
  badgeVariants,
  CountBadge,
  StatusBadge,
  CategoryBadge,
  BadgeGroup,
  BadgeSkeleton,
  STATUS_VARIANTS,
  STATUS_DOT_COLORS,
};