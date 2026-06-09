import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>, VariantProps<typeof toggleVariants> {
  icon?: React.ReactNode;
  label?: string;
  isLoading?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-transparent hover:bg-navy/10 hover:text-navy",
          "data-[state=on]:bg-navy data-[state=on]:text-white data-[state=on]:shadow-md",
        ].join(" "),
        outline: [
          "border-2 border-navy/20 bg-transparent shadow-sm",
          "hover:bg-navy/5 hover:border-navy/30",
          "data-[state=on]:border-navy data-[state=on]:bg-navy data-[state=on]:text-white",
        ].join(" "),
        gold: [
          "bg-transparent hover:bg-gold/10 hover:text-emerald-deep",
          "data-[state=on]:bg-gold data-[state=on]:text-emerald-deep data-[state=on]:shadow-md",
        ].join(" "),
        emerald: [
          "bg-transparent hover:bg-emerald/10 hover:text-ivory",
          "data-[state=on]:bg-emerald data-[state=on]:text-white data-[state=on]:shadow-md",
        ].join(" "),
        glass: [
          "bg-white/10 backdrop-blur-sm hover:bg-white/20",
          "data-[state=on]:bg-white/30 data-[state=on]:text-white data-[state=on]:shadow-md",
        ].join(" "),
      },
      size: {
        sm: "h-8 px-1.5 min-w-8 text-xs rounded-md",
        default: "h-9 px-2.5 min-w-9 text-sm rounded-lg",
        lg: "h-10 px-3 min-w-10 text-base rounded-lg",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-8 w-8 p-0 rounded-md",
        "icon-lg": "h-10 w-10 p-0 rounded-lg",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// ============================================================================
// Components
// ============================================================================

const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  ({ className, variant, size, fullWidth, icon, label, isLoading, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || isLoading;

    return (
      <TogglePrimitive.Root
        ref={ref}
        className={cn(toggleVariants({ variant, size, fullWidth }), isLoading && "cursor-wait", className)}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <svg className="size-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && icon && <span className="shrink-0">{icon}</span>}
        {label && <span>{label}</span>}
        {!icon && !label && children}
      </TogglePrimitive.Root>
    );
  },
);
Toggle.displayName = TogglePrimitive.Root.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Gold toggle for premium features
 */
const GoldToggle = (props: ToggleProps) => <Toggle variant="gold" {...props} />;

/**
 * Emerald toggle for wellness features
 */
const EmeraldToggle = (props: ToggleProps) => <Toggle variant="emerald" {...props} />;

/**
 * Glass toggle for hero sections
 */
const GlassToggle = (props: ToggleProps) => <Toggle variant="glass" {...props} />;

/**
 * Icon toggle button
 */
interface IconToggleProps extends Omit<ToggleProps, "icon" | "label" | "children"> {
  icon: React.ReactNode;
  tooltip?: string;
}

const IconToggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, IconToggleProps>(
  ({ icon, tooltip, ...props }, ref) => (
    <Toggle ref={ref} size="icon" {...props}>
      {icon}
      {tooltip && <span className="sr-only">{tooltip}</span>}
    </Toggle>
  ),
);
IconToggle.displayName = "IconToggle";

/**
 * Toggle group wrapper
 */
interface ToggleGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const ToggleGroup = ({ children, className, orientation = "horizontal" }: ToggleGroupProps) => (
  <div className={cn("flex gap-1", orientation === "vertical" ? "flex-col" : "flex-row", className)}>{children}</div>
);
ToggleGroup.displayName = "ToggleGroup";

// ============================================================================
// Default Export
// ============================================================================

export { Toggle, toggleVariants, GoldToggle, EmeraldToggle, GlassToggle, IconToggle, ToggleGroup };
