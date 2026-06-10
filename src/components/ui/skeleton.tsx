import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gold" | "emerald" | "glass";
  size?: "sm" | "default" | "lg";
  shape?: "circle" | "rounded" | "square";
  animated?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: "bg-navy/10",
  gold: "bg-gold/20",
  emerald: "bg-emerald/20",
  glass: "bg-white/20 backdrop-blur-sm",
} as const;

const SIZE_STYLES = {
  sm: "h-4 w-8",
  default: "h-6 w-12",
  lg: "h-8 w-16",
} as const;

const SHAPE_STYLES = {
  circle: "rounded-full",
  rounded: "rounded-lg",
  square: "rounded-none",
} as const;

// ============================================================================
// Components
// ============================================================================

function Skeleton({
  className,
  variant = "default",
  size = "default",
  shape = "rounded",
  animated = true,
  ...props
}: SkeletonProps) {
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];
  const shapeStyle = SHAPE_STYLES[shape];

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        shapeStyle,
        variantStyle,
        sizeStyle,
        !animated && "animate-none",
        animated && "animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Text skeleton (multiple lines)
 */
interface TextSkeletonProps extends Omit<SkeletonProps, "size" | "shape"> {
  lines?: number;
  lineHeight?: string;
  lastLineWidth?: string;
}

function TextSkeleton({
  lines = 3,
  lineHeight = "h-4",
  lastLineWidth = "w-2/3",
  variant = "default",
  className,
  ...props
}: TextSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant={variant}
          className={cn(lineHeight, i === lines - 1 && lastLineWidth, "w-full")}
        />
      ))}
    </div>
  );
}

/**
 * Avatar skeleton
 */
function AvatarSkeleton({ size = "default", ...props }: SkeletonProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return <Skeleton shape="circle" size={size} className={sizeClasses[size]} {...props} />;
}

/**
 * Card skeleton
 */
function CardSkeleton({ variant = "default", className, ...props }: SkeletonProps) {
  return (
    <div className={cn("rounded-xl border border-mint/30 bg-white/50 p-4", className)} {...props}>
      <Skeleton variant={variant} className="h-32 w-full rounded-lg" />
      <div className="mt-4 space-y-2">
        <Skeleton variant={variant} className="h-4 w-3/4" />
        <Skeleton variant={variant} className="h-4 w-1/2" />
        <Skeleton variant={variant} className="h-4 w-full" />
      </div>
    </div>
  );
}

/**
 * List skeleton (for sidebar, menu items)
 */
function ListSkeleton({
  count = 5,
  variant = "default",
  className,
  ...props
}: SkeletonProps & { count?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant={variant} className="h-8 w-full" />
      ))}
    </div>
  );
}

/**
 * Table skeleton
 */
function TableSkeleton({
  rows = 5,
  columns = 4,
  variant = "default",
  className,
  ...props
}: SkeletonProps & { rows?: number; columns?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {/* Header */}
      <div className="flex gap-2 pb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant={variant} className="h-6 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-2">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} variant={variant} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Product card skeleton
 */
function ProductSkeleton({ variant = "default", className, ...props }: SkeletonProps) {
  return (
    <div className={cn("rounded-xl border border-mint/30 bg-white/50 p-4", className)} {...props}>
      <Skeleton variant={variant} className="aspect-square w-full rounded-lg" />
      <div className="mt-3 space-y-2">
        <Skeleton variant={variant} className="h-4 w-3/4" />
        <Skeleton variant={variant} className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton variant={variant} className="h-5 w-16" />
          <Skeleton variant={variant} className="h-8 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Export
// ============================================================================

export {
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
  CardSkeleton,
  ListSkeleton,
  TableSkeleton,
  ProductSkeleton,
};
