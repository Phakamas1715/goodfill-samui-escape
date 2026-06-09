import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { X, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root> & {
  shouldScaleBackground?: boolean;
  variant?: "default" | "gold" | "emerald";
  size?: "sm" | "default" | "lg" | "full";
};

type DrawerContentProps = React.ComponentProps<typeof DrawerPrimitive.Content> & {
  variant?: "default" | "gold" | "emerald";
  size?: "sm" | "default" | "lg" | "full";
  showClose?: boolean;
  onClose?: () => void;
};

// ============================================================================
// Constants
// ============================================================================

const SIZE_STYLES = {
  sm: "max-h-[40vh]",
  default: "max-h-[60vh]",
  lg: "max-h-[80vh]",
  full: "max-h-[95vh]",
} as const;

const VARIANT_STYLES = {
  default: {
    content: "bg-white/95 backdrop-blur-sm border-t-mint/30",
    handle: "bg-muted/50",
    close: "hover:bg-navy/10 hover:text-navy",
  },
  gold: {
    content: "bg-gradient-to-br from-gold/10 to-gold-soft/20 border-t-gold/40",
    handle: "bg-gold/30",
    close: "hover:bg-gold/20 hover:text-emerald-deep",
  },
  emerald: {
    content: "bg-gradient-to-br from-emerald/10 to-emerald-deep/20 border-t-emerald/40",
    handle: "bg-emerald/30",
    close: "hover:bg-emerald/20 hover:text-ivory",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Drawer = ({ shouldScaleBackground = true, variant = "default", ...props }: DrawerProps) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-300",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Content>, DrawerContentProps>(
  ({ className, children, variant = "default", size = "default", showClose = true, onClose, ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES[size as keyof typeof SIZE_STYLES];

    return (
      <DrawerPortal>
        <DrawerOverlay onClick={onClose} />
        <DrawerPrimitive.Content
          ref={ref}
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex h-auto flex-col rounded-t-2xl border shadow-xl transition-all duration-300",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            sizeStyle,
            variantStyle.content,
            className,
          )}
          {...props}
        >
          <div className="relative">
            <div className={cn("mx-auto mt-3 h-1 w-12 rounded-full", variantStyle.handle)} />
            {showClose && (
              <button
                onClick={onClose}
                className={cn(
                  "absolute right-4 top-2 rounded-full p-2 transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2",
                  variantStyle.close,
                )}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            )}
          </div>
          {children}
        </DrawerPrimitive.Content>
      </DrawerPortal>
    );
  },
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4 pt-0", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("font-display text-xl font-semibold leading-tight tracking-tight text-navy", className)}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Drawer with gold variant for premium content
 */
const GoldDrawer = (props: DrawerProps) => <Drawer variant="gold" {...props} />;

/**
 * Drawer with emerald variant for wellness content
 */
const EmeraldDrawer = (props: DrawerProps) => <Drawer variant="emerald" {...props} />;

/**
 * Drawer with custom header icon
 */
interface DrawerWithIconProps extends DrawerContentProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

const DrawerWithIcon = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Content>, DrawerWithIconProps>(
  ({ icon, title, description, children, ...props }, ref) => (
    <DrawerContent ref={ref} {...props}>
      <DrawerHeader>
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex size-10 items-center justify-center rounded-full bg-gold/10 text-gold">{icon}</div>
          )}
          <DrawerTitle>{title}</DrawerTitle>
        </div>
        {description && <DrawerDescription>{description}</DrawerDescription>}
      </DrawerHeader>
      {children}
    </DrawerContent>
  ),
);
DrawerWithIcon.displayName = "DrawerWithIcon";

/**
 * Bottom sheet drawer for mobile
 */
const BottomSheet = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Content>, DrawerContentProps>(
  ({ className, ...props }, ref) => (
    <DrawerContent ref={ref} size="full" className={cn("rounded-t-2xl", className)} {...props} />
  ),
);
BottomSheet.displayName = "BottomSheet";

// ============================================================================
// Default Export
// ============================================================================

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  GoldDrawer,
  EmeraldDrawer,
  DrawerWithIcon,
  BottomSheet,
};
