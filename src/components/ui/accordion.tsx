import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  variant?: "default" | "gold" | "emerald";
  showIcon?: boolean;
}

interface AccordionItemProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {
  variant?: "default" | "card";
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: {
    trigger: "hover:text-emerald data-[state=open]:text-emerald",
    icon: "text-muted-foreground group-hover:text-emerald",
  },
  gold: {
    trigger: "hover:text-gold data-[state=open]:text-gold",
    icon: "text-gold/70 group-hover:text-gold",
  },
  emerald: {
    trigger: "hover:text-emerald-deep data-[state=open]:text-emerald-deep",
    icon: "text-emerald/70 group-hover:text-emerald",
  },
};

const ITEM_VARIANT_STYLES = {
  default: "border-b border-border",
  card: "border border-border rounded-xl mb-3 overflow-hidden bg-white/50 backdrop-blur-sm",
};

// ============================================================================
// Components
// ============================================================================

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Item>, AccordionItemProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <AccordionPrimitive.Item ref={ref} className={cn(ITEM_VARIANT_STYLES[variant], className)} {...props} />
  ),
);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Trigger>, AccordionTriggerProps>(
  ({ className, children, variant = "default", showIcon = true, ...props }, ref) => {
    const variantStyle = VARIANT_STYLES[variant];

    return (
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(
            "group flex flex-1 items-center justify-between py-4 text-sm md:text-base font-medium cursor-pointer transition-all",
            "hover:underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg",
            variantStyle.trigger,
            className,
          )}
          {...props}
        >
          <span className="flex items-center gap-2">{children}</span>
          {showIcon && (
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-300",
                "group-data-[state=open]:rotate-180",
                variantStyle.icon,
              )}
            />
          )}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  },
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm md:text-base text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-1", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Accordion with built-in FAQ styling
 *
 * @example
 * <FaqAccordion items={[
 *   { question: "What is Goodfill Care?", answer: "A wellness platform..." },
 * ]} />
 */
interface FaqItem {
  question: string;
  answer: React.ReactNode;
  icon?: React.ReactNode;
}

interface FaqAccordionProps {
  items: FaqItem[];
  variant?: "default" | "gold" | "emerald";
  itemVariant?: "default" | "card";
  defaultValue?: string | string[];
  collapsible?: boolean;
  type?: "single" | "multiple";
}

export function FaqAccordion({
  items,
  variant = "default",
  itemVariant = "card",
  defaultValue,
  collapsible = true,
  type = "single",
}: FaqAccordionProps) {
  const defaultValues = defaultValue || (type === "single" ? items[0]?.question : undefined);

  return (
    <Accordion type={type} defaultValue={defaultValues as any} collapsible={collapsible} className="space-y-3">
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={item.question} variant={itemVariant}>
          <AccordionTrigger variant={variant} className="px-4">
            <div className="flex items-center gap-3">
              {item.icon || <Sparkles className="h-4 w-4 text-gold" />}
              <span className="font-semibold text-navy">{item.question}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="text-muted-foreground leading-relaxed">{item.answer}</div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/**
 * Simple accordion wrapper for common use cases
 */
export function SimpleAccordion({
  title,
  children,
  defaultOpen = false,
  variant = "default",
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: "default" | "gold" | "emerald";
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const value = isOpen ? "open" : "closed";

  return (
    <Accordion type="single" value={value} onValueChange={(val) => setIsOpen(val === "open")} collapsible>
      <AccordionItem value="open" variant="card">
        <AccordionTrigger variant={variant} className="px-4">
          {title}
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// ============================================================================
// Default Export
// ============================================================================

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
