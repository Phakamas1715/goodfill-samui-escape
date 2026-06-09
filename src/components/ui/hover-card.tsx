import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface HoverCardContentProps extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> {
  variant?: "default" | "gold" | "emerald";
  size?: "sm" | "default" | "lg";
  showArrow?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_STYLES = {
  sm: "w-48 p-3 text-xs",
  default: "w-64 p-4 text-sm",
  lg: "w-80 p-5 text-base",
} as const;

const VARIANT_STYLES = {
  default: {
    content: "bg-white/95 backdrop-blur-sm border border-mint/30 shadow-xl",
    arrow: "fill-white/95",
  },
  gold: {
    content: "bg-gradient-to-br from-gold/10 to-gold-soft/20 border border-gold/40 shadow-xl",
    arrow: "fill-gold/20",
  },
  emerald: {
    content: "bg-gradient-to-br from-emerald/10 to-emerald-deep/20 border border-emerald/40 shadow-xl",
    arrow: "fill-emerald/20",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<React.ElementRef<typeof HoverCardPrimitive.Content>, HoverCardContentProps>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      variant = "default",
      size = "default",
      showArrow = false,
      children,
      ...props
    },
    ref,
  ) => {
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES[size];

    return (
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 rounded-xl shadow-md outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          "origin-(--radix-hover-card-content-transform-origin)",
          variantStyle.content,
          sizeStyle,
          className,
        )}
        {...props}
      >
        {showArrow && <HoverCardPrimitive.Arrow className={cn("h-2 w-3", variantStyle.arrow)} />}
        {children}
      </HoverCardPrimitive.Content>
    );
  },
);
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Hover card with gold theme for premium content
 */
const GoldHoverCard = (props: HoverCardContentProps) => <HoverCardContent variant="gold" {...props} />;

/**
 * Hover card with emerald theme for wellness content
 */
const EmeraldHoverCard = (props: HoverCardContentProps) => <HoverCardContent variant="emerald" {...props} />;

/**
 * Hover card with image preview
 */
interface HoverCardImageProps extends HoverCardContentProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description?: string;
}

const HoverCardImage = React.forwardRef<React.ElementRef<typeof HoverCardPrimitive.Content>, HoverCardImageProps>(
  ({ imageSrc, imageAlt, title, description, children, ...props }, ref) => (
    <HoverCardContent ref={ref} {...props}>
      <div className="space-y-3">
        <div className="aspect-video overflow-hidden rounded-lg">
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div>
          <h4 className="font-semibold text-navy">{title}</h4>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
    </HoverCardContent>
  ),
);
HoverCardImage.displayName = "HoverCardImage";

/**
 * Hover card with stats
 */
interface HoverCardStatsProps extends HoverCardContentProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

const HoverCardStats = React.forwardRef<React.ElementRef<typeof HoverCardPrimitive.Content>, HoverCardStatsProps>(
  ({ title, value, change, icon, ...props }, ref) => (
    <HoverCardContent ref={ref} {...props}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{title}</span>
          {icon && <span className="text-gold">{icon}</span>}
        </div>
        <div className="text-2xl font-bold text-navy">{value}</div>
        {change !== undefined && (
          <div className={cn("text-xs font-medium", change >= 0 ? "text-emerald" : "text-coral")}>
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% from last week
          </div>
        )}
      </div>
    </HoverCardContent>
  ),
);
HoverCardStats.displayName = "HoverCardStats";

/**
 * Hover card with user profile
 */
interface HoverCardProfileProps extends HoverCardContentProps {
  name: string;
  role?: string;
  avatar?: string;
  bio?: string;
}

const HoverCardProfile = React.forwardRef<React.ElementRef<typeof HoverCardPrimitive.Content>, HoverCardProfileProps>(
  ({ name, role, avatar, bio, ...props }, ref) => (
    <HoverCardContent ref={ref} {...props}>
      <div className="flex items-start gap-3">
        {avatar && (
          <div className="size-12 overflow-hidden rounded-full">
            <img src={avatar} alt={name} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-navy">{name}</h4>
          {role && <p className="text-xs text-muted-foreground">{role}</p>}
          {bio && <p className="mt-2 text-xs text-navy/70">{bio}</p>}
        </div>
      </div>
    </HoverCardContent>
  ),
);
HoverCardProfile.displayName = "HoverCardProfile";

// ============================================================================
// Default Export
// ============================================================================

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  GoldHoverCard,
  EmeraldHoverCard,
  HoverCardImage,
  HoverCardStats,
  HoverCardProfile,
};
