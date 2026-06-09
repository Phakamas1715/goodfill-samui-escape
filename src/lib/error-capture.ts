// Captures the original Error out-of-band so server.ts can recover the stack
// when h3 has already swallowed the throw into a generic 500 Response.

// ============================================================================
// Types
// ============================================================================

interface CapturedError {
  error: unknown;
  at: number;
  url?: string;
  type: "error" | "unhandledrejection";
  id: string;
}

interface ErrorRecord {
  error: unknown;
  at: number;
  url?: string;
  type: "error" | "unhandledrejection";
  id: string;
}

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_TTL_MS = 5_000;
const MAX_STORED_ERRORS = 10;

let capturedErrors: CapturedError[] = [];
let ttlMs = DEFAULT_TTL_MS;

// ============================================================================
// Helper Functions
// ============================================================================

function generateErrorId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
}

function getRequestUrl(): string | undefined {
  if (typeof globalThis !== "undefined" && "location" in globalThis) {
    return (globalThis as any).location?.href;
  }
  return undefined;
}

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as any).message);
  }
  return String(error);
}

function extractErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) return error.stack;
  return undefined;
}

// ============================================================================
// Main Capture Functions
// ============================================================================

function record(error: unknown, type: "error" | "unhandledrejection" = "error"): void {
  const capturedError: CapturedError = {
    error,
    at: Date.now(),
    url: getRequestUrl(),
    type,
    id: generateErrorId(),
  };

  capturedErrors.unshift(capturedError);

  // Keep only the most recent errors
  if (capturedErrors.length > MAX_STORED_ERRORS) {
    capturedErrors = capturedErrors.slice(0, MAX_STORED_ERRORS);
  }

  // Log to console for debugging
  console.error(`[ErrorCapture] ${type}:`, extractErrorMessage(error));
}

// ============================================================================
// Global Event Listeners
// ============================================================================

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => {
    const error = (event as ErrorEvent).error ?? event;
    record(error, "error");
  });

  globalThis.addEventListener("unhandledrejection", (event) => {
    const reason = (event as PromiseRejectionEvent).reason;
    record(reason, "unhandledrejection");
  });
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Consumes and returns the most recent captured error.
 * Errors older than TTL will be ignored.
 */
export function consumeLastCapturedError(): unknown {
  if (capturedErrors.length === 0) return undefined;

  const latest = capturedErrors[0];
  if (Date.now() - latest.at > ttlMs) {
    capturedErrors = [];
    return undefined;
  }

  const { error } = latest;
  capturedErrors = capturedErrors.slice(1);
  return error;
}

/**
 * Returns all captured errors (for debugging).
 */
export function getAllCapturedErrors(): CapturedError[] {
  return [...capturedErrors];
}

/**
 * Returns the most recent captured error without consuming it.
 */
export function peekLastCapturedError(): CapturedError | undefined {
  if (capturedErrors.length === 0) return undefined;
  const latest = capturedErrors[0];
  if (Date.now() - latest.at > ttlMs) return undefined;
  return latest;
}

/**
 * Clears all captured errors.
 */
export function clearCapturedErrors(): void {
  capturedErrors = [];
}

/**
 * Sets the TTL for captured errors (milliseconds).
 */
export function setErrorTTL(ms: number): void {
  ttlMs = ms;
}

/**
 * Returns formatted error details for logging.
 */
export function getFormattedLastError(): string | null {
  const captured = peekLastCapturedError();
  if (!captured) return null;

  const message = extractErrorMessage(captured.error);
  const stack = extractErrorStack(captured.error);
  const timestamp = new Date(captured.at).toISOString();

  let output = `[${timestamp}] ${captured.type}: ${message}`;
  if (stack) {
    output += `\n${stack.split("\n").slice(0, 5).join("\n")}`;
  }
  if (captured.url) {
    output += `\nURL: ${captured.url}`;
  }

  return output;
}

/**
 * Attempts to recover error info from a generic response.
 * Useful when h3 returns a 500 with no details.
 */
export function tryRecoverFromResponse(response: Response): Error | null {
  const captured = peekLastCapturedError();
  if (!captured) return null;

  // Check if the error timestamp is recent enough
  if (Date.now() - captured.at > ttlMs) return null;

  // Reconstruct error
  if (captured.error instanceof Error) {
    return captured.error;
  }

  // Create a new error with captured info
  const message = extractErrorMessage(captured.error);
  const error = new Error(message);
  if (extractErrorStack(captured.error)) {
    error.stack = extractErrorStack(captured.error);
  }

  return error;
}

/**
 * Wraps an async function with error capture.
 * Useful for route handlers.
 */
export function withErrorCapture<T extends (...args: any[]) => any>(fn: T, context?: string): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      record(error, "error");
      if (context) {
        console.error(`[withErrorCapture:${context}]`, error);
      }
      throw error;
    }
  }) as T;
}

/**
 * Middleware for TanStack Router to capture errors
 */
export function errorCaptureMiddleware() {
  return async (ctx: any, next: () => Promise<any>) => {
    try {
      return await next();
    } catch (error) {
      record(error, "error");
      throw error;
    }
  };
}

// ============================================================================
// Express/Connect Style Middleware (if needed)
// ============================================================================

export function errorCaptureMiddlewareExpress() {
  return (err: any, req: any, res: any, next: any) => {
    record(err, "error");
    next(err);
  };
}

// ============================================================================
// Utility to check if error is likely from our capture
// ============================================================================

export function isCapturedError(error: unknown): boolean {
  if (!capturedErrors.length) return false;
  const latest = capturedErrors[0];
  if (Date.now() - latest.at > ttlMs) return false;

  const errorMsg = extractErrorMessage(error);
  const capturedMsg = extractErrorMessage(latest.error);

  return errorMsg === capturedMsg;
}

// ============================================================================
// Export default object for convenience
// ============================================================================

export default {
  consumeLastCapturedError,
  getAllCapturedErrors,
  peekLastCapturedError,
  clearCapturedErrors,
  setErrorTTL,
  getFormattedLastError,
  tryRecoverFromResponse,
  withErrorCapture,
  errorCaptureMiddleware,
  errorCaptureMiddlewareExpress,
  isCapturedError,
};
