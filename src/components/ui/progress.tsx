"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "default" | "gold" | "emerald" | "coral";
  size?: "sm" | "default" | "lg";
  showValue?: boolean;
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_STYLES = {
  sm: "h-1",
  default: "h-2",
  lg: "h-3",
} as const;

const VARIANT_STYLES = {
  default: {
    track: "bg-navy/20",
    indicator: "bg-navy",
  },
  gold: {
    track: "bg-gold/20",
    indicator: "bg-gradient-to-r from-gold to-gold-soft",
  },
  emerald: {
    track: "bg-emerald/20",
    indicator: "bg-gradient-to-r from-emerald to-emerald-deep",
  },
  coral: {
    track: "bg-coral/20",
    indicator: "bg-gradient-to-r from-coral to-coral-soft",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  (
    {
      className,
      value = 0,
      variant = "default",
      size = "default",
      showValue = false,
      showPercentage = false,
      label,
      animated = true,
      ...props
    },
    ref,
  ) => {
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES[size];
    const percentage = Math.min(100, Math.max(0, value ?? 0));

    return (
      <div className="w-full space-y-2">
        {(label || showValue || showPercentage) && (
          <div className="flex justify-between text-sm">
            {label && <span className="text-muted-foreground">{label}</span>}
            {(showValue || showPercentage) && (
              <span className="font-medium text-navy">{showValue ? value : `${Math.round(percentage)}%`}</span>
            )}
          </div>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          className={cn("relative w-full overflow-hidden rounded-full", sizeStyle, variantStyle.track, className)}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              "h-full w-full flex-1 transition-all",
              variantStyle.indicator,
              animated && "duration-500 ease-out",
            )}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </ProgressPrimitive.Root>
      </div>
    );
  },
);
Progress.displayName = ProgressPrimitive.Root.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Circular progress indicator
 */
interface CircularProgressProps extends Omit<ProgressProps, "size"> {
  size?: number;
  strokeWidth?: number;
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ value = 0, variant = "default", size = 48, strokeWidth = 4, animated = true, className, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, value ?? 0));
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    const variantStyle = VARIANT_STYLES[variant];

    return (
      <div ref={ref} className={cn("relative inline-flex items-center justify-center", className)} {...props}>
        <svg
          className="h-full w-full -rotate-90 transform"
          style={{ width: size, height: size }}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            className={variantStyle.track}
            strokeWidth={strokeWidth}
            fill="none"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className={cn("transition-all", variantStyle.indicator, animated && "duration-500 ease-out")}
            strokeWidth={strokeWidth}
            fill="none"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-navy">
          {Math.round(percentage)}%
        </div>
      </div>
    );
  },
);
CircularProgress.displayName = "CircularProgress";

/**
 * Progress with steps
 */
interface StepsProgressProps extends ProgressProps {
  steps: number;
  currentStep: number;
}

const StepsProgress = React.forwardRef<HTMLDivElement, StepsProgressProps>(
  ({ steps, currentStep, variant = "default", ...props }, ref) => {
    const progress = (currentStep / steps) * 100;

    return (
      <div className="space-y-2">
        <Progress ref={ref} value={progress} variant={variant} {...props} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Step {currentStep} of {steps}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>
    );
  },
);
StepsProgress.displayName = "StepsProgress";

/**
 * Multiple progress bars for comparison
 */
interface MultiProgressProps {
  items: Array<{
    label: string;
    value: number;
    variant?: "default" | "gold" | "emerald" | "coral";
  }>;
  className?: string;
}

const MultiProgress = React.forwardRef<HTMLDivElement, MultiProgressProps>(({ items, className }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <Progress
          key={index}
          label={item.label}
          value={item.value}
          variant={item.variant || "default"}
          showPercentage
        />
      ))}
    </div>
  );
});
MultiProgress.displayName = "MultiProgress";

// ============================================================================
// Default Export
// ============================================================================

export { Progress, CircularProgress, StepsProgress, MultiProgress };
