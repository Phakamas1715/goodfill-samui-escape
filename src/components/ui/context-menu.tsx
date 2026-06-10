import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface ContextMenuSubTriggerProps extends React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.SubTrigger
> {
  inset?: boolean;
  variant?: "default" | "gold" | "emerald";
}

interface ContextMenuItemProps extends React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Item
> {
  inset?: boolean;
  variant?: "default" | "gold" | "emerald";
  icon?: React.ReactNode;
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: {
    item: "focus:bg-navy/10 focus:text-navy",
    subTrigger: "focus:bg-navy/10 focus:text-navy data-[state=open]:bg-navy/10",
    text: "text-navy",
    textMuted: "text-muted-foreground",
    accent: "text-emerald",
  },
  gold: {
    item: "focus:bg-gold/20 focus:text-emerald-deep",
    subTrigger: "focus:bg-gold/20 focus:text-emerald-deep data-[state=open]:bg-gold/20",
    text: "text-emerald-deep",
    textMuted: "text-gold/70",
    accent: "text-gold",
  },
  emerald: {
    item: "focus:bg-emerald/20 focus:text-ivory",
    subTrigger: "focus:bg-emerald/20 focus:text-ivory data-[state=open]:bg-emerald/20",
    text: "text-ivory",
    textMuted: "text-emerald/70",
    accent: "text-emerald",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const ContextMenu = ContextMenuPrimitive.Root;

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuGroup = ContextMenuPrimitive.Group;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = ContextMenuPrimitive.Sub;

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  ContextMenuSubTriggerProps
>(({ className, inset, variant = "default", children, ...props }, ref) => {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <ContextMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        "flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors",
        variantStyle.subTrigger,
        variantStyle.text,
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className={cn("ml-auto h-3.5 w-3.5", variantStyle.textMuted)} />
    </ContextMenuPrimitive.SubTrigger>
  );
});
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[12rem] overflow-hidden rounded-xl border border-mint/30 bg-white/95 backdrop-blur-sm p-1.5 shadow-xl",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2",
      "data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2",
      "data-[side=top]:slide-in-from-bottom-2",
      "origin-(--radix-context-menu-content-transform-origin)",
      className,
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 max-h-(--radix-context-menu-content-available-height) min-w-[12rem] overflow-y-auto overflow-x-hidden rounded-xl border border-mint/30 bg-white/95 backdrop-blur-sm p-1.5 shadow-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        "origin-(--radix-context-menu-content-transform-origin)",
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(({ className, inset, variant = "default", icon, children, ...props }, ref) => {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        variantStyle.item,
        variantStyle.text,
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {icon && <span className={cn("mr-2 shrink-0", variantStyle.accent)}>{icon}</span>}
      {children}
    </ContextMenuPrimitive.Item>
  );
});
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-md py-2 pl-8 pr-3 text-sm outline-none transition-colors",
      "focus:bg-navy/10 focus:text-navy",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "text-navy",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-3.5 w-3.5 text-emerald" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-md py-2 pl-8 pr-3 text-sm outline-none transition-colors",
      "focus:bg-navy/10 focus:text-navy",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "text-navy",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-3 w-3 fill-current text-emerald" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-mint/30", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground font-mono", className)}
      {...props}
    />
  );
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Context menu with gold variant for premium sections
 */
const GoldContextMenu = (props: React.ComponentProps<typeof ContextMenuPrimitive.Root>) => (
  <ContextMenu {...props} />
);

/**
 * Context menu item with destructive style
 */
const ContextMenuDestructiveItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(({ className, ...props }, ref) => (
  <ContextMenuItem
    ref={ref}
    className={cn("focus:bg-coral/10 focus:text-coral text-coral", className)}
    {...props}
  />
));
ContextMenuDestructiveItem.displayName = "ContextMenuDestructiveItem";

// ============================================================================
// Default Export
// ============================================================================

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
  GoldContextMenu,
  ContextMenuDestructiveItem,
};
