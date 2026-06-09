/**
 * Telegram Bot API helpers via Lovable connector gateway.
 * Server-only — never import from client code.
 */

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

function getKeys() {
  const lovable = process.env.LOVABLE_API_KEY;
  const tg = process.env.TELEGRAM_API_KEY;
  if (!lovable || !tg) throw new Error("TELEGRAM_API_KEY / LOVABLE_API_KEY not configured");
  return { lovable, tg };
}

async function tgCall<T = any>(method: string, body: Record<string, unknown>): Promise<T> {
  const { lovable, tg } = getKeys();
  const res = await fetch(`${GATEWAY_URL}/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovable}`,
      "X-Connection-Api-Key": tg,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as any;
  if (!res.ok || json?.ok === false) {
    throw new Error(`Telegram ${method} ${res.status}: ${JSON.stringify(json).slice(0, 300)}`);
  }
  return json.result as T;
}

export async function tgSendMessage(chatId: number | string, text: string, opts: { parse_mode?: "HTML" | "MarkdownV2"; reply_markup?: unknown } = {}) {
  return tgCall("sendMessage", { chat_id: chatId, text, ...opts });
}

export async function tgSetWebhook(url: string, secretToken: string) {
  return tgCall("setWebhook", {
    url,
    secret_token: secretToken,
    allowed_updates: ["message", "edited_message", "callback_query"],
  });
}

export async function tgGetWebhookInfo() {
  return tgCall("getWebhookInfo", {});
}

/** Derive a stable webhook secret from the connection key. */
export function deriveTelegramWebhookSecret(): string {
  const { createHash } = require("crypto") as typeof import("crypto");
  const { tg } = getKeys();
  return createHash("sha256").update(`telegram-webhook:${tg}`).digest("base64url");
}

/** HTML-escape text for Telegram. */
export function tgEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}