"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  variant?: "default" | "gold" | "emerald" | "dark";
  size?: "sm" | "md" | "lg";
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: {
    container: "bg-navy text-ivory border border-mint/20",
    arrow: "fill-navy",
  },
  gold: {
    container: "bg-gradient-to-r from-gold to-gold-soft text-emerald-deep font-medium border border-gold-soft/30",
    arrow: "fill-gold",
  },
  emerald: {
    container: "bg-gradient-to-r from-emerald to-emerald-deep text-ivory border border-emerald-soft/30",
    arrow: "fill-emerald",
  },
  dark: {
    container: "bg-black/90 backdrop-blur-sm text-ivory border border-white/10",
    arrow: "fill-black/90",
  },
};

const SIZE_STYLES = {
  sm: "px-2 py-1 text-[10px]",
  md: "px-3 py-1.5 text-xs",
  lg: "px-4 py-2 text-sm",
};

// ============================================================================
// Components
// ============================================================================

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, TooltipContentProps>(
  ({ className, sideOffset = 4, variant = "default", size = "md", children, ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES[size];

    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            "z-50 overflow-hidden rounded-lg shadow-lg",
            "animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2",
            "origin-(--radix-tooltip-content-transform-origin)",
            variantStyle.container,
            sizeStyle,
            className,
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className={cn("size-3", variantStyle.arrow)} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    );
  },
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// ============================================================================
// Additional Helper Components
// ============================================================================

interface TooltipWithIconProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  variant?: "default" | "gold" | "emerald" | "dark";
  delayDuration?: number;
}

/**
 * Tooltip with icon wrapper for common use cases
 *
 * @example
 * <TooltipWithIcon content="This is helpful info" variant="gold">
 *   <InfoIcon />
 * </TooltipWithIcon>
 */
export function TooltipWithIcon({
  content,
  children,
  side = "top",
  variant = "default",
  delayDuration = 200,
}: TooltipWithIconProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-help">{children}</span>
        </TooltipTrigger>
        <TooltipContent side={side} variant={variant} size="sm">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Tooltip that shows on hover for truncated text
 *
 * @example
 * <TruncatedTooltip text="This is a very long text that will be truncated">
 *   <div className="truncate max-w-[200px]">This is a very long text that will be truncated</div>
 * </TruncatedTooltip>
 */
export function TruncatedTooltip({
  text,
  children,
  side = "top",
}: {
  text: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}) {
  const [isTruncated, setIsTruncated] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (element) {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  }, []);

  if (!isTruncated) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div ref={ref} className="cursor-help">
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent side={side}>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============================================================================
// Info Icon Helper
// ============================================================================

/**
 * Info icon with tooltip
 *
 * @example
 * <InfoTooltip content="This setting controls notifications" />
 */
export function InfoTooltip({
  content,
  side = "top",
  variant = "default",
}: {
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  variant?: "default" | "gold" | "emerald" | "dark";
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-gold transition-colors focus:outline-none"
            aria-label="More information"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} variant={variant} size="sm">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============================================================================
// Default Export
// ============================================================================

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
