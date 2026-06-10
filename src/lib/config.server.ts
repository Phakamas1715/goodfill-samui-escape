import process from "node:process";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = process.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

// ============================================================================
// Environment Variables Validation
// ============================================================================

export interface ServerConfig {
  // App Environment
  nodeEnv: string;
  isProduction: boolean;
  isDevelopment: boolean;
  appUrl: string;

  // Supabase
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;

  // LINE Integration
  lineChannelAccessToken: string;
  lineChannelSecret: string;
  partnerLineChannelAccessToken: string;
  partnerLineChannelSecret: string;
  lineCustomerUserId?: string;
  linePartnerUserId?: string;

  // Telegram Integration
  telegramApiKey?: string;
  lovableApiKey?: string;

  // AI / Z.AI
  zAiApiKey?: string;

  // LIFF
  liffId: string;
  partnerLiffId: string;

  // Storage / Upload
  storageBucket?: string;
  maxUploadSizeMb: number;

  // Features
  enableAiFeatures: boolean;
  enableTelegram: boolean;
}

// ============================================================================
// Validation Helpers
// ============================================================================

function requireEnvVar(name: string, required: boolean = true): string {
  const value = process.env[name];
  if (required && !value) {
    console.error(`[ServerConfig] Missing required environment variable: ${name}`);
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || "";
}

function optionalEnvVar(name: string): string | undefined {
  return process.env[name] || undefined;
}

function parseBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
  if (value === undefined) return defaultValue;
  return value === "true" || value === "1" || value === "yes";
}

function parseNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// ============================================================================
// Main Config Function
// ============================================================================

export function getServerConfig(): ServerConfig {
  const nodeEnv = process.env.NODE_ENV || "development";
  const isProduction = nodeEnv === "production";
  const isDevelopment = nodeEnv === "development" || nodeEnv === "dev";

  return {
    // App Environment
    nodeEnv,
    isProduction,
    isDevelopment,
    appUrl:
      process.env.APP_URL ||
      (isDevelopment ? "http://localhost:5173" : "https://goodfillcare-samui.com"),

    // Supabase
    supabaseUrl: requireEnvVar("SUPABASE_URL"),
    supabaseAnonKey: requireEnvVar("SUPABASE_PUBLISHABLE_KEY"),
    supabaseServiceRoleKey: requireEnvVar("SUPABASE_SERVICE_ROLE_KEY"),

    // LINE Integration
    lineChannelAccessToken: requireEnvVar("LINE_CHANNEL_ACCESS_TOKEN"),
    lineChannelSecret: requireEnvVar("LINE_CHANNEL_SECRET"),
    partnerLineChannelAccessToken: requireEnvVar("PARTNER_LINE_CHANNEL_ACCESS_TOKEN"),
    partnerLineChannelSecret: requireEnvVar("PARTNER_LINE_CHANNEL_SECRET"),
    lineCustomerUserId: optionalEnvVar("LINE_CUSTOMER_USER_ID"),
    linePartnerUserId: optionalEnvVar("LINE_PARTNER_USER_ID"),

    // Telegram Integration
    telegramApiKey: optionalEnvVar("TELEGRAM_API_KEY"),
    lovableApiKey: optionalEnvVar("LOVABLE_API_KEY"),

    // AI / Z.AI
    zAiApiKey: optionalEnvVar("Z_AI_API_KEY"),

    // LIFF
    liffId: requireEnvVar("VITE_LIFF_ID"),
    partnerLiffId: requireEnvVar("VITE_PARTNER_LIFF_ID"),

    // Storage / Upload
    storageBucket: optionalEnvVar("STORAGE_BUCKET") || "program-images",
    maxUploadSizeMb: parseNumber(process.env.MAX_UPLOAD_SIZE_MB, 5),

    // Features
    enableAiFeatures: parseBoolean(process.env.ENABLE_AI_FEATURES, true),
    enableTelegram: parseBoolean(process.env.ENABLE_TELEGRAM, true),
  };
}

// ============================================================================
// Feature Flag Helpers
// ============================================================================

