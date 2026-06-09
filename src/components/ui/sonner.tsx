import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle, AlertCircle, AlertTriangle, Info, XCircle, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type ToasterProps = React.ComponentProps<typeof Sonner>;

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================================================
// Constants
// ============================================================================

const TOAST_DURATIONS = {
  default: 4000,
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
  loading: Infinity,
} as const;

// ============================================================================
// Main Component
// ============================================================================

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: cn(
            "group toast group-[.toaster]:bg-white/95 group-[.toaster]:backdrop-blur-sm",
            "group-[.toaster]:border group-[.toaster]:border-mint/30",
            "group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl",
            "group-[.toaster]:text-navy",
          ),
          title: "group-[.toast]:font-semibold group-[.toast]:text-navy",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton: cn(
            "group-[.toast]:bg-gold group-[.toast]:text-emerald-deep",
            "group-[.toast]:hover:bg-gold/90 group-[.toast]:transition-colors",
            "group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1",
          ),
          cancelButton: cn(
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
            "group-[.toast]:hover:bg-muted/80 group-[.toast]:transition-colors",
            "group-[.toast]:rounded-lg",
          ),
          error: "group-[.toaster]:border-coral/50 group-[.toaster]:bg-coral/10",
          success: "group-[.toaster]:border-emerald/50 group-[.toaster]:bg-emerald/10",
          warning: "group-[.toaster]:border-amber/50 group-[.toaster]:bg-amber/10",
          info: "group-[.toaster]:border-sky/50 group-[.toaster]:bg-sky/10",
        },
      }}
      {...props}
    />
  );
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Show a success toast
 */
function showSuccess(title: string, options?: Partial<ToastOptions>) {
  return toast.success(title, {
    icon: options?.icon || <CheckCircle className="h-5 w-5 text-emerald" />,
    description: options?.description,
    duration: options?.duration || TOAST_DURATIONS.success,
    action: options?.action,
  });
}

/**
 * Show an error toast
 */
function showError(title: string, options?: Partial<ToastOptions>) {
  return toast.error(title, {
    icon: options?.icon || <XCircle className="h-5 w-5 text-coral" />,
    description: options?.description,
    duration: options?.duration || TOAST_DURATIONS.error,
    action: options?.action,
  });
}

/**
 * Show a warning toast
 */
function showWarning(title: string, options?: Partial<ToastOptions>) {
  return toast.warning(title, {
    icon: options?.icon || <AlertTriangle className="h-5 w-5 text-amber" />,
    description: options?.description,
    duration: options?.duration || TOAST_DURATIONS.warning,
    action: options?.action,
  });
}

/**
 * Show an info toast
 */
function showInfo(title: string, options?: Partial<ToastOptions>) {
  return toast.info(title, {
    icon: options?.icon || <Info className="h-5 w-5 text-sky" />,
    description: options?.description,
    duration: options?.duration || TOAST_DURATIONS.info,
    action: options?.action,
  });
}

/**
 * Show a loading toast
 */
function showLoading(title: string, options?: Partial<ToastOptions>) {
  return toast.loading(title, {
    description: options?.description,
    duration: options?.duration || TOAST_DURATIONS.loading,
  });
}

/**
 * Show a gold/premium toast
 */
function showPremium(title: string, options?: Partial<ToastOptions>) {
  return toast(title, {
    icon: options?.icon || <Sparkles className="h-5 w-5 text-gold" />,
    description: options?.description,
    duration: options?.duration || TOAST_DURATIONS.default,
    className: "border-gold/50 bg-gradient-to-r from-gold/10 to-gold-soft/20",
  });
}

/**
 * Show a custom toast
 */
function showCustom(title: string, options?: Partial<ToastOptions> & { variant?: "default" | "premium" }) {
  const variant = options?.variant || "default";
  const isPremium = variant === "premium";

  return toast(title, {
    icon: options?.icon,
    description: options?.description,
    duration: options?.duration,
    action: options?.action,
    className: isPremium ? "border-gold/50 bg-gradient-to-r from-gold/10 to-gold-soft/20" : undefined,
  });
}

/**
 * Promise toast for async operations
 */
async function showPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
  options?: {
    successDescription?: string;
    errorDescription?: string;
  },
): Promise<T> {
  toast.promise(promise, {
    loading: messages.loading,
    success: () => ({
      message: messages.success,
      description: options?.successDescription,
    }),
    error: (error) => ({
      message: messages.error,
      description: options?.errorDescription || (error instanceof Error ? error.message : undefined),
    }),
  });
  return promise;
}

// ============================================================================
// Default Export
// ============================================================================

export { Toaster, showSuccess, showError, showWarning, showInfo, showLoading, showPremium, showCustom, showPromise };

// Re-export toast from sonner for direct usage
export { toast };
