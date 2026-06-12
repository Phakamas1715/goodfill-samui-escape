import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
import { consumeLastCapturedError } from "./lib/error-capture";

// ============================================================================
// Types
// ============================================================================

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
  status?: number;
}

interface RequestContext {
  id: string;
  startTime: number;
  method: string;
  url: string;
}

// ============================================================================
// Constants
// ============================================================================

const ERROR_HTML_CONTENT_TYPE = "text/html; charset=utf-8";
const SLOW_REQUEST_THRESHOLD_MS = 1000;
const SHUTDOWN_TIMEOUT_MS = 10000;

// ============================================================================
// Helper Functions
// ============================================================================

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
}

function logError(error: unknown, context: string, extra?: Record<string, unknown>): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error(`[Start:${context}]`, {
    message: errorMessage,
    stack: errorStack?.slice(0, 500),
    timestamp: new Date().toISOString(),
    ...extra,
  });
}

function logInfo(message: string, data?: Record<string, unknown>): void {
  console.info(`[Start] ${message}`, data ? { ...data, timestamp: new Date().toISOString() } : "");
}

function logWarn(message: string, data?: Record<string, unknown>): void {
  console.warn(`[Start] ${message}`, data ? { ...data, timestamp: new Date().toISOString() } : "");
}

function getStatusCode(error: unknown): number {
  if (error && typeof error === "object") {
    if ("statusCode" in error && typeof error.statusCode === "number") {
      return error.statusCode;
    }
    if ("status" in error && typeof error.status === "number") {
      return error.status;
    }
  }
  return 500;
}

function isRedirectError(error: unknown): boolean {
  if (error && typeof error === "object") {
    return (
      "redirect" in error ||
      ("statusCode" in error && (error.statusCode === 301 || error.statusCode === 302 || error.statusCode === 303))
    );
  }
  return false;
}

function isNotFoundError(error: unknown): boolean {
  if (error && typeof error === "object") {
    const code = getStatusCode(error);
    return code === 404;
  }
  return false;
}

// ============================================================================
// Error Middleware
// ============================================================================

const errorMiddleware = createMiddleware().server(async ({ next, request }) => {
  const startTime = Date.now();
  const requestId = generateRequestId();

  try {
    const result = await next();
    const duration = Date.now() - startTime;

    // Log slow requests
    if (duration > SLOW_REQUEST_THRESHOLD_MS) {
      logWarn(`Slow request: ${duration}ms`, {
        method: request.method,
        url: request.url,
        requestId,
      });
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    // Handle redirect errors - rethrow to let router handle
    if (isRedirectError(error)) {
      if (process.env.NODE_ENV === "development") {
        logInfo(`Redirect error (${duration}ms)`, { error: String(error), requestId });
      }
      throw error;
    }

    // Handle 404 errors
    if (isNotFoundError(error)) {
      logInfo(`404 Not Found`, { url: request.url, method: request.method, requestId });
      throw error;
    }

    // Handle known status code errors (non-500)
    const statusCode = getStatusCode(error);
    if (statusCode !== 500) {
      logError(error, `HTTP-${statusCode}`, { requestId, url: request.url });
      throw error;
    }

    // Log the error
    logError(error, "UNHANDLED", { requestId, url: request.url, duration });

    // Try to get captured error from global handlers
    const capturedError = consumeLastCapturedError();
    if (capturedError) {
      logError(capturedError, "CAPTURED", { requestId });
    }

    // Return user-friendly error page for 500s
    const isDev = process.env.NODE_ENV === "development";

    return new Response(
      renderErrorPage({
        lang: "th",
        showDetails: isDev,
        error: isDev ? error : undefined,
      }),
      {
        status: 500,
        headers: {
          "content-type": ERROR_HTML_CONTENT_TYPE,
          "x-request-id": requestId,
        },
      },
    );
  }
});

// ============================================================================
// Logging Middleware
// ============================================================================

const loggingMiddleware = createMiddleware().server(async ({ next, request }) => {
  const startTime = Date.now();
  const method = request.method;
  const url = request.url;
  const requestId = generateRequestId();

  try {
    const result = await next();
    const duration = Date.now() - startTime;
    const status = (result as { status?: number })?.status || 200;

    // Log all requests in development, errors in production
    if (process.env.NODE_ENV === "development") {
      logInfo(`${method} ${url} → ${status} (${duration}ms)`, { requestId });
    } else if (status >= 400) {
      logWarn(`${method} ${url} → ${status} (${duration}ms)`, { requestId });
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(error, "REQUEST", { requestId, method, url, duration });
    throw error;
  }
});

// ============================================================================
// Request ID Middleware
// ============================================================================

const requestIdMiddleware = createMiddleware().server(async ({ next, request }) => {
  // Generate or extract request ID
  const existingId = request.headers.get("x-request-id");
  const requestId = existingId || generateRequestId();

  // Attach to response headers
  const response = await next();
  const headers = (response as { headers?: Headers })?.headers;

  if (headers && typeof headers.set === "function") {
    headers.set("x-request-id", requestId);
  }

  return response;
});

// ============================================================================
// Environment Validation Middleware
// ============================================================================

const envValidationMiddleware = createMiddleware().server(async ({ next }) => {
  const requiredVars = ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SERVICE_ROLE_KEY"];
  const optionalVars = ["TELEGRAM_API_KEY", "Z_AI_API_KEY", "LOVABLE_API_KEY"];

  const missingRequired = requiredVars.filter((key) => !process.env[key]);
  const missingOptional = optionalVars.filter((key) => !process.env[key]);

  if (missingRequired.length > 0) {
    logError(new Error(`Missing required env vars: ${missingRequired.join(", ")}`), "ENV");

    if (process.env.NODE_ENV === "production") {
      return new Response(
        renderErrorPage({
          lang: "th",
          title: "ระบบกำลังอยู่ในระหว่างการปรับปรุง",
          message: "กรุณาลองใหม่อีกครั้งในภายหลัง",
        }),
        {
          status: 503,
          headers: { "content-type": ERROR_HTML_CONTENT_TYPE },
        },
      );
    }
  }

  if (missingOptional.length > 0 && process.env.NODE_ENV === "development") {
    logWarn(`Missing optional env vars: ${missingOptional.join(", ")}`);
  }

  return next();
});

// ============================================================================
// Performance Middleware
// ============================================================================

const performanceMiddleware = createMiddleware().server(async ({ next, request }) => {
  const startTime = Date.now();

  // Only track in development
  if (process.env.NODE_ENV !== "development") {
    return next();
  }

  const result = await next();
  const duration = Date.now() - startTime;

  if (duration > 500) {
    logWarn(`Performance warning: ${duration}ms`, {
      url: request.url,
      method: request.method,
    });
  }

  return result;
});

// ============================================================================
// Middleware Chain Helper
// ============================================================================

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [
    requestIdMiddleware,
    envValidationMiddleware,
    loggingMiddleware,
    performanceMiddleware,
    errorMiddleware, // error middleware should be last to catch errors from others
  ],
}));

// ============================================================================
// Utility Exports
// ============================================================================

export const getErrorMiddleware = () => errorMiddleware;
export const getLoggingMiddleware = () => loggingMiddleware;
export const getRequestIdMiddleware = () => requestIdMiddleware;
export const getPerformanceMiddleware = () => performanceMiddleware;

// ============================================================================
// Default Export
// ============================================================================

export default startInstance;
