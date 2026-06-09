import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  asChild?: boolean;
  hover?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const cardVariants = cva("rounded-2xl transition-all duration-300", {
  variants: {
    variant: {
      default: "bg-card border border-border shadow-sm",
      glass: "bg-white/80 backdrop-blur-md border border-white/30 shadow-lg",
      elevated: "bg-card border border-border shadow-md hover:shadow-xl",
      ghost: "bg-transparent border-0 shadow-none",
      gradient: "bg-gradient-to-br from-card to-cream border border-mint/20 shadow-md",
      gold: "bg-gradient-to-br from-gold/5 to-gold-soft/10 border border-gold/20 shadow-md",
      emerald: "bg-gradient-to-br from-emerald/5 to-emerald-deep/10 border border-emerald/20 shadow-md",
    },
    padding: {
      none: "p-0",
      sm: "p-3",
      default: "p-5 md:p-6",
      lg: "p-6 md:p-8",
      xl: "p-8 md:p-10",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "default",
  },
});

// ============================================================================
// Components
// ============================================================================

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, padding }),
        hover && "hover:scale-[1.02] hover:shadow-xl cursor-pointer",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, divider = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", divider && "border-b border-border pb-4 mb-4", className)}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "font-display font-semibold leading-tight tracking-tight text-navy",
        "text-xl md:text-2xl",
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-muted-foreground leading-relaxed", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-3 mt-4 pt-4 border-t border-border", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Card with image at the top
 */
interface ImageCardProps extends CardProps {
  imageSrc: string;
  imageAlt?: string;
  imageClassName?: string;
}

const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>(
  ({ imageSrc, imageAlt = "", imageClassName, children, ...props }, ref) => (
    <Card ref={ref} {...props}>
      <div className="overflow-hidden rounded-t-2xl">
        <img
          src={imageSrc}
          alt={imageAlt}
          className={cn("w-full h-48 object-cover transition-transform duration-500 hover:scale-105", imageClassName)}
        />
      </div>
      {children}
    </Card>
  ),
);
ImageCard.displayName = "ImageCard";

/**
 * Card with hover gradient effect
 */
const HoverCard = React.forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "relative overflow-hidden transition-all duration-500 hover:shadow-xl",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-gold/0 before:via-gold/5 before:to-gold/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
      className,
    )}
    {...props}
  >
    {children}
  </Card>
));
HoverCard.displayName = "HoverCard";

/**
 * Stats card for dashboard metrics
 */
interface StatsCardProps extends CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; direction: "up" | "down" };
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(({ title, value, icon, trend, ...props }, ref) => (
  <Card ref={ref} variant="glass" padding="lg" className="text-center" {...props}>
    {icon && <div className="text-gold mb-3 flex justify-center">{icon}</div>}
    <div className="font-display text-3xl md:text-4xl font-bold text-navy">{value}</div>
    <div className="text-xs text-muted-foreground mt-1">{title}</div>
    {trend && (
      <div className={cn("text-[10px] mt-2 font-medium", trend.direction === "up" ? "text-emerald" : "text-coral")}>
        {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
      </div>
    )}
  </Card>
));
StatsCard.displayName = "StatsCard";

/**
 * Card grid layout
 */
const CardGrid = ({
  children,
  className,
  cols = 3,
}: {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
}) => {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[cols];

  return <div className={cn("grid gap-5", colClasses, className)}>{children}</div>;
};

// ============================================================================
// Default Export
// ============================================================================

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  ImageCard,
  HoverCard,
  StatsCard,
  CardGrid,
  cardVariants,
};
