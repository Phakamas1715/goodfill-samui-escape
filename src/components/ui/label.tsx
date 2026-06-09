"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, VariantProps<typeof labelVariants> {
  required?: boolean;
  optional?: boolean;
  icon?: React.ReactNode;
}

// ============================================================================
// Constants
// ============================================================================

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "text-navy",
        gold: "text-gold",
        emerald: "text-emerald",
        muted: "text-muted-foreground",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
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

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, variant, size, required, optional, icon, children, ...props }, ref) => {
    return (
      <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ variant, size }), className)} {...props}>
        <div className="flex items-center gap-1.5">
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {required && <span className="text-coral text-xs font-medium ml-0.5">*</span>}
          {optional && <span className="text-muted-foreground text-xs font-normal ml-1">(optional)</span>}
        </div>
      </LabelPrimitive.Root>
    );
  },
);
Label.displayName = LabelPrimitive.Root.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Gold label for premium sections
 */
const GoldLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>((props, ref) => (
  <Label ref={ref} variant="gold" {...props} />
));
GoldLabel.displayName = "GoldLabel";

/**
 * Emerald label for wellness sections
 */
const EmeraldLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>((props, ref) => (
  <Label ref={ref} variant="emerald" {...props} />
));
EmeraldLabel.displayName = "EmeraldLabel";

/**
 * Label with helper text below
 */
interface LabelWithHelperProps extends LabelProps {
  helper?: string;
  helperPosition?: "top" | "bottom";
}

const LabelWithHelper = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelWithHelperProps>(
  ({ helper, helperPosition = "bottom", children, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <Label ref={ref} {...props}>
          {children}
        </Label>
        {helperPosition === "top" && helper && <p className="text-xs text-muted-foreground">{helper}</p>}
        {helperPosition === "bottom" && helper && <p className="text-xs text-muted-foreground mt-1">{helper}</p>}
      </div>
    );
  },
);
LabelWithHelper.displayName = "LabelWithHelper";

/**
 * Required label indicator
 */
const RequiredLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>((props, ref) => (
  <Label ref={ref} required {...props} />
));
RequiredLabel.displayName = "RequiredLabel";

/**
 * Optional label indicator
 */
const OptionalLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>((props, ref) => (
  <Label ref={ref} optional {...props} />
));
OptionalLabel.displayName = "OptionalLabel";

// ============================================================================
// Default Export
// ============================================================================

export { Label, GoldLabel, EmeraldLabel, LabelWithHelper, RequiredLabel, OptionalLabel, labelVariants };
