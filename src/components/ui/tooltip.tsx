"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Sparkles, Info, HelpCircle } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  variant?: "default" | "gold" | "emerald" | "dark" | "coral";
  size?: "xs" | "sm" | "md" | "lg";
  showArrow?: boolean;
}

interface TooltipWithIconProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  variant?: "default" | "gold" | "emerald" | "dark" | "coral";
  delayDuration?: number;
  icon?: React.ReactNode;
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: {
    container: "bg-navy text-ivory border border-mint/20 shadow-md",
    arrow: "fill-navy",
  },
  gold: {
    container:
      "bg-gradient-to-r from-gold to-gold-soft text-emerald-deep font-medium border border-gold-soft/30 shadow-lg",
    arrow: "fill-gold",
  },
  emerald: {
    container: "bg-gradient-to-r from-emerald to-emerald-deep text-ivory border border-emerald-soft/30 shadow-lg",
    arrow: "fill-emerald",
  },
  dark: {
    container: "bg-black/90 backdrop-blur-sm text-ivory border border-white/10 shadow-xl",
    arrow: "fill-black/90",
  },
  coral: {
    container: "bg-gradient-to-r from-coral to-coral-soft text-white border border-coral-soft/30 shadow-lg",
    arrow: "fill-coral",
  },
};

const SIZE_STYLES = {
  xs: "px-1.5 py-0.5 text-[9px] rounded-md",
  sm: "px-2 py-1 text-[10px] rounded-lg",
  md: "px-3 py-1.5 text-xs rounded-lg",
  lg: "px-4 py-2 text-sm rounded-xl",
};

// ============================================================================
// Components
// ============================================================================

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, TooltipContentProps>(
  ({ className, sideOffset = 4, variant = "default", size = "md", showArrow = true, children, ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES[size];

    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            "z-50 overflow-hidden shadow-xl",
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
          {showArrow && <TooltipPrimitive.Arrow className={cn("size-3", variantStyle.arrow)} />}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    );
  },
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// ============================================================================
// Helper Components
// ============================================================================

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
  icon,
}: TooltipWithIconProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-help items-center gap-1">
            {icon && <span className="text-gold">{icon}</span>}
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent side={side} variant={variant} size="sm" showArrow>
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
  variant = "default",
}: {
  text: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  variant?: "default" | "gold" | "emerald" | "dark" | "coral";
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
        <TooltipContent side={side} variant={variant}>
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

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
  size = "sm",
}: {
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  variant?: "default" | "gold" | "emerald" | "dark" | "coral";
  size?: "xs" | "sm" | "md" | "lg";
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
            <Info className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} variant={variant} size={size} showArrow>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Help icon with tooltip (question mark)
 */
export function HelpTooltip({
  content,
  side = "top",
  variant = "default",
}: {
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  variant?: "default" | "gold" | "emerald" | "dark" | "coral";
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-gold transition-colors focus:outline-none"
            aria-label="Help"
          >
            <HelpCircle className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} variant={variant} size="sm" showArrow>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Premium tooltip with sparkle icon
 */
export function PremiumTooltip({
  content,
  side = "top",
}: {
  content: string;
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <TooltipWithIcon content={content} side={side} variant="gold" icon={<Sparkles className="size-3" />}>
      <Sparkles className="size-4 text-gold" />
    </TooltipWithIcon>
  );
}

// ============================================================================
// Default Export
// ============================================================================

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipWithIcon,
  TruncatedTooltip,
  InfoTooltip,
  HelpTooltip,
  PremiumTooltip,
};
