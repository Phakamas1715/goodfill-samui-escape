"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

// ============================================================================
// Types
// ============================================================================

type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & {
  variant?: "default" | "gold" | "emerald";
  size?: "default" | "sm" | "lg";
  orientation?: "horizontal" | "vertical";
};

type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & {
  variant?: "default" | "gold" | "emerald";
  size?: "default" | "sm" | "lg";
  icon?: React.ReactNode;
  label?: string;
};

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: {
    item: "data-[state=on]:bg-navy data-[state=on]:text-white",
  },
  gold: {
    item: "data-[state=on]:bg-gold data-[state=on]:text-emerald-deep",
  },
  emerald: {
    item: "data-[state=on]:bg-emerald data-[state=on]:text-white",
  },
} as const;

// ============================================================================
// Context
// ============================================================================

const ToggleGroupContext = React.createContext<{
  variant?: "default" | "gold" | "emerald";
  size?: "default" | "sm" | "lg";
  orientation?: "horizontal" | "vertical";
}>({
  size: "default",
  variant: "default",
  orientation: "horizontal",
});

// ============================================================================
// Components
// ============================================================================

const ToggleGroup = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, ToggleGroupProps>(
  ({ className, variant = "default", size = "default", orientation = "horizontal", children, ...props }, ref) => {
    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-1 rounded-xl p-1",
          orientation === "vertical" && "flex-col",
          className,
        )}
        {...props}
      >
        <ToggleGroupContext.Provider value={{ variant, size, orientation }}>{children}</ToggleGroupContext.Provider>
      </ToggleGroupPrimitive.Root>
    );
  },
);
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Item>, ToggleGroupItemProps>(
  ({ className, children, variant, size, icon, label, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);
    const variantStyle = VARIANT_STYLES[context.variant as keyof typeof VARIANT_STYLES] || VARIANT_STYLES.default;

    return (
      <ToggleGroupPrimitive.Item
        ref={ref}
        className={cn(
          toggleVariants({
            variant: "default",
            size: (context.size || size) as "default" | "sm" | "lg",
          }),
          "transition-all duration-200",
          "data-[state=on]:shadow-md",
          variantStyle.item,
          className,
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {label && <span>{label}</span>}
        {!icon && !label && children}
      </ToggleGroupPrimitive.Item>
    );
  },
);
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Gold toggle group for premium selections
 */
const GoldToggleGroup = (props: ToggleGroupProps) => <ToggleGroup variant="gold" {...props} />;

/**
 * Emerald toggle group for wellness selections
 */
const EmeraldToggleGroup = (props: ToggleGroupProps) => <ToggleGroup variant="emerald" {...props} />;

/**
 * Toggle group with icons only
 */
interface IconToggleGroupProps extends ToggleGroupProps {
  items: Array<{
    value: string;
    icon: React.ReactNode;
    label?: string;
  }>;
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

const IconToggleGroup = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, IconToggleGroupProps>(
  ({ items, value, onValueChange, variant, size, ...props }, ref) => {
    return (
      <ToggleGroup
        ref={ref}
        type="multiple"
        value={value}
        onValueChange={onValueChange}
        variant={variant}
        size={size}
        {...props}
      >
        {items.map((item) => (
          <ToggleGroupItem key={item.value} value={item.value} icon={item.icon}>
            {item.label && <span className="sr-only">{item.label}</span>}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  },
);
IconToggleGroup.displayName = "IconToggleGroup";

/**
 * Toggle group with labels
 */
interface LabelToggleGroupProps extends ToggleGroupProps {
  items: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

const LabelToggleGroup = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, LabelToggleGroupProps>(
  ({ items, value, onValueChange, variant, size, ...props }, ref) => {
    return (
      <ToggleGroup
        ref={ref}
        type="multiple"
        value={value}
        onValueChange={onValueChange}
        variant={variant}
        size={size}
        {...props}
      >
        {items.map((item) => (
          <ToggleGroupItem key={item.value} value={item.value} icon={item.icon} label={item.label} />
        ))}
      </ToggleGroup>
    );
  },
);
LabelToggleGroup.displayName = "LabelToggleGroup";

// ============================================================================
// Default Export
// ============================================================================

export { ToggleGroup, ToggleGroupItem, GoldToggleGroup, EmeraldToggleGroup, IconToggleGroup, LabelToggleGroup };
