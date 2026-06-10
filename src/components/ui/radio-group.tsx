import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  variant?: "default" | "gold" | "emerald" | "coral";
  size?: "sm" | "default" | "lg";
  orientation?: "horizontal" | "vertical";
}

interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
> {
  variant?: "default" | "gold" | "emerald" | "coral";
  size?: "sm" | "default" | "lg";
  label?: string;
  description?: string;
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_STYLES = {
  sm: {
    radio: "h-3 w-3",
    indicator: "h-2.5 w-2.5",
    label: "text-sm",
    description: "text-xs",
  },
  default: {
    radio: "h-4 w-4",
    indicator: "h-3.5 w-3.5",
    label: "text-base",
    description: "text-xs",
  },
  lg: {
    radio: "h-5 w-5",
    indicator: "h-4 w-4",
    label: "text-lg",
    description: "text-sm",
  },
} as const;

const VARIANT_STYLES = {
  default: {
    radio: "border-navy text-navy data-[state=checked]:border-navy",
    indicator: "fill-navy",
    label: "text-navy",
  },
  gold: {
    radio: "border-gold text-gold data-[state=checked]:border-gold",
    indicator: "fill-gold",
    label: "text-gold",
  },
  emerald: {
    radio: "border-emerald text-emerald data-[state=checked]:border-emerald",
    indicator: "fill-emerald",
    label: "text-emerald",
  },
  coral: {
    radio: "border-coral text-coral data-[state=checked]:border-coral",
    indicator: "fill-coral",
    label: "text-coral",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, orientation = "vertical", variant = "default", ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(
        "flex gap-3",
        orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, variant = "default", size = "default", label, description, id, ...props }, ref) => {
  const sizeStyle = SIZE_STYLES[size];
  const variantStyle = VARIANT_STYLES[variant];
  const generatedId = React.useId();
  const radioId = id || generatedId;

  const radioElement = (
    <RadioGroupPrimitive.Item
      ref={ref}
      id={radioId}
      className={cn(
        "aspect-square rounded-full border-2 shadow-sm transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:scale-95",
        sizeStyle.radio,
        variantStyle.radio,
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className={cn("fill-current", sizeStyle.indicator, variantStyle.indicator)} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );

  if (!label && !description) {
    return radioElement;
  }

  return (
    <div className="flex items-start gap-3">
      {radioElement}
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={radioId}
            className={cn(
              "font-medium cursor-pointer transition-colors hover:opacity-80",
              sizeStyle.label,
              variantStyle.label,
            )}
          >
            {label}
          </label>
        )}
        {description && (
          <p className={cn("text-muted-foreground", sizeStyle.description)}>{description}</p>
        )}
      </div>
    </div>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Radio group with gold theme
 */
const GoldRadioGroup = (props: RadioGroupProps) => <RadioGroup variant="gold" {...props} />;

/**
 * Radio group with emerald theme
 */
const EmeraldRadioGroup = (props: RadioGroupProps) => <RadioGroup variant="emerald" {...props} />;

/**
 * Radio card - styled card that acts as a radio button
 */
interface RadioCardProps extends RadioGroupItemProps {
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioCardProps
>(({ icon, children, label, description, className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200",
        "hover:shadow-md",
        "data-[state=checked]:border-gold data-[state=checked]:bg-gold/5",
        className,
      )}
      {...props}
    >
      <div className="flex gap-3">
        {icon && <div className="shrink-0 text-gold">{icon}</div>}
        <div className="flex-1">
          {label && <div className="font-medium text-navy">{label}</div>}
          {description && <div className="text-sm text-muted-foreground">{description}</div>}
          {children}
        </div>
        <div className="shrink-0">
          <div
            className={cn(
              "h-4 w-4 rounded-full border-2 transition-all",
              "data-[state=checked]:border-gold data-[state=checked]:bg-gold",
            )}
          />
        </div>
      </div>
    </RadioGroupPrimitive.Item>
  );
});
RadioCard.displayName = "RadioCard";

// ============================================================================
// Default Export
// ============================================================================

export { RadioGroup, RadioGroupItem, GoldRadioGroup, EmeraldRadioGroup, RadioCard };
