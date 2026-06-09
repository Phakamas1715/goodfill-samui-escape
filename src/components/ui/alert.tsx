import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type AlertVariant = "default" | "success" | "warning" | "error" | "info" | "gold";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  onClose?: () => void;
  closable?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const alertVariants = cva("relative w-full rounded-xl border p-4 text-sm transition-all duration-200", {
  variants: {
    variant: {
      default: ["bg-white/80 backdrop-blur-sm border-mint/40 text-navy", "shadow-sm"].join(" "),
      success: ["bg-emerald-50/90 border-emerald-200 text-emerald-800", "shadow-sm"].join(" "),
      warning: ["bg-amber-50/90 border-amber-200 text-amber-800", "shadow-sm"].join(" "),
      error: ["bg-coral-50/90 border-coral-200 text-coral-800", "shadow-sm"].join(" "),
      info: ["bg-sky-50/90 border-sky-200 text-sky-800", "shadow-sm"].join(" "),
      gold: ["bg-gradient-to-r from-gold/10 to-gold-soft/5 border-gold/30 text-emerald-deep", "shadow-md"].join(" "),
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// ============================================================================
// Icons
// ============================================================================

const AlertIcons = {
  success: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  warning: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  error: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  gold: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  ),
  default: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

// ============================================================================
// Components
// ============================================================================

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", icon, children, onClose, closable = false, ...props }, ref) => {
    const defaultIcon = icon || AlertIcons[variant as keyof typeof AlertIcons] || AlertIcons.default;

    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant }), "relative", className)} {...props}>
        <div className="absolute left-4 top-4">{defaultIcon}</div>
        <div className="pl-7 pr-7">{children}</div>
        {closable && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close alert"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-semibold leading-none tracking-tight text-current", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed text-current/80", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

// ============================================================================
// Additional Helper Components
// ============================================================================

interface AlertBannerProps {
  variant?: AlertVariant;
  title?: string;
  message?: string;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

/**
 * Pre-built alert banner for common use cases
 *
 * @example
 * <AlertBanner
 *   variant="success"
 *   title="Success!"
 *   message="Your booking has been confirmed."
 *   closable
 *   onClose={() => setShowBanner(false)}
 * />
 */
export function AlertBanner({
  variant = "default",
  title,
  message,
  closable = false,
  onClose,
  className,
}: AlertBannerProps) {
  return (
    <Alert variant={variant} closable={closable} onClose={onClose} className={className}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {message && <AlertDescription>{message}</AlertDescription>}
    </Alert>
  );
}

/**
 * Toast-style alert that auto-dismisses
 *
 * @example
 * <ToastAlert
 *   variant="success"
 *   message="Changes saved"
 *   duration={3000}
 *   onDismiss={() => setShowToast(false)}
 * />
 */
export function ToastAlert({
  variant = "default",
  title,
  message,
  duration = 5000,
  onDismiss,
}: AlertBannerProps & { duration?: number }) {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
      <Alert variant={variant} closable onClose={onDismiss}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message && <AlertDescription>{message}</AlertDescription>}
      </Alert>
    </div>
  );
}

// ============================================================================
// Default Export
// ============================================================================

export { Alert, AlertTitle, AlertDescription, AlertBanner, ToastAlert, alertVariants, type AlertVariant };
