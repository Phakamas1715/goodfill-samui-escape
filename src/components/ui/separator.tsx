import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  variant?: "default" | "gold" | "emerald" | "coral";
  dashed?: boolean;
  label?: React.ReactNode;
  labelPosition?: "left" | "center" | "right";
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: "bg-navy/20",
  gold: "bg-gold/40",
  emerald: "bg-emerald/30",
  coral: "bg-coral/30",
} as const;

// ============================================================================
// Components
// ============================================================================

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      variant = "default",
      dashed = false,
      label,
      labelPosition = "center",
      ...props
    },
    ref,
  ) => {
    const variantStyle = VARIANT_STYLES[variant];
    const baseStyle = cn(
      "shrink-0 transition-all duration-200",
      orientation === "horizontal" ? "w-full" : "h-full",
      dashed && orientation === "horizontal" ? "bg-none border-t-2 border-dashed" : "",
      dashed && orientation === "vertical" ? "bg-none border-l-2 border-dashed" : "",
      !dashed && variantStyle,
      dashed &&
        `border-${variant === "gold" ? "gold" : variant === "emerald" ? "emerald" : "navy"}/30`,
      orientation === "horizontal" ? (dashed ? "border-t" : "h-px") : dashed ? "border-l" : "w-px",
      className,
    );

    // If no label, render simple separator
    if (!label) {
      return (
        <SeparatorPrimitive.Root
          ref={ref}
          decorative={decorative}
          orientation={orientation}
          className={baseStyle}
          {...props}
        />
      );
    }

    // With label
    const labelClasses = cn(
      "text-xs font-medium whitespace-nowrap",
      variant === "gold"
        ? "text-gold"
        : variant === "emerald"
          ? "text-emerald"
          : "text-muted-foreground",
    );

    const getPositionClasses = () => {
      if (orientation === "vertical") {
        return "flex-col items-center";
      }
      switch (labelPosition) {
        case "left":
          return "justify-start";
        case "right":
          return "justify-end";
        default:
          return "justify-center";
      }
    };

    const getLineClasses = (position: "left" | "right") => {
      if (orientation === "vertical") {
        return "flex-1 w-px";
      }
      return cn("flex-1", dashed ? "border-t-2 border-dashed" : "h-px", variantStyle);
    };

    return (
      <div
        className={cn(
          "flex items-center gap-4",
          orientation === "vertical" ? "flex-col h-full" : "w-full",
          getPositionClasses(),
        )}
      >
        {labelPosition !== "right" && <div className={getLineClasses("left")} />}
        <span className={labelClasses}>{label}</span>
        {labelPosition !== "left" && <div className={getLineClasses("right")} />}
      </div>
    );
  },
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Gold separator for premium sections
 */
const GoldSeparator = (props: SeparatorProps) => <Separator variant="gold" {...props} />;

/**
 * Emerald separator for wellness sections
 */
const EmeraldSeparator = (props: SeparatorProps) => <Separator variant="emerald" {...props} />;

/**
 * Dashed separator for subtle separation
 */
const DashedSeparator = (props: SeparatorProps) => <Separator dashed {...props} />;

/**
 * Separator with text in the middle
 */
const TextSeparator = ({ text, ...props }: SeparatorProps & { text: string }) => (
  <Separator label={text} labelPosition="center" {...props} />
);

/**
 * Vertical separator for side-by-side content
 */
const VerticalSeparator = (props: SeparatorProps) => (
  <Separator orientation="vertical" {...props} />
);

// ============================================================================
// Default Export
// ============================================================================

export {
  Separator,
  GoldSeparator,
  EmeraldSeparator,
  DashedSeparator,
  TextSeparator,
  VerticalSeparator,
};
