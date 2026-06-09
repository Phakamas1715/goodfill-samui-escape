"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>, VariantProps<typeof sheetVariants> {
  variant?: "default" | "gold" | "emerald";
  showClose?: boolean;
  onClose?: () => void;
  size?: "sm" | "default" | "lg" | "full";
}

// ============================================================================
// Constants
// ============================================================================

const sheetVariants = cva(
  "fixed z-50 gap-4 shadow-xl transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        right:
          "inset-y-0 right-0 h-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
      },
      size: {
        sm: "w-64",
        default: "w-80",
        lg: "w-96",
        full: "w-full",
      },
    },
    defaultVariants: {
      side: "right",
      size: "default",
    },
  },
);

const SIZE_STYLES = {
  sm: "max-w-[320px]",
  default: "max-w-[400px]",
  lg: "max-w-[500px]",
  full: "max-w-full",
} as const;

const VARIANT_STYLES = {
  default: {
    content: "bg-white/95 backdrop-blur-sm border-mint/30",
    close: "hover:bg-navy/10 hover:text-navy",
  },
  gold: {
    content: "bg-gradient-to-br from-gold/10 to-gold-soft/20 border-gold/40",
    close: "hover:bg-gold/20 hover:text-emerald-deep",
  },
  emerald: {
    content: "bg-gradient-to-br from-emerald/10 to-emerald-deep/20 border-emerald/40",
    close: "hover:bg-emerald/20 hover:text-ivory",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-300",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  (
    { side = "right", size = "default", variant = "default", showClose = true, onClose, className, children, ...props },
    ref,
  ) => {
    const variantStyle = VARIANT_STYLES[variant];

    return (
      <SheetPortal>
        <SheetOverlay onClick={onClose} />
        <SheetPrimitive.Content
          ref={ref}
          className={cn(sheetVariants({ side, size }), "rounded-xl backdrop-blur-sm", variantStyle.content, className)}
          {...props}
        >
          {showClose && (
            <SheetPrimitive.Close
              onClick={onClose}
              className={cn(
                "absolute right-4 top-4 rounded-full p-1.5 transition-all duration-200",
                "opacity-70 hover:opacity-100",
                "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2",
                "disabled:pointer-events-none",
                variantStyle.close,
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
          )}
          {children}
        </SheetPrimitive.Content>
      </SheetPortal>
    );
  },
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("font-display text-xl font-semibold leading-tight tracking-tight text-navy", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Gold sheet for premium content
 */
const GoldSheet = (props: SheetContentProps) => <SheetContent variant="gold" {...props} />;

/**
 * Emerald sheet for wellness content
 */
const EmeraldSheet = (props: SheetContentProps) => <SheetContent variant="emerald" {...props} />;

/**
 * Sheet with icon in header
 */
interface SheetWithIconProps extends SheetContentProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

const SheetWithIcon = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetWithIconProps>(
  ({ icon, title, description, children, ...props }, ref) => (
    <SheetContent ref={ref} {...props}>
      <SheetHeader>
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex size-10 items-center justify-center rounded-full bg-gold/10 text-gold">{icon}</div>
          )}
          <SheetTitle>{title}</SheetTitle>
        </div>
        {description && <SheetDescription>{description}</SheetDescription>}
      </SheetHeader>
      {children}
    </SheetContent>
  ),
);
SheetWithIcon.displayName = "SheetWithIcon";

// ============================================================================
// Default Export
// ============================================================================

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  GoldSheet,
  EmeraldSheet,
  SheetWithIcon,
};
