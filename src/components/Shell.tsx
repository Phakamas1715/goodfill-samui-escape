import * as React from "react";
import { type ReactNode } from "react";
import { Nav, Footer } from "./Nav";

// ============================================================================
// Types
// ============================================================================

interface ShellProps {
  children: ReactNode;
  className?: string;
  hideNav?: boolean;
  hideFooter?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  background?: "default" | "light" | "dark" | "gradient";
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "light" | "dark" | "gradient" | "transparent";
  spacing?: "sm" | "md" | "lg" | "none";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  divider?: boolean;
}

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  variant?: "default" | "gold" | "emerald" | "coral";
}

// ============================================================================
// Constants
// ============================================================================

const SPACING_MAP = {
  none: "py-0",
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
};

const MAX_WIDTH_MAP = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-[90rem]",
  full: "max-w-full",
};

const BACKGROUND_MAP = {
  default: "bg-background",
  light: "bg-cream/50",
  dark: "bg-emerald-deep text-ivory",
  gradient: "bg-gradient-to-br from-cream via-white to-ivory",
  transparent: "bg-transparent",
};

const EYEBROW_VARIANTS = {
  default: "text-muted-foreground before:bg-muted-foreground",
  gold: "text-gold before:bg-gold",
  emerald: "text-emerald before:bg-emerald",
  coral: "text-coral before:bg-coral",
};

// ============================================================================
// Main Components
// ============================================================================

/**
 * Main layout shell with Nav and Footer
 *
 * @example
 * <Shell>
 *   <Section>Content</Section>
 * </Shell>
 */
export function Shell({
  children,
  className = "",
  hideNav = false,
  hideFooter = false,
  maxWidth = "lg",
  background = "default",
}: ShellProps) {
  const bgClass = BACKGROUND_MAP[background];
  const maxWidthClass = MAX_WIDTH_MAP[maxWidth];

  return (
    <>
      {!hideNav && <Nav />}
      <main
        className={`
        pt-24 md:pt-28 
        ${bgClass}
        ${className}
      `}
      >
        <div className={`${maxWidthClass} mx-auto px-5 md:px-8`}>{children}</div>
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}

/**
 * Section component with consistent spacing and styling
 *
 * @example
 * <Section id="about" background="light">
 *   <h2>About Us</h2>
 * </Section>
 */
export function Section({
  children,
  className = "",
  id,
  background = "default",
  spacing = "lg",
  maxWidth = "lg",
  divider = false,
}: SectionProps) {
  const bgClass = BACKGROUND_MAP[background];
  const spacingClass = SPACING_MAP[spacing];
  const maxWidthClass = MAX_WIDTH_MAP[maxWidth];

  return (
    <section
      id={id}
      className={`
        ${bgClass}
        ${spacingClass}
        ${divider ? "border-t border-border" : ""}
        ${className}
      `}
    >
      <div className={`${maxWidthClass} mx-auto px-5 md:px-8`}>{children}</div>
    </section>
  );
}

/**
 * Eyebrow component for section pre-headers
 *
 * @example
 * <Eyebrow variant="gold" icon="✨">
 *   Featured
 * </Eyebrow>
 * <h2>Main Title</h2>
 */
export function Eyebrow({ children, className = "", icon, variant = "default" }: EyebrowProps) {
  const variantClass = EYEBROW_VARIANTS[variant];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase font-semibold ${variantClass}`}
      >
        <span className="size-1.5 rounded-full bg-current" />
        {icon && <span className="text-sm">{icon}</span>}
        {children}
      </span>
    </div>
  );
}

// ============================================================================
// Additional Components
// ============================================================================

/**
 * Container component for consistent width constraints
 *
 * @example
 * <Container maxWidth="xl">
 *   <div>Content</div>
 * </Container>
 */
export function Container({
  children,
  className = "",
  maxWidth = "lg",
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  as?: React.ElementType;
}) {
  const maxWidthClass = MAX_WIDTH_MAP[maxWidth];

  return (
    <Component className={`${maxWidthClass} mx-auto px-5 md:px-8 ${className}`}>
      {children}
    </Component>
  );
}

/**
 * Grid component for responsive layouts
 *
 * @example
 * <Grid cols={3}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 */
export function Grid({
  children,
  className = "",
  cols = 1,
  gap = 6,
  responsive = true,
}: {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
  gap?: 4 | 6 | 8 | 10;
  responsive?: boolean;
}) {
  const colClasses = responsive
    ? {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      }[cols]
    : {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
      }[cols];

  const gapClass = `gap-${gap}`;

  return <div className={`grid ${colClasses} ${gapClass} ${className}`}>{children}</div>;
}

/**
 * Divider component
 *
 * @example
 * <Divider />
 * <Divider variant="gradient" spacing="lg" />
 */
export function Divider({
  variant = "default",
  spacing = "md",
  className = "",
}: {
  variant?: "default" | "gradient" | "dashed";
  spacing?: "none" | "sm" | "md" | "lg";
  className?: string;
}) {
  const spacingMap = {
    none: "my-0",
    sm: "my-4",
    md: "my-8",
    lg: "my-12",
  };

  const variantClasses = {
    default: "border-border",
    gradient: "border-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent",
    dashed: "border-t-2 border-dashed border-border",
  };

  return <hr className={`${variantClasses[variant]} ${spacingMap[spacing]} ${className}`} />;
}

// ============================================================================
// Hero Section Component
// ============================================================================

/**
 * Hero section with optional background image
 *
 * @example
 * <Hero title="Welcome" subtitle="to Goodfill Care" backgroundImage="/hero.jpg" />
 */
export function Hero({
  title,
  subtitle,
  children,
  className = "",
  backgroundImage,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
  backgroundImage?: string;
}) {
  return (
    <Section background="gradient" spacing="lg" className={className}>
      <div className="relative text-center">
        {backgroundImage && (
          <div
            className="absolute inset-0 -z-10 opacity-10"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        {title && (
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-navy mb-4">{title}</h1>
        )}
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </Section>
  );
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  Shell,
  Section,
  Eyebrow,
  Container,
  Grid,
  Divider,
  Hero,
};
