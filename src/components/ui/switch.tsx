import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  variant?: "default" | "gold" | "emerald";
  size?: "sm" | "default" | "lg";
  label?: string;
  description?: string;
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_STYLES = {
  sm: {
    root: "h-4 w-7",
    thumb: "h-3 w-3 data-[state=checked]:translate-x-3",
  },
  default: {
    root: "h-5 w-9",
    thumb: "h-4 w-4 data-[state=checked]:translate-x-4",
  },
  lg: {
    root: "h-6 w-11",
    thumb: "h-5 w-5 data-[state=checked]:translate-x-5",
  },
} as const;

const VARIANT_STYLES = {
  default: {
    checked: "bg-navy",
    unchecked: "bg-navy/20",
    thumb: "bg-white",
  },
  gold: {
    checked: "bg-gold",
    unchecked: "bg-gold/20",
    thumb: "bg-white",
  },
  emerald: {
    checked: "bg-emerald",
    unchecked: "bg-emerald/20",
    thumb: "bg-white",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, variant = "default", size = "default", label, description, id, ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES[size];
    const switchId = id || React.useId();

    const switchElement = (
      <SwitchPrimitives.Root
        id={switchId}
        className={cn(
          "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
          sizeStyle.root,
          variantStyle.checked,
          className,
        )}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform duration-200",
            sizeStyle.thumb,
            variantStyle.thumb,
          )}
        />
      </SwitchPrimitives.Root>
    );

    if (!label && !description) {
      return switchElement;
    }

    return (
      <div className="flex items-start gap-3">
        {switchElement}
        <div className="flex flex-col">
          {label && (
            <label htmlFor={switchId} className="text-sm font-medium cursor-pointer transition-colors hover:opacity-80">
              {label}
            </label>
          )}
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
    );
  },
);
Switch.displayName = SwitchPrimitives.Root.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Gold switch for premium features
 */
const GoldSwitch = (props: SwitchProps) => <Switch variant="gold" {...props} />;

/**
 * Emerald switch for wellness features
 */
const EmeraldSwitch = (props: SwitchProps) => <Switch variant="emerald" {...props} />;

/**
 * Switch with confirmation dialog
 */
interface ConfirmSwitchProps extends SwitchProps {
  onConfirmChange: (checked: boolean) => void;
  confirmTitle?: string;
  confirmDescription?: string;
}

const ConfirmSwitch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, ConfirmSwitchProps>(
  ({ onConfirmChange, confirmTitle, confirmDescription, ...props }, ref) => {
    const handleChange = async (checked: boolean) => {
      // You can integrate with a confirmation dialog here
      onConfirmChange(checked);
    };

    return <Switch ref={ref} onCheckedChange={handleChange} {...props} />;
  },
);
ConfirmSwitch.displayName = "ConfirmSwitch";

/**
 * Switch group for multiple options
 */
interface SwitchGroupProps {
  items: Array<{
    id: string;
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }>;
  variant?: SwitchProps["variant"];
  size?: SwitchProps["size"];
}

const SwitchGroup = ({ items, variant, size }: SwitchGroupProps) => {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Switch
          key={item.id}
          id={item.id}
          label={item.label}
          description={item.description}
          checked={item.checked}
          onCheckedChange={item.onChange}
          variant={variant}
          size={size}
        />
      ))}
    </div>
  );
};
SwitchGroup.displayName = "SwitchGroup";

// ============================================================================
// Default Export
// ============================================================================

export { Switch, GoldSwitch, EmeraldSwitch, ConfirmSwitch, SwitchGroup };
