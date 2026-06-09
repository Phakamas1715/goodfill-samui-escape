// ============================================================================
// Types
// ============================================================================

type LovableErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
};

type LovableEvents = {
  captureException?: (error: unknown, context?: Record<string, unknown>, options?: LovableErrorOptions) => void;
  captureMessage?: (message: string, context?: Record<string, unknown>, options?: LovableErrorOptions) => void;
  setUser?: (user: { id?: string; email?: string; username?: string }) => void;
};

declare global {
  interface Window {
    __lovableEvents?: LovableEvents;
  }
}

// ============================================================================
// Configuration
// ============================================================================

interface ErrorReporterConfig {
  enabled: boolean;
  environment: "development" | "staging" | "production";
  sampleRate: number; // 0-1, percentage of errors to report
  ignoreErrors: RegExp[];
}

let config: ErrorReporterConfig = {
  enabled: true,
  environment: (process.env.NODE_ENV as any) || "development",
  sampleRate: 1.0,
  ignoreErrors: [/ResizeObserver loop/, /Script error\./, /NetworkError when attempting to fetch/],
};

// ============================================================================
// Helper Functions
// ============================================================================

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as any).message);
  }
  return String(error);
}

function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) return error.stack;
  return undefined;
}

function shouldReportError(error: unknown): boolean {
  // Check if error reporting is enabled
  if (!config.enabled) return false;

  // Check sample rate
  if (Math.random() > config.sampleRate) return false;

  // Check ignore patterns
  const errorMessage = getErrorMessage(error);
  for (const pattern of config.ignoreErrors) {
    if (pattern.test(errorMessage)) {
      console.debug("[ErrorReporter] Ignoring error matching pattern:", pattern);
      return false;
    }
  }

  // Don't report in development unless explicitly enabled
  if (config.environment === "development" && process.env.NODE_ENV !== "production") {
    return false;
  }

  return true;
}

function getEnvironmentInfo(): Record<string, unknown> {
  return {
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    language: typeof navigator !== "undefined" ? navigator.language : undefined,
    platform: typeof navigator !== "undefined" ? (navigator as any).platform : undefined,
    viewport: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : undefined,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.href : undefined,
    referrer: typeof document !== "undefined" ? document.referrer : undefined,
  };
}

// ============================================================================
// Main Reporting Function
// ============================================================================

export function reportLovableError(
  error: unknown,
  context: Record<string, unknown> = {},
  options: LovableErrorOptions = {},
) {
  if (typeof window === "undefined") {
    // Server-side logging only
    console.error("[LovableError] Server-side error:", error);
    return;
  }

  // Check if we should report this error
  if (!shouldReportError(error)) {
    // Still log locally for debugging
    console.debug("[ErrorReporter] Skipped reporting:", getErrorMessage(error));
    return;
  }

  const errorMessage = getErrorMessage(error);
  const errorStack = getErrorStack(error);

  // Log locally for debugging
  console.error("[LovableError] Reporting error:", {
    message: errorMessage,
    context,
    options,
    stack: errorStack,
  });

  // Send to Lovable
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      environment: config.environment,
      ...getEnvironmentInfo(),
      ...context,
    },
    {
      mechanism: options.mechanism || "react_error_boundary",
      handled: options.handled ?? false,
      severity: options.severity || "error",
      tags: options.tags,
      extra: options.extra,
    },
  );
}

// ============================================================================
// Message Reporting
// ============================================================================

export function reportLovableMessage(
  message: string,
  context: Record<string, unknown> = {},
  options: LovableErrorOptions = {},
) {
  if (typeof window === "undefined") return;

  if (!config.enabled) return;

  console.debug("[LovableMessage]", message, context);

  window.__lovableEvents?.captureMessage?.(
    message,
    {
      source: "manual",
      route: window.location.pathname,
      environment: config.environment,
      ...getEnvironmentInfo(),
      ...context,
    },
    {
      mechanism: options.mechanism || "manual",
      handled: options.handled ?? true,
      severity: options.severity || "info",
      tags: options.tags,
      extra: options.extra,
    },
  );
}

// ============================================================================
// User Context
// ============================================================================

export function setLovableUser(user: { id?: string; email?: string; username?: string }) {
  if (typeof window === "undefined") return;

  window.__lovableEvents?.setUser?.(user);
  console.debug("[LovableUser] User set:", user);
}

// ============================================================================
// Configuration
// ============================================================================

export function configureLovableErrorReporter(newConfig: Partial<ErrorReporterConfig>) {
  config = { ...config, ...newConfig };
  console.debug("[ErrorReporter] Configured:", config);
}

export function getLovableErrorReporterConfig(): ErrorReporterConfig {
  return { ...config };
}

// ============================================================================
// React Error Boundary Helper
// ============================================================================

export function createErrorHandler(componentName: string, context?: Record<string, unknown>) {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    reportLovableError(error, {
      component: componentName,
      componentStack: errorInfo?.componentStack,
      ...context,
    });
  };
}

// ============================================================================
// Wrapper for Async Functions
// ============================================================================

export function withErrorReporting<T extends (...args: any[]) => any>(fn: T, context?: Record<string, unknown>): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      reportLovableError(error, {
        functionName: fn.name,
        args: JSON.stringify(args).slice(0, 500),
        ...context,
      });
      throw error;
    }
  }) as T;
}

// ============================================================================
// Global Error Handlers Setup
// ============================================================================

let globalHandlersInitialized = false;

export function initGlobalErrorHandlers() {
  if (globalHandlersInitialized) return;
  if (typeof window === "undefined") return;

  // Store original handlers
  const originalOnError = window.onerror;
  const originalOnUnhandledRejection = window.onunhandledrejection;

  window.onerror = (message, source, lineno, colno, error) => {
    reportLovableError(
      error || message,
      {
        source,
        line: lineno,
        column: colno,
      },
      {
        mechanism: "onerror",
        handled: false,
        severity: "error",
      },
    );

    // Call original handler if exists
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };

  window.onunhandledrejection = (event) => {
    reportLovableError(
      event.reason,
      {
        promise: event.promise?.toString(),
      },
      {
        mechanism: "unhandledrejection",
        handled: false,
        severity: "error",
      },
    );

    // Call original handler if exists
    if (originalOnUnhandledRejection) {
      originalOnUnhandledRejection.call(window, event);
    }
  };

  globalHandlersInitialized = true;
  console.debug("[ErrorReporter] Global error handlers initialized");
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  reportError: reportLovableError,
  reportMessage: reportLovableMessage,
  setUser: setLovableUser,
  configure: configureLovableErrorReporter,
  getConfig: getLovableErrorReporterConfig,
  createErrorHandler,
  withErrorReporting,
  initGlobalHandlers: initGlobalErrorHandlers,
};
