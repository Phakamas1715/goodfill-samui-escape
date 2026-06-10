"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface DialogContentProps extends React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  variant?: "default" | "gold" | "emerald";
  size?: "sm" | "default" | "lg" | "xl" | "full";
  showClose?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_STYLES = {
  sm: "max-w-md",
  default: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[90vw] max-h-[90vh]",
} as const;

const VARIANT_STYLES = {
  default: {
    content: "bg-white/95 backdrop-blur-sm border border-mint/30",
    close: "hover:bg-navy/10 hover:text-navy",
    overlay: "bg-black/60 backdrop-blur-sm",
  },
  gold: {
    content: "bg-gradient-to-br from-gold/10 to-gold-soft/20 border border-gold/40",
    close: "hover:bg-gold/20 hover:text-emerald-deep",
    overlay: "bg-black/60 backdrop-blur-sm",
  },
  emerald: {
    content: "bg-gradient-to-br from-emerald/10 to-emerald-deep/20 border border-emerald/40",
    close: "hover:bg-emerald/20 hover:text-ivory",
    overlay: "bg-black/60 backdrop-blur-sm",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const variant = "default";
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 transition-all duration-300",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        variantStyle.overlay,
        className,
      )}
      {...props}
    />
  );
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    { className, children, variant = "default", size = "default", showClose = true, ...props },
    ref,
  ) => {
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES[size];

    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl p-6 shadow-2xl duration-200",
            sizeStyle,
            variantStyle.content,
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            className,
          )}
          {...props}
        >
          {children}
          {showClose && (
            <DialogPrimitive.Close
              className={cn(
                "absolute right-4 top-4 rounded-full p-1 transition-all duration-200",
                "opacity-70 hover:opacity-100",
                "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2",
                "disabled:pointer-events-none",
                variantStyle.close,
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  },
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3", className)}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-display text-xl font-semibold leading-tight tracking-tight text-navy",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Dialog with gold theme for premium content
 */
const GoldDialog = (props: React.ComponentProps<typeof DialogPrimitive.Root>) => (
  <Dialog {...props} />
);

/**
 * Dialog with emerald theme for wellness content
 */
const EmeraldDialog = (props: React.ComponentProps<typeof DialogPrimitive.Root>) => (
  <Dialog {...props} />
);

/**
 * Full-screen dialog
 */
const FullScreenDialog = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, ...props }, ref) => (
  <DialogContent
    ref={ref}
    size="full"
    className={cn("h-[90vh] w-[90vw] max-w-none", className)}
    {...props}
  />
));
FullScreenDialog.displayName = "FullScreenDialog";

/**
 * Dialog with custom icon in header
 */
interface DialogWithIconProps extends DialogContentProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

const DialogWithIcon = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogWithIconProps
>(({ icon, title, description, children, ...props }, ref) => (
  <DialogContent ref={ref} {...props}>
    <DialogHeader>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex size-10 items-center justify-center rounded-full bg-gold/10 text-gold">
            {icon}
          </div>
        )}
        <DialogTitle>{title}</DialogTitle>
      </div>
      {description && <DialogDescription>{description}</DialogDescription>}
    </DialogHeader>
    {children}
  </DialogContent>
));
DialogWithIcon.displayName = "DialogWithIcon";

// ============================================================================
// Default Export
// ============================================================================

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  GoldDialog,
  EmeraldDialog,
  FullScreenDialog,
  DialogWithIcon,
};
