"use client";

import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search, Sparkles, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// ============================================================================
// Types
// ============================================================================

interface CommandProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  variant?: "default" | "gold" | "emerald";
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: {
    root: "bg-white/95 backdrop-blur-sm border border-mint/30",
    input: "text-navy placeholder:text-muted-foreground",
    item: "data-[selected=true]:bg-navy/10 data-[selected=true]:text-navy",
    group: "text-muted-foreground",
  },
  gold: {
    root: "bg-gradient-to-br from-gold/5 to-gold-soft/10 border border-gold/30",
    input: "text-emerald-deep placeholder:text-gold/50",
    item: "data-[selected=true]:bg-gold/20 data-[selected=true]:text-emerald-deep",
    group: "text-gold",
  },
  emerald: {
    root: "bg-gradient-to-br from-emerald/5 to-emerald-deep/10 border border-emerald/30",
    input: "text-ivory placeholder:text-emerald/50",
    item: "data-[selected=true]:bg-emerald/20 data-[selected=true]:text-ivory",
    group: "text-emerald",
  },
} as const;

// ============================================================================
// Components
// ============================================================================

const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, CommandProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];

    return (
      <CommandPrimitive
        ref={ref}
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-2xl shadow-xl",
          variantStyle.root,
          className,
        )}
        {...props}
      />
    );
  },
);
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-2xl">
        <Command className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b border-mint/30 px-4" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[400px] overflow-y-auto overflow-x-hidden p-2", className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="py-8 text-center text-sm text-muted-foreground" {...props} />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider",
      className,
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-mint/30", className)} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer gap-2 select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-150",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      "data-[selected=true]:bg-navy/10 data-[selected=true]:text-navy",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className,
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground font-mono", className)} {...props} />
  );
};
CommandShortcut.displayName = "CommandShortcut";

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Command item with icon and description
 */
interface CommandItemWithDescriptionProps extends React.ComponentPropsWithoutRef<typeof CommandItem> {
  icon?: React.ReactNode;
  description?: string;
  shortcut?: string;
}

const CommandItemWithDescription = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  CommandItemWithDescriptionProps
>(({ icon, description, shortcut, children, ...props }, ref) => (
  <CommandItem ref={ref} {...props}>
    {icon && <span className="text-gold">{icon}</span>}
    <div className="flex-1">
      <div className="font-medium">{children}</div>
      {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
    </div>
    {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
  </CommandItem>
));
CommandItemWithDescription.displayName = "CommandItemWithDescription";

/**
 * Command group with title
 */
interface CommandGroupWithTitleProps extends React.ComponentPropsWithoutRef<typeof CommandGroup> {
  title: string;
  icon?: React.ReactNode;
}

const CommandGroupWithTitle = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  CommandGroupWithTitleProps
>(({ title, icon, children, ...props }, ref) => (
  <CommandGroup ref={ref} {...props}>
    <div className="flex items-center gap-2 px-3 py-2">
      {icon && <span className="text-gold">{icon}</span>}
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
    </div>
    {children}
  </CommandGroup>
));
CommandGroupWithTitle.displayName = "CommandGroupWithTitle";

// ============================================================================
// Default Export
// ============================================================================

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandItemWithDescription,
  CommandGroupWithTitle,
};
