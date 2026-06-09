import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: "default" | "gold" | "emerald";
  size?: "sm" | "default" | "lg";
}

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  variant?: "default" | "gold" | "emerald";
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: {
    list: "bg-navy/10",
    trigger: "data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-md",
    inactive: "text-navy/60 hover:text-navy",
  },
  gold: {
    list: "bg-gold/10",
    trigger: "data-[state=active]:bg-gold data-[state=active]:text-emerald-deep data-[state=active]:shadow-md",
    inactive: "text-gold/60 hover:text-gold",
  },
  emerald: {
    list: "bg-emerald/10",
    trigger: "data-[state=active]:bg-emerald data-[state=active]:text-ivory data-[state=active]:shadow-md",
    inactive: "text-emerald/60 hover:text-emerald",
  },
} as const;

const SIZE_STYLES = {
  sm: {
    list: "h-8",
    trigger: "px-2.5 py-1 text-xs",
  },
  default: {
    list: "h-10",
    trigger: "px-4 py-2 text-sm",
  },
  lg: {
    list: "h-12",
    trigger: "px-6 py-3 text-base",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES[size];

    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl p-1",
          variantStyle.list,
          sizeStyle.list,
          className,
        )}
        {...props}
      />
    );
  },
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES.default;

    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200",
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
          "cursor-pointer",
          sizeStyle.trigger,
          variantStyle.trigger,
          variantStyle.inactive,
          className,
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.Trigger>
    );
  },
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
      "animate-in fade-in-0 slide-in-from-top-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Gold tabs for premium sections
 */
const GoldTabs = (props: React.ComponentProps<typeof TabsPrimitive.Root>) => <Tabs {...props} />;

/**
 * Emerald tabs for wellness sections
 */
const EmeraldTabs = (props: React.ComponentProps<typeof TabsPrimitive.Root>) => <Tabs {...props} />;

/**
 * Underlined tabs (alternative style)
 */
const UnderlinedTabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];

    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn("inline-flex h-10 items-center justify-center gap-6 border-b", variantStyle.list, className)}
        {...props}
      />
    );
  },
);
UnderlinedTabs.displayName = "UnderlinedTabs";

/**
 * Underlined tab trigger
 */
const UnderlinedTabTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];

    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "relative -mb-px inline-flex items-center justify-center whitespace-nowrap px-1 py-2 text-sm font-medium transition-all duration-200",
          "cursor-pointer",
          variantStyle.inactive,
          "data-[state=active]:border-b-2 data-[state=active]:border-gold data-[state=active]:text-gold",
          className,
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.Trigger>
    );
  },
);
UnderlinedTabTrigger.displayName = "UnderlinedTabTrigger";

/**
 * Vertical tabs
 */
const VerticalTabs = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    children: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex gap-6", className)} {...props}>
    {children}
  </div>
));
VerticalTabs.displayName = "VerticalTabs";

const VerticalTabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];

    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn("flex w-48 flex-col gap-1 rounded-xl p-1", variantStyle.list, className)}
        {...props}
      />
    );
  },
);
VerticalTabsList.displayName = "VerticalTabsList";

const VerticalTabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];

    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex items-center justify-start rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
          "cursor-pointer",
          variantStyle.inactive,
          "data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-md",
          className,
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.Trigger>
    );
  },
);
VerticalTabsTrigger.displayName = "VerticalTabsTrigger";

// ============================================================================
// Default Export
// ============================================================================

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  GoldTabs,
  EmeraldTabs,
  UnderlinedTabs,
  UnderlinedTabTrigger,
  VerticalTabs,
  VerticalTabsList,
  VerticalTabsTrigger,
};
