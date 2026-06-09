import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface MenubarProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root> {
  variant?: "default" | "gold" | "emerald";
}

interface MenubarItemProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> {
  inset?: boolean;
  icon?: React.ReactNode;
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: {
    root: "bg-white/95 backdrop-blur-sm border border-mint/30 shadow-sm",
    trigger: "hover:bg-navy/5 data-[state=open]:bg-navy/5 data-[state=open]:text-navy",
    item: "focus:bg-navy/5 focus:text-navy",
    subTrigger: "focus:bg-navy/5 data-[state=open]:bg-navy/5",
    text: "text-navy",
    textMuted: "text-muted-foreground",
    accent: "text-emerald",
  },
  gold: {
    root: "bg-gradient-to-br from-gold/10 to-gold-soft/20 border border-gold/40 shadow-md",
    trigger: "hover:bg-gold/10 data-[state=open]:bg-gold/10 data-[state=open]:text-emerald-deep",
    item: "focus:bg-gold/10 focus:text-emerald-deep",
    subTrigger: "focus:bg-gold/10 data-[state=open]:bg-gold/10",
    text: "text-emerald-deep",
    textMuted: "text-gold/70",
    accent: "text-gold",
  },
  emerald: {
    root: "bg-gradient-to-br from-emerald/10 to-emerald-deep/20 border border-emerald/40 shadow-md",
    trigger: "hover:bg-emerald/10 data-[state=open]:bg-emerald/10 data-[state=open]:text-ivory",
    item: "focus:bg-emerald/10 focus:text-ivory",
    subTrigger: "focus:bg-emerald/10 data-[state=open]:bg-emerald/10",
    text: "text-ivory",
    textMuted: "text-emerald/70",
    accent: "text-emerald",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

function MenubarMenu({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />;
}

function MenubarGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />;
}

function MenubarPortal({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />;
}

function MenubarRadioGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />;
}

function MenubarSub({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

const Menubar = React.forwardRef<React.ElementRef<typeof MenubarPrimitive.Root>, MenubarProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];

    return (
      <MenubarPrimitive.Root
        ref={ref}
        className={cn("flex h-11 items-center gap-1.5 rounded-xl p-1 shadow-sm", variantStyle.root, className)}
        {...props}
      />
    );
  },
);
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const variant = "default";
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <MenubarPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex cursor-default select-none items-center rounded-lg px-4 py-2 text-base font-medium outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        variantStyle.text,
        className,
      )}
      {...props}
    />
  );
});
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => {
  const variant = "default";
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <MenubarPrimitive.SubTrigger
      ref={ref}
      className={cn(
        "flex cursor-default select-none items-center rounded-lg px-4 py-2.5 text-base outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        inset && "pl-8",
        variantStyle.text,
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className={cn("ml-auto h-4 w-4", variantStyle.textMuted)} />
    </MenubarPrimitive.SubTrigger>
  );
});
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[14rem] overflow-hidden rounded-xl border bg-white/95 backdrop-blur-sm p-2 shadow-xl",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2",
      "data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2",
      "data-[side=top]:slide-in-from-bottom-2",
      "origin-(--radix-menubar-content-transform-origin)",
      className,
    )}
    {...props}
  />
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[14rem] overflow-hidden rounded-xl border bg-white/95 backdrop-blur-sm p-2 shadow-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        "origin-(--radix-menubar-content-transform-origin)",
        className,
      )}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<React.ElementRef<typeof MenubarPrimitive.Item>, MenubarItemProps>(
  ({ className, inset, icon, children, ...props }, ref) => {
    const variant = "default";
    const variantStyle = VARIANT_STYLES[variant];

    return (
      <MenubarPrimitive.Item
        ref={ref}
        className={cn(
          "relative flex cursor-default select-none items-center gap-3 rounded-lg px-4 py-2.5 text-base outline-none transition-colors",
          "focus:bg-accent focus:text-accent-foreground",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          inset && "pl-8",
          variantStyle.text,
          className,
        )}
        {...props}
      >
        {icon && <span className={cn("shrink-0", variantStyle.accent)}>{icon}</span>}
        {children}
      </MenubarPrimitive.Item>
    );
  },
);
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => {
  const variant = "default";
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <MenubarPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-lg py-2.5 pl-9 pr-4 text-base outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        variantStyle.text,
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-3 flex h-5 w-5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <Check className={cn("h-4 w-4", variantStyle.accent)} />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
});
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => {
  const variant = "default";
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <MenubarPrimitive.RadioItem
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-lg py-2.5 pl-9 pr-4 text-base outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        variantStyle.text,
        className,
      )}
      {...props}
    >
      <span className="absolute left-3 flex h-5 w-5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <Circle className={cn("h-3.5 w-3.5 fill-current", variantStyle.accent)} />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
});
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => {
  const variant = "default";
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <MenubarPrimitive.Label
      ref={ref}
      className={cn(
        "px-4 py-2 text-xs font-semibold uppercase tracking-wider",
        variantStyle.textMuted,
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
});
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-mint/30", className)} {...props} />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  const variant = "default";
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <span className={cn("ml-auto text-xs tracking-widest font-mono", variantStyle.textMuted, className)} {...props} />
  );
};
MenubarShortcut.displayName = "MenubarShortcut";

// ============================================================================
// Default Export
// ============================================================================

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};
