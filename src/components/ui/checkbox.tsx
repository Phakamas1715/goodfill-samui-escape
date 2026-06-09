import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  variant?: "default" | "gold" | "emerald" | "coral";
  size?: "sm" | "default" | "lg";
  label?: string;
  description?: string;
  error?: string;
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_STYLES = {
  sm: "h-3.5 w-3.5 [&_svg]:h-3 [&_svg]:w-3",
  default: "h-4 w-4 [&_svg]:h-4 [&_svg]:w-4",
  lg: "h-5 w-5 [&_svg]:h-5 [&_svg]:w-5",
} as const;

const VARIANT_STYLES = {
  default: {
    root: "border-navy data-[state=checked]:bg-navy data-[state=checked]:text-ivory",
    label: "text-navy",
  },
  gold: {
    root: "border-gold data-[state=checked]:bg-gold data-[state=checked]:text-emerald-deep",
    label: "text-gold",
  },
  emerald: {
    root: "border-emerald data-[state=checked]:bg-emerald data-[state=checked]:text-ivory",
    label: "text-emerald",
  },
  coral: {
    root: "border-coral data-[state=checked]:bg-coral data-[state=checked]:text-ivory",
    label: "text-coral",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, variant = "default", size = "default", label, description, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES[size];

    const checkboxElement = (
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        className={cn(
          "grid place-content-center shrink-0 rounded-md border shadow-sm cursor-pointer",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:scale-95",
          variantStyle.root,
          sizeStyle,
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className={cn("grid place-content-center text-current")}>
          <Check className="h-full w-full stroke-[3]" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );

    // If no label, return just the checkbox
    if (!label && !description) {
      return checkboxElement;
    }

    // Return checkbox with label
    return (
      <div className="flex items-start gap-3">
        {checkboxElement}
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                "text-sm font-medium cursor-pointer transition-colors",
                "hover:text-opacity-80",
                variantStyle.label,
                props.disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              {label}
            </label>
          )}
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          {error && <p className="text-xs text-coral mt-1">{error}</p>}
        </div>
      </div>
    );
  },
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Checkbox group for multiple options
 */
interface CheckboxGroupProps {
  options: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  values: string[];
  onChange: (values: string[]) => void;
  variant?: CheckboxProps["variant"];
  size?: CheckboxProps["size"];
  disabled?: boolean;
}

function CheckboxGroup({ options, values, onChange, variant, size, disabled }: CheckboxGroupProps) {
  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...values, value]);
    } else {
      onChange(values.filter((v) => v !== value));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <Checkbox
          key={option.value}
          id={option.value}
          label={option.label}
          description={option.description}
          checked={values.includes(option.value)}
          onCheckedChange={(checked) => handleChange(option.value, checked as boolean)}
          variant={variant}
          size={size}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

/**
 * Checkbox card - styled card that acts as a checkbox
 */
interface CheckboxCardProps extends CheckboxProps {
  title?: string;
  icon?: React.ReactNode;
}

function CheckboxCard({ title, icon, children, className, ...props }: CheckboxCardProps) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer rounded-xl border-2 p-4 transition-all duration-200",
        "hover:shadow-md",
        "data-[state=checked]:border-gold data-[state=checked]:bg-gold/5",
        props.checked && "border-gold bg-gold/5",
        className,
      )}
    >
      <div className="flex flex-1 gap-3">
        {icon && <div className="shrink-0 text-gold">{icon}</div>}
        <div className="flex-1">
          {title && <div className="font-medium text-navy">{title}</div>}
          {children}
        </div>
      </div>
      <Checkbox {...props} className="absolute right-4 top-4" size="lg" />
    </label>
  );
}

// ============================================================================
// Default Export
// ============================================================================

export { Checkbox, CheckboxGroup, CheckboxCard, SIZE_STYLES, VARIANT_STYLES };
