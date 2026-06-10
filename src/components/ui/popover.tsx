import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { X, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface PopoverContentProps extends React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
> {
  variant?: "default" | "gold" | "emerald";
  size?: "sm" | "default" | "lg";
  showClose?: boolean;
  onClose?: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_STYLES = {
  sm: "w-48 p-3",
  default: "w-72 p-4",
  lg: "w-96 p-5",
} as const;

const VARIANT_STYLES = {
  default: {
    content: "bg-white/95 backdrop-blur-sm border border-mint/30 shadow-xl",
  },
  gold: {
    content: "bg-gradient-to-br from-gold/10 to-gold-soft/20 border border-gold/40 shadow-xl",
  },
  emerald: {
    content:
      "bg-gradient-to-br from-emerald/10 to-emerald-deep/20 border border-emerald/40 shadow-xl",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 8,
      variant = "default",
      size = "default",
      showClose = false,
      onClose,
      children,
      ...props
    },
    ref,
  ) => {
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES[size];

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 rounded-xl shadow-lg outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2",
            "origin-(--radix-popover-content-transform-origin)",
            variantStyle.content,
            sizeStyle,
            className,
          )}
          {...props}
        >
          {showClose && (
            <button
              onClick={onClose}
              className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Close</span>
            </button>
          )}
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  },
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Popover with gold theme
 */
const GoldPopover = (props: PopoverContentProps) => <PopoverContent variant="gold" {...props} />;

/**
 * Popover with emerald theme
 */
const EmeraldPopover = (props: PopoverContentProps) => (
  <PopoverContent variant="emerald" {...props} />
);

/**
 * Popover with custom trigger that shows on hover
 */
interface HoverPopoverProps extends PopoverContentProps {
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const HoverPopover = ({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  ...props
}: HoverPopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = onOpenChange || setUncontrolledOpen;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="inline-block cursor-pointer">{trigger}</div>
      </PopoverTrigger>
      <PopoverContent {...props}>{children}</PopoverContent>
    </Popover>
  );
};
HoverPopover.displayName = "HoverPopover";

/**
 * Popover with header
 */
interface PopoverWithHeaderProps extends PopoverContentProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

const PopoverWithHeader = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverWithHeaderProps
>(({ title, description, icon, children, ...props }, ref) => (
  <PopoverContent ref={ref} {...props}>
    <div className="mb-3 space-y-1">
      <div className="flex items-center gap-2">
        {icon && <div className="text-gold">{icon}</div>}
        <h3 className="font-semibold text-navy">{title}</h3>
      </div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
    {children}
  </PopoverContent>
));
PopoverWithHeader.displayName = "PopoverWithHeader";

// ============================================================================
// Default Export
// ============================================================================

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  GoldPopover,
  EmeraldPopover,
  HoverPopover,
  PopoverWithHeader,
};
