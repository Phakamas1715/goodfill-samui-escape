import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================================================
// Main Utility
// ============================================================================

/**
 * Combines Tailwind CSS classes with clsx and merges Tailwind classes properly.
 *
 * @example
 * cn("px-2 py-1", "bg-red-500", { "opacity-50": disabled })
 * // Returns: "px-2 py-1 bg-red-500 opacity-50"
 *
 * @param inputs - ClassValue inputs (strings, objects, arrays)
 * @returns Merged Tailwind class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================================================
// Additional Utilities
// ============================================================================

/**
 * Conditionally joins class names without Tailwind merging.
 * Use for non-Tailwind classes or when merging is not desired.
 */
export function cx(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Creates a conditional class name helper for a specific component.
 *
 * @example
 * const button = createClassHelper("btn", {
 *   variant: {
 *     primary: "btn-primary",
 *     secondary: "btn-secondary",
 *   },
 *   size: {
 *     sm: "btn-sm",
 *     lg: "btn-lg",
 *   },
 *   disabled: "opacity-50 cursor-not-allowed",
 * });
 *
 * button({ variant: "primary", size: "lg", disabled: true })
 * // Returns: "btn btn-primary btn-lg opacity-50 cursor-not-allowed"
 */
export function createClassHelper(baseClass: string, variants: Record<string, Record<string, string> | string> = {}) {
  return (options: Record<string, any> = {}): string => {
    const classes: string[] = [baseClass];

    for (const [key, value] of Object.entries(options)) {
      const variant = variants[key];
      if (!variant) continue;

      if (typeof variant === "string") {
        if (value) classes.push(variant);
      } else if (typeof variant === "object") {
        const variantClass = variant[value];
        if (variantClass) classes.push(variantClass);
      }
    }

    return cn(...classes);
  };
}

/**
 * Creates a variant-based class name utility with type safety.
 *
 * @example
 * const buttonVariants = defineVariants({
 *   base: "inline-flex items-center justify-center rounded-md font-medium",
 *   variants: {
 *     variant: {
 *       primary: "bg-blue-600 text-white hover:bg-blue-700",
 *       secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
 *     },
 *     size: {
 *       sm: "px-2 py-1 text-sm",
 *       md: "px-4 py-2 text-base",
 *       lg: "px-6 py-3 text-lg",
 *     },
 *   },
 *   defaultVariants: {
 *     variant: "primary",
 *     size: "md",
 *   },
 * });
 *
 * buttonVariants({ variant: "secondary", size: "lg" })
 */
export function defineVariants<T extends Record<string, Record<string, string>>>(config: {
  base: string;
  variants: T;
  defaultVariants?: Partial<{ [K in keyof T]: keyof T[K] }>;
}) {
  const { base, variants, defaultVariants = {} } = config;

  return (props?: Partial<{ [K in keyof T]: keyof T[K] }>): string => {
    const classes: string[] = [base];
    const mergedProps = { ...defaultVariants, ...props };

    for (const [key, value] of Object.entries(mergedProps)) {
      const variantGroup = variants[key as keyof T];
      if (variantGroup && value && variantGroup[value as string]) {
        classes.push(variantGroup[value as string]);
      }
    }

    return cn(...classes);
  };
}

// ============================================================================
// Conditional Class Helpers
// ============================================================================

/**
 * Returns a class name based on a condition.
 *
 * @example
 * classNames({
 *   "bg-red-500": error,
 *   "bg-green-500": success,
 *   "bg-gray-500": !error && !success,
 * })
 */
export function classNames(classes: Record<string, boolean>): string {
  return cn(
    Object.entries(classes)
      .filter(([, condition]) => condition)
      .map(([className]) => className),
  );
}

/**
 * Combines multiple class name sources with optional conditions.
 *
 * @example
 * combineClasses(
 *   "base-class",
 *   isActive && "active-class",
 *   { "hover-class": isHovered }
 * )
 */
export function combineClasses(...inputs: (string | false | null | undefined | Record<string, boolean>)[]): string {
  return cn(...inputs);
}

/**
 * Filters out falsy values and joins with space.
 */
export function joinClasses(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Focus & State Helpers
// ============================================================================

export const focusRing = cn(
  "focus:outline-none focus:ring-2 focus:ring-offset-2",
  "focus:ring-emerald-500 focus:ring-offset-white",
);

export const focusVisible = cn(
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
);

export const disabledStyles = "disabled:opacity-50 disabled:cursor-not-allowed";

// ============================================================================
// Layout Helpers
// ============================================================================

export const flexCenter = cn("flex items-center justify-center");
export const flexBetween = cn("flex items-center justify-between");
export const flexColumn = cn("flex flex-col");

export const container = cn("mx-auto px-4 sm:px-6 lg:px-8");
export const containerMaxWidth = cn(container, "max-w-7xl");

// ============================================================================
// Animation Helpers
// ============================================================================

export const transition = cn("transition-all duration-200 ease-in-out");
export const transitionFast = cn("transition-all duration-100 ease-in-out");
export const transitionSlow = cn("transition-all duration-300 ease-in-out");

export const hoverScale = cn("hover:scale-105 transition-transform duration-200");
export const hoverLift = cn("hover:-translate-y-0.5 transition-transform duration-200");

// ============================================================================
// Typography Helpers
// ============================================================================

export const truncate = cn("truncate");
export const lineClamp1 = cn("line-clamp-1");
export const lineClamp2 = cn("line-clamp-2");
export const lineClamp3 = cn("line-clamp-3");

// ============================================================================
// Default Export
// ============================================================================

export default {
  cn,
  cx,
  createClassHelper,
  defineVariants,
  classNames,
  combineClasses,
  joinClasses,
  // Common utilities
  focusRing,
  focusVisible,
  disabledStyles,
  flexCenter,
  flexBetween,
  flexColumn,
  container,
  containerMaxWidth,
  transition,
  transitionFast,
  transitionSlow,
  hoverScale,
  hoverLift,
  truncate,
  lineClamp1,
  lineClamp2,
  lineClamp3,
};