export function isAiEnabled(): boolean {
  const config = getServerConfig();
  return config.enableAiFeatures && !!config.zAiApiKey;
}

export function isTelegramEnabled(): boolean {
  const config = getServerConfig();
  return config.enableTelegram && !!config.telegramApiKey && !!config.lovableApiKey;
}

export function getLineChannels() {
  const config = getServerConfig();
  return {
    customer: {
      accessToken: config.lineChannelAccessToken,
      secret: config.lineChannelSecret,
      userId: config.lineCustomerUserId,
    },
    partner: {
      accessToken: config.partnerLineChannelAccessToken,
      secret: config.partnerLineChannelSecret,
      userId: config.linePartnerUserId,
    },
  };
}

// ============================================================================
// Helper for checking if required services are configured
// ============================================================================

export function getServiceStatus() {
  const config = getServerConfig();

  return {
    supabase: {
      configured: !!config.supabaseUrl && !!config.supabaseServiceRoleKey,
      message: "Supabase configured",
    },
    lineCustomer: {
      configured: !!config.lineChannelAccessToken && !!config.lineChannelSecret,
      message: config.lineChannelAccessToken
        ? "LINE Customer OA configured"
        : "Missing LINE Customer OA credentials",
    },
    linePartner: {
      configured: !!config.partnerLineChannelAccessToken && !!config.partnerLineChannelSecret,
      message: config.partnerLineChannelAccessToken
        ? "LINE Partner OA configured"
        : "Missing LINE Partner OA credentials",
    },
    telegram: {
      configured: config.enableTelegram && !!config.telegramApiKey && !!config.lovableApiKey,
      message: isTelegramEnabled()
        ? "Telegram bot configured"
        : "Telegram not configured or disabled",
    },
    ai: {
      configured: config.enableAiFeatures && !!config.zAiApiKey,
      message: isAiEnabled() ? "AI features enabled" : "AI features disabled or missing API key",
    },
    liff: {
      configured: !!config.liffId && !!config.partnerLiffId,
      message: "LIFF configured",
    },
  };
}

// ============================================================================
// Environment validation on server start
// ============================================================================

let validationPerformed = false;

export function validateServerConfig(): { valid: boolean; errors: string[]; warnings: string[] } {
  if (validationPerformed) {
    // Return cached result
    return { valid: true, errors: [], warnings: [] };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Required for app to function
  const requiredVars = [
    "SUPABASE_URL",
    "SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "LINE_CHANNEL_ACCESS_TOKEN",
    "LINE_CHANNEL_SECRET",
    "PARTNER_LINE_CHANNEL_ACCESS_TOKEN",
    "PARTNER_LINE_CHANNEL_SECRET",
    "VITE_LIFF_ID",
    "VITE_PARTNER_LIFF_ID",
  ];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      errors.push(`Missing required env var: ${varName}`);
    }
  }

  // Optional but recommended
  if (!process.env.Z_AI_API_KEY) {
    warnings.push("Z_AI_API_KEY not set — AI features will be disabled");
  }

  if (!process.env.TELEGRAM_API_KEY || !process.env.LOVABLE_API_KEY) {
    warnings.push("Telegram credentials not set — Telegram notifications disabled");
  }

  if (!process.env.LINE_CUSTOMER_USER_ID) {
    warnings.push("LINE_CUSTOMER_USER_ID not set — will attempt to fetch from database");
  }

  validationPerformed = true;

  if (errors.length > 0) {
    console.error("[ServerConfig] Validation failed:", errors);
  }
  if (warnings.length > 0) {
    console.warn("[ServerConfig] Warnings:", warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// Auto-validate on server start (non-blocking)
if (typeof process !== "undefined" && process.env.NODE_ENV !== "development") {
  // Only log in production, skip in dev to avoid noise
  const result = validateServerConfig();
  if (!result.valid) {
    console.error("[ServerConfig] Server configuration has errors:", result.errors);
  }
}

// ============================================================================
// Export default for convenience
// ============================================================================

export default {
  getServerConfig,
  getLineChannels,
  getServiceStatus,
  validateServerConfig,
  isAiEnabled,
  isTelegramEnabled,
};
