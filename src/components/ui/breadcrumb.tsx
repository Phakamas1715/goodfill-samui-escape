import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal, Home, Sparkles, ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  separator?: React.ReactNode;
  variant?: "default" | "gold" | "emerald";
  showHome?: boolean;
  backButton?: boolean;
  onBack?: () => void;
}

interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  asChild?: boolean;
  active?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const VARIANT_STYLES = {
  default: "text-muted-foreground hover:text-navy",
  gold: "text-gold/70 hover:text-gold",
  emerald: "text-emerald/70 hover:text-emerald",
} as const;

// ============================================================================
// Components
// ============================================================================

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      className,
      separator = <ChevronRight className="h-3.5 w-3.5" />,
      variant = "default",
      showHome = false,
      backButton = false,
      onBack,
      children,
      ...props
    },
    ref,
  ) => (
    <nav ref={ref} aria-label="breadcrumb" className={cn("w-full", className)} {...props}>
      <div className="flex items-center gap-2">
        {backButton && (
          <button
            onClick={onBack}
            className="flex items-center justify-center rounded-full p-1 text-muted-foreground hover:bg-muted/50 hover:text-navy transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        <BreadcrumbList>
          {showHome && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" />
                  <span className="sr-only">Home</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
            </>
          )}
          {children}
        </BreadcrumbList>
      </div>
    </nav>
  ),
);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn("flex flex-wrap items-center gap-1.5 break-words text-sm md:text-base", className)}
      {...props}
    />
  ),
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  ),
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, active, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    const variantStyle = VARIANT_STYLES.default;

    return (
      <Comp
        ref={ref}
        className={cn(
          "transition-colors duration-200",
          active
            ? "font-semibold text-navy pointer-events-none"
            : cn(variantStyle, "hover:underline underline-offset-4"),
          className,
        )}
        aria-current={active ? "page" : undefined}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-medium text-navy", className)}
      {...props}
    >
      {children}
    </span>
  ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
  <li role="presentation" aria-hidden="true" className={cn("text-muted-foreground/50", className)} {...props}>
    {children ?? <ChevronRight className="h-3.5 w-3.5" />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted/50 transition-colors", className)}
    {...props}
  >
    <MoreHorizontal className="h-3.5 w-3.5" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Breadcrumb with gold variant for premium sections
 */
function GoldBreadcrumb(props: Omit<BreadcrumbProps, "variant">) {
  return <Breadcrumb variant="gold" {...props} />;
}

/**
 * Breadcrumb with emerald variant for wellness sections
 */
function EmeraldBreadcrumb(props: Omit<BreadcrumbProps, "variant">) {
  return <Breadcrumb variant="emerald" {...props} />;
}

/**
 * Breadcrumb with back button for mobile navigation
 */
function BackBreadcrumb({
  onBack,
  children,
  ...props
}: Omit<BreadcrumbProps, "backButton" | "onBack"> & { onBack: () => void }) {
  return (
    <Breadcrumb backButton onBack={onBack} {...props}>
      {children}
    </Breadcrumb>
  );
}

/**
 * Breadcrumb item with icon support
 */
interface IconBreadcrumbItemProps extends React.ComponentPropsWithoutRef<typeof BreadcrumbItem> {
  icon?: React.ReactNode;
  href?: string;
  children: React.ReactNode;
}

function IconBreadcrumbItem({ icon, href, children, ...props }: IconBreadcrumbItemProps) {
  return (
    <BreadcrumbItem {...props}>
      {icon && <span className="text-gold">{icon}</span>}
      {href ? <BreadcrumbLink href={href}>{children}</BreadcrumbLink> : <BreadcrumbPage>{children}</BreadcrumbPage>}
    </BreadcrumbItem>
  );
}

/**
 * Breadcrumb component for admin dashboard
 */
function AdminBreadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <Breadcrumb showHome variant="gold">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={item.label}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        );
      })}
    </Breadcrumb>
  );
}

/**
 * Responsive breadcrumb that collapses on mobile
 */
function ResponsiveBreadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const visibleItems = isMobile ? items.slice(-2) : items;
  const hiddenCount = items.length - visibleItems.length;

  return (
    <Breadcrumb>
      {hiddenCount > 0 && (
        <>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </>
      )}
      {visibleItems.map((item, index) => {
        const isLast = index === visibleItems.length - 1;
        return (
          <React.Fragment key={item.label}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        );
      })}
    </Breadcrumb>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create breadcrumb items from current path
 */
function createBreadcrumbsFromPath(path: string): Array<{ label: string; href: string }> {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return { label, href };
  });
  return breadcrumbs;
}

/**
 * Get page title from breadcrumb
 */
function getPageTitleFromPath(path: string): string {
  const breadcrumbs = createBreadcrumbsFromPath(path);
  const last = breadcrumbs[breadcrumbs.length - 1];
  return last?.label || "Home";
}

// ============================================================================
// Default Export
// ============================================================================

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  GoldBreadcrumb,
  EmeraldBreadcrumb,
  BackBreadcrumb,
  IconBreadcrumbItem,
  AdminBreadcrumb,
  ResponsiveBreadcrumb,
  createBreadcrumbsFromPath,
  getPageTitleFromPath,
};
