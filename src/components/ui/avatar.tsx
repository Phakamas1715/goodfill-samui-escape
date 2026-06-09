"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "default" | "gold" | "emerald" | "coral";
  status?: "online" | "offline" | "away" | "busy";
}

interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  className?: string;
  spacing?: number;
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_MAP = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-14 w-14 text-lg",
  "2xl": "h-16 w-16 text-xl",
} as const;

const VARIANT_RING_MAP = {
  default: "ring-2 ring-white ring-offset-2 ring-offset-background",
  gold: "ring-2 ring-gold ring-offset-2 ring-offset-background",
  emerald: "ring-2 ring-emerald ring-offset-2 ring-offset-background",
  coral: "ring-2 ring-coral ring-offset-2 ring-offset-background",
} as const;

const STATUS_COLOR_MAP = {
  online: "bg-emerald-500",
  offline: "bg-gray-400",
  away: "bg-amber-500",
  busy: "bg-coral-500",
} as const;

// ============================================================================
// Main Components
// ============================================================================

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, size = "md", variant = "default", status, children, ...props }, ref) => (
    <div className="relative inline-block">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-muted",
          SIZE_MAP[size],
          VARIANT_RING_MAP[variant],
          className,
        )}
        {...props}
      >
        {children}
      </AvatarPrimitive.Root>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
            "h-2.5 w-2.5 md:h-3 md:w-3",
            STATUS_COLOR_MAP[status],
          )}
        >
          <span className="sr-only">{status}</span>
        </span>
      )}
    </div>
  ),
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full object-cover", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, children, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-emerald/20 to-gold/20 font-medium text-navy",
      className,
    )}
    {...props}
  >
    {children}
  </AvatarPrimitive.Fallback>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Avatar group that stacks avatars with optional overlap and max display
 *
 * @example
 * <AvatarGroup max={3}>
 *   <Avatar><AvatarImage src="/user1.jpg" /></Avatar>
 *   <Avatar><AvatarImage src="/user2.jpg" /></Avatar>
 *   <Avatar><AvatarImage src="/user3.jpg" /></Avatar>
 *   <Avatar><AvatarImage src="/user4.jpg" /></Avatar>
 * </AvatarGroup>
 */
function AvatarGroup({ children, max = 5, className, spacing = -2 }: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children);
  const visibleAvatars = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div className={cn("flex items-center", className)} style={{ marginLeft: `${spacing}px` }}>
      {visibleAvatars.map((child, index) => (
        <div
          key={index}
          className="ring-2 ring-background rounded-full transition-transform hover:scale-110 hover:z-10"
          style={{ marginLeft: index === 0 ? 0 : `${spacing * -1}px` }}
        >
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-muted font-medium text-xs ring-2 ring-background",
            SIZE_MAP.md,
          )}
          style={{ marginLeft: `${spacing * -1}px` }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

/**
 * Avatar with built-in initials generation
 *
 * @example
 * <AvatarWithInitials name="John Doe" src="/avatar.jpg" />
 */
interface AvatarWithInitialsProps extends AvatarProps {
  name?: string;
  src?: string;
  fallbackClassName?: string;
}

function AvatarWithInitials({ name, src, fallbackClassName, ...props }: AvatarWithInitialsProps) {
  const getInitials = (name?: string): string => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <Avatar {...props}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback className={fallbackClassName}>{initials}</AvatarFallback>
    </Avatar>
  );
}

/**
 * Avatar with loading skeleton
 */
function AvatarSkeleton({ size = "md" }: { size?: keyof typeof SIZE_MAP }) {
  return <div className={cn("animate-pulse rounded-full bg-muted", SIZE_MAP[size])} />;
}

// ============================================================================
// Default Export
// ============================================================================

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarWithInitials,
  AvatarSkeleton,
  SIZE_MAP,
  STATUS_COLOR_MAP,
};
