"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface CollapsibleProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root> {
  variant?: "default" | "gold" | "emerald";
  size?: "sm" | "default" | "lg";
}

interface CollapsibleTriggerProps extends React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.CollapsibleTrigger
> {
  showIcon?: boolean;
  iconPosition?: "left" | "right";
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: {
    trigger: "hover:bg-navy/5 data-[state=open]:text-navy data-[state=open]:font-semibold",
    icon: "text-navy",
    content: "border-navy/10",
  },
  gold: {
    trigger: "hover:bg-gold/5 data-[state=open]:text-gold data-[state=open]:font-semibold",
    icon: "text-gold",
    content: "border-gold/20",
  },
  emerald: {
    trigger: "hover:bg-emerald/5 data-[state=open]:text-emerald data-[state=open]:font-semibold",
    icon: "text-emerald",
    content: "border-emerald/20",
  },
} as const;

const SIZE_STYLES = {
  sm: {
    trigger: "p-2 text-sm",
    content: "pl-6 pb-2 text-xs",
  },
  default: {
    trigger: "p-3 text-base",
    content: "pl-8 pb-3 text-sm",
  },
  lg: {
    trigger: "p-4 text-lg",
    content: "pl-10 pb-4 text-base",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Collapsible = React.forwardRef<React.ElementRef<typeof CollapsiblePrimitive.Root>, CollapsibleProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];
    const sizeStyle = SIZE_STYLES[size];

    return (
      <CollapsiblePrimitive.Root
        ref={ref}
        className={cn("w-full rounded-xl border transition-all duration-200", variantStyle.content, className)}
        {...props}
      >
        {children}
      </CollapsiblePrimitive.Root>
    );
  },
);
Collapsible.displayName = CollapsiblePrimitive.Root.displayName;

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  CollapsibleTriggerProps
>(({ className, children, showIcon = true, iconPosition = "left", ...props }, ref) => {
  const [open, setOpen] = React.useState(false);

  // Get context from parent (simplified - in real app use context)
  // This is a simplified version; for full implementation, you'd use React Context

  return (
    <CollapsiblePrimitive.CollapsibleTrigger asChild>
      <button
        ref={ref}
        className={cn(
          "flex w-full items-center justify-between rounded-xl transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
          "hover:bg-navy/5",
          className,
        )}
        {...props}
      >
        {iconPosition === "left" && showIcon && (
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              "data-[state=open]:rotate-90",
              VARIANT_STYLES.default.icon,
            )}
          />
        )}
        <span className="flex-1 text-left font-medium">{children}</span>
        {iconPosition === "right" && showIcon && (
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              "data-[state=open]:rotate-180",
              VARIANT_STYLES.default.icon,
            )}
          />
        )}
      </button>
    </CollapsiblePrimitive.CollapsibleTrigger>
  );
});
CollapsibleTrigger.displayName = CollapsiblePrimitive.CollapsibleTrigger.displayName;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(
      "overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
      className,
    )}
    {...props}
  >
    <div className={cn("text-muted-foreground", className)}>{children}</div>
  </CollapsiblePrimitive.CollapsibleContent>
));
CollapsibleContent.displayName = CollapsiblePrimitive.CollapsibleContent.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Collapsible section with header and content
 */
interface CollapsibleSectionProps extends CollapsibleProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

function CollapsibleSection({
  title,
  description,
  children,
  defaultOpen = false,
  variant = "default",
  size = "default",
  icon,
  className,
  ...props
}: CollapsibleSectionProps) {
  return (
    <Collapsible defaultOpen={defaultOpen} variant={variant} size={size} {...props}>
      <CollapsibleTrigger className={cn("group", className)}>
        <div className="flex items-center gap-3">
          {icon && <div className="shrink-0 text-gold">{icon}</div>}
          <div className="flex-1 text-left">
            <div className="font-semibold">{title}</div>
            {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * Group of collapsible items (like accordion)
 */
interface CollapsibleGroupProps {
  items: Array<{
    id: string;
    title: React.ReactNode;
    content: React.ReactNode;
    defaultOpen?: boolean;
  }>;
  variant?: CollapsibleProps["variant"];
  size?: CollapsibleProps["size"];
  allowMultiple?: boolean;
}

function CollapsibleGroup({
  items,
  variant = "default",
  size = "default",
  allowMultiple = false,
}: CollapsibleGroupProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(
    items.filter((item) => item.defaultOpen).map((item) => item.id),
  );

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Collapsible
          key={item.id}
          open={openItems.includes(item.id)}
          onOpenChange={() => toggleItem(item.id)}
          variant={variant}
          size={size}
        >
          <CollapsibleTrigger>{item.title}</CollapsibleTrigger>
          <CollapsibleContent>{item.content}</CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

// ============================================================================
// Animation Keyframes (add to your global CSS)
// ============================================================================

// Add these to your global CSS or tailwind config:
// @keyframes collapsible-down {
//   from { height: 0; }
//   to { height: var(--radix-collapsible-content-height); }
// }
// @keyframes collapsible-up {
//   from { height: var(--radix-collapsible-content-height); }
//   to { height: 0; }
// }
// .animate-collapsible-down {
//   animation: collapsible-down 0.2s ease-out;
// }
// .animate-collapsible-up {
//   animation: collapsible-up 0.2s ease-out;
// }

// ============================================================================
// Default Export
// ============================================================================

export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleSection, CollapsibleGroup };
