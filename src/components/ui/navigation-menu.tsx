import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface NavigationMenuProps extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> {
  variant?: "default" | "gold" | "emerald";
}

interface NavigationMenuTriggerProps extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> {
  icon?: React.ReactNode;
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: {
    trigger: "bg-white/80 hover:bg-navy/5 hover:text-navy data-[state=open]:bg-navy/5 data-[state=open]:text-navy",
    content: "bg-white/95 backdrop-blur-sm border border-mint/30 shadow-lg",
    viewport: "bg-white/95 backdrop-blur-sm border border-mint/30",
  },
  gold: {
    trigger:
      "bg-gold/5 hover:bg-gold/10 hover:text-emerald-deep data-[state=open]:bg-gold/10 data-[state=open]:text-emerald-deep",
    content: "bg-gradient-to-br from-gold/10 to-gold-soft/20 border border-gold/40 shadow-lg",
    viewport: "bg-gradient-to-br from-gold/10 to-gold-soft/20 border border-gold/40",
  },
  emerald: {
    trigger:
      "bg-emerald/5 hover:bg-emerald/10 hover:text-ivory data-[state=open]:bg-emerald/10 data-[state=open]:text-ivory",
    content: "bg-gradient-to-br from-emerald/10 to-emerald-deep/20 border border-emerald/40 shadow-lg",
    viewport: "bg-gradient-to-br from-emerald/10 to-emerald-deep/20 border border-emerald/40",
  },
} as const;

const navigationMenuTriggerStyle = cva(
  cn(
    "group inline-flex h-10 w-max items-center justify-center rounded-xl px-5 py-2 text-sm font-medium cursor-pointer transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ),
);

// ============================================================================
// Components
// ============================================================================

const NavigationMenu = React.forwardRef<React.ElementRef<typeof NavigationMenuPrimitive.Root>, NavigationMenuProps>(
  ({ className, children, variant = "default", ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];

    return (
      <NavigationMenuPrimitive.Root
        ref={ref}
        className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
        {...props}
      >
        {children}
        <NavigationMenuViewport variant={variant} />
      </NavigationMenuPrimitive.Root>
    );
  },
);
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  NavigationMenuTriggerProps
>(({ className, children, icon, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
    <ChevronDown
      className="relative ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content> & {
    variant?: "default" | "gold" | "emerald";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={cn(
        "left-0 top-0 w-full rounded-xl p-2",
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
        "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
        "data-[motion=from-end]:slide-in-from-right-52",
        "data-[motion=from-start]:slide-in-from-left-52",
        "data-[motion=to-end]:slide-out-to-right-52",
        "data-[motion=to-start]:slide-out-to-left-52",
        "md:absolute md:w-auto",
        variantStyle.content,
        className,
      )}
      {...props}
    />
  );
});
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport> & {
    variant?: "default" | "gold" | "emerald";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <div className={cn("absolute left-0 top-full flex justify-center")}>
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "origin-top-center relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-xl shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90",
          "md:w-[var(--radix-navigation-menu-viewport-width)]",
          variantStyle.viewport,
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-2 items-end justify-center overflow-hidden",
      "data-[state=visible]:animate-in data-[state=hidden]:animate-out",
      "data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-gold/50 shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Navigation menu with gold theme
 */
const GoldNavigationMenu = (props: NavigationMenuProps) => <NavigationMenu variant="gold" {...props} />;

/**
 * Navigation menu with emerald theme
 */
const EmeraldNavigationMenu = (props: NavigationMenuProps) => <NavigationMenu variant="emerald" {...props} />;

// ============================================================================
// Default Export
// ============================================================================

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  GoldNavigationMenu,
  EmeraldNavigationMenu,
};
