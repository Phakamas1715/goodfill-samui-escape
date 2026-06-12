import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// ============================================================================
// Types
// ============================================================================

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

interface RequestContext {
  id: string;
  startTime: number;
  method: string;
  url: string;
  userAgent?: string;
  ip?: string;
}

interface HealthInfo {
  status: "ok" | "degraded" | "error";
  timestamp: string;
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  serverEntryLoaded: boolean;
  version?: string;
  environment?: string;
}

// ============================================================================
// Constants
// ============================================================================

const ERROR_HTML_CONTENT_TYPE = "text/html; charset=utf-8";
const JSON_CONTENT_TYPE = "application/json";
const VERSION = "1.0.0";

// ============================================================================
// Helper Functions
// ============================================================================

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
}

function getClientIp(request: Request): string | undefined {
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp;

  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) return xForwardedFor.split(",")[0].trim();

  return undefined;
}

function logRequest(context: RequestContext, status: number, durationMs: number): void {
  const logLevel = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
  const method = context.method.padEnd(7);
  const statusStr = String(status).padEnd(3);

  console[logLevel](
    `[${new Date().toISOString()}] ${method} ${context.url} → ${statusStr} (${durationMs}ms) [${context.id}]`,
  );
}

function logError(context: RequestContext | null, error: unknown, phase: string): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error(`[${new Date().toISOString()}] [ERROR:${phase}] ${context?.id || "no-context"}`, {
    url: context?.url,
    method: context?.method,
    ip: context?.ip,
    error: errorMessage,
    stack: errorStack?.slice(0, 500),
  });
}

async function isCatastrophicErrorResponse(response: Response): Promise<boolean> {
  if (response.status < 500) return false;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes(JSON_CONTENT_TYPE)) return false;

  try {
    const body = await response.clone().text();
    return body.includes('"unhandled":true') && body.includes('"message":"HTTPError"');
  } catch {
    return false;
  }
}

// ============================================================================
// Main Handler
// ============================================================================

let serverEntryPromise: Promise<ServerEntry> | undefined;
let serverEntryLoadTime: number | undefined;
let requestCount = 0;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryLoadTime = Date.now();
    serverEntryPromise = import("@tanstack/react-start/server-entry").then((m) => (m.default ?? m) as ServerEntry);
  }
  return serverEntryPromise;
}

async function normalizeCatastrophicSsrResponse(response: Response, context: RequestContext): Promise<Response> {
  const isCatastrophic = await isCatastrophicErrorResponse(response);

  if (!isCatastrophic) return response;

  const capturedError = consumeLastCapturedError();
  const errorToLog =
    capturedError instanceof Error
      ? capturedError
      : new Error(`h3 swallowed SSR error: ${await response.clone().text()}`);

  logError(context, errorToLog, "H3-CATASTROPHIC");

  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": ERROR_HTML_CONTENT_TYPE },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    requestCount++;

    const context: RequestContext = {
      id: generateRequestId(),
      startTime: Date.now(),
      method: request.method,
      url: request.url,
      userAgent: request.headers.get("user-agent") || undefined,
      ip: getClientIp(request),
    };

    // Log startup time on first request
    if (serverEntryLoadTime) {
      const startupDelay = Date.now() - serverEntryLoadTime;
      if (startupDelay > 100) {
        console.warn(`[ServerEntry] Slow server entry load: ${startupDelay}ms`);
      }
      serverEntryLoadTime = undefined;
    }

    try {
      // Handle health check requests
      const url = new URL(request.url);
      if (url.pathname === "/health" || (request.method === "HEAD" && url.pathname === "/health")) {
        const healthHandler = createHealthHandler();
        return await healthHandler(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalizedResponse = await normalizeCatastrophicSsrResponse(response, context);

      const duration = Date.now() - context.startTime;
      logRequest(context, normalizedResponse.status, duration);

      // Add custom headers
      normalizedResponse.headers.set("x-request-id", context.id);
      normalizedResponse.headers.set("x-response-time", `${duration}ms`);

      return normalizedResponse;
    } catch (error) {
      logError(context, error, "REQUEST-HANDLER");

      // Try to get captured error if available
      const capturedError = consumeLastCapturedError();
      if (capturedError) {
        logError(context, capturedError, "CAPTURED");
      }

      return new Response(renderErrorPage(), {
        status: 500,
        headers: {
          "content-type": ERROR_HTML_CONTENT_TYPE,
          "x-request-id": context.id,
        },
      });
    }
  },
};

// ============================================================================
// Health Check Endpoint (for monitoring)
// ============================================================================

export function createHealthHandler() {
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    const verbose = url.searchParams.get("verbose") === "true";

    const memory = process.memoryUsage();

    const healthInfo: HealthInfo = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: Math.round(memory.rss / 1024 / 1024),
        heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
        external: Math.round(memory.external / 1024 / 1024),
      },
      serverEntryLoaded: !!serverEntryPromise,
      version: VERSION,
      environment: process.env.NODE_ENV || "development",
    };

    // Check memory threshold
    if (healthInfo.memory.heapUsed > 500) {
      healthInfo.status = "degraded";
      console.warn(`[Health] High memory usage: ${healthInfo.memory.heapUsed}MB`);
    }

    if (verbose) {
      return new Response(JSON.stringify(healthInfo, null, 2), {
        status: 200,
        headers: {
          "content-type": JSON_CONTENT_TYPE,
          "cache-control": "no-cache",
        },
      });
    }

    // Simple response for load balancers
    if (healthInfo.status === "ok") {
      return new Response("OK", { status: 200 });
    }

    return new Response("Degraded", { status: 503 });
  };
}

// ============================================================================
// Graceful Shutdown Handler (for production)
// ============================================================================

let isShuttingDown = false;

export function setupGracefulShutdown() {
  const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`[Server] Received ${signal}, starting graceful shutdown...`);

    // Allow in-flight requests to complete (max 10 seconds)
    setTimeout(() => {
      console.log("[Server] Graceful shutdown complete");
      process.exit(0);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

// Auto-setup graceful shutdown in production
if (process.env.NODE_ENV === "production") {
  setupGracefulShutdown();
}
