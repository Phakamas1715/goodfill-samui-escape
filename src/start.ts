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

// ============================================================================
// Constants
// ============================================================================

const ERROR_HTML_CONTENT_TYPE = "text/html; charset=utf-8";

// ============================================================================
// Helper Functions
// ============================================================================

function logError(error: unknown, context: string): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error(`[Start:${context}]`, {
    message: errorMessage,
    stack: errorStack?.slice(0, 500),
    timestamp: new Date().toISOString(),
  });
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
      ("statusCode" in error && (error.statusCode === 301 || error.statusCode === 302))
    );
  }
  return false;
}

// ============================================================================
// Error Middleware
// ============================================================================

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  const startTime = Date.now();

  try {
    const result = await next();
    const duration = Date.now() - startTime;

    // Log slow requests in development
    if (process.env.NODE_ENV === "development" && duration > 1000) {
      console.warn(`[Start] Slow request: ${duration}ms`);
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    // Handle redirect errors - rethrow to let router handle
    if (isRedirectError(error)) {
      if (process.env.NODE_ENV === "development") {
        console.debug(`[Start] Redirect error (${duration}ms):`, error);
      }
      throw error;
    }

    // Handle known status code errors
    const statusCode = getStatusCode(error);
    if (statusCode !== 500) {
      logError(error, `HTTP-${statusCode}`);
      throw error;
    }

    // Log the error
    logError(error, "UNHANDLED");

    // Try to get captured error from global handlers
    const capturedError = consumeLastCapturedError();
    if (capturedError) {
      logError(capturedError, "CAPTURED");
    }

    // Return user-friendly error page for 500s
    return new Response(
      renderErrorPage({
        lang: "th",
        showDetails: process.env.NODE_ENV === "development",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      }),
      {
        status: 500,
        headers: { "content-type": ERROR_HTML_CONTENT_TYPE },
      },
    );
  }
});

// ============================================================================
// Logging Middleware (optional)
// ============================================================================

const loggingMiddleware = createMiddleware().server(async ({ next, request }) => {
  const startTime = Date.now();
  const method = request.method;
  const url = request.url;

  try {
    const result = await next();
    const duration = Date.now() - startTime;

    console.info(
      `[Start] ${method} ${url} → ${(result as { status?: number })?.status || "completed"} (${duration}ms)`,
    );

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Start] ${method} ${url} → ERROR (${duration}ms)`, error);
    throw error;
  }
});

// ============================================================================
// Request ID Middleware
// ============================================================================

const requestIdMiddleware = createMiddleware().server(async ({ next, request }) => {
  // Generate or extract request ID
  const existingId = request.headers.get("x-request-id");
  const requestId = existingId || `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

  // Attach to response headers
  const response = await next();
  const headers = (response as { headers?: Headers } | undefined)?.headers;

  if (headers && typeof headers.set === "function") {
    headers.set("x-request-id", requestId);
  }

  return response;
});

// ============================================================================
// Environment Validation Middleware
// ============================================================================

const envValidationMiddleware = createMiddleware().server(async ({ next }) => {
  // Validate critical environment variables on first request
  const requiredVars = ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SERVICE_ROLE_KEY"];

  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    console.error("[Start] Missing required environment variables:", missingVars);

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

    // In development, show error but continue
    console.warn("[Start] Development mode: continuing despite missing env vars");
  }

  return next();
});

// ============================================================================
// Middleware Chain Helper
// ============================================================================

export const startInstance = createStart(() => ({
  // Order matters: auth middleware first, then validation, then error handling
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [
    requestIdMiddleware,
    envValidationMiddleware,
    loggingMiddleware,
    errorMiddleware,
  ],
}));

// ============================================================================
// Utility Exports
// ============================================================================

export const getErrorMiddleware = () => errorMiddleware;
export const getLoggingMiddleware = () => loggingMiddleware;
export const getRequestIdMiddleware = () => requestIdMiddleware;

// ============================================================================
// Default Export
// ============================================================================

export default startInstance;
