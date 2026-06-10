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
}

// ============================================================================
// Constants
// ============================================================================

const ERROR_HTML_CONTENT_TYPE = "text/html; charset=utf-8";
const JSON_CONTENT_TYPE = "application/json";

// ============================================================================
// Helper Functions
// ============================================================================

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
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
    error: errorMessage,
    stack: errorStack?.slice(0, 500),
  });
}

function isCatastrophicErrorResponse(response: Response): Promise<boolean> {
  if (response.status < 500) return Promise.resolve(false);

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes(JSON_CONTENT_TYPE)) return Promise.resolve(false);

  return response
    .clone()
    .text()
    .then((body) => {
      return body.includes('"unhandled":true') && body.includes('"message":"HTTPError"');
    });
}

// ============================================================================
// Main Handler
// ============================================================================

let serverEntryPromise: Promise<ServerEntry> | undefined;
let serverEntryLoadTime: number | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryLoadTime = Date.now();
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

async function normalizeCatastrophicSsrResponse(
  response: Response,
  context: RequestContext,
): Promise<Response> {
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
    const context: RequestContext = {
      id: generateRequestId(),
      startTime: Date.now(),
      method: request.method,
      url: request.url,
      userAgent: request.headers.get("user-agent") || undefined,
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
      // Handle warmup requests
      if (request.method === "HEAD" && request.url.includes("/health")) {
        return new Response("OK", { status: 200 });
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalizedResponse = await normalizeCatastrophicSsrResponse(response, context);

      const duration = Date.now() - context.startTime;
      logRequest(context, normalizedResponse.status, duration);

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
        headers: { "content-type": ERROR_HTML_CONTENT_TYPE },
      });
    }
  },
};

// ============================================================================
// Health Check Endpoint (for monitoring)
// ============================================================================

export function createHealthHandler() {
  return async (request: Request): Promise<Response> => {
    const healthInfo = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      serverEntryLoaded: !!serverEntryPromise,
    };

    return new Response(JSON.stringify(healthInfo, null, 2), {
      status: 200,
      headers: { "content-type": JSON_CONTENT_TYPE },
    });
  };
}
