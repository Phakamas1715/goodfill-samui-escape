/**
 * Telegram Bot API helpers via Lovable connector gateway.
 * Server-only — never import from client code.
 */

import { createHash } from "crypto";

// ============================================================================
// Constants & Types
// ============================================================================

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";
const DEFAULT_PARSE_MODE = "HTML" as const;
const MAX_MESSAGE_LENGTH = 4096;

export type ParseMode = "HTML" | "MarkdownV2";
export type ChatAction =
  | "typing"
  | "upload_photo"
  | "record_video"
  | "upload_video"
  | "record_audio"
  | "upload_audio"
  | "upload_document"
  | "find_location"
  | "record_video_note"
  | "upload_video_note";

export interface TelegramMessage {
  message_id: number;
  from?: {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
  chat: {
    id: number;
    type: string;
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  date: number;
  text?: string;
  reply_markup?: unknown;
}

export interface TelegramWebhookInfo {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
  max_connections?: number;
  allowed_updates?: string[];
}

export interface SendMessageOptions {
  parse_mode?: ParseMode;
  reply_markup?: {
    inline_keyboard: Array<
      Array<{
        text: string;
        url?: string;
        callback_data?: string;
        switch_inline_query?: string;
      }>
    >;
  };
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  reply_to_message_id?: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getKeys() {
  const lovable = process.env.LOVABLE_API_KEY;
  const tg = process.env.TELEGRAM_API_KEY;

  if (!lovable) {
    throw new Error("LOVABLE_API_KEY not configured in environment");
  }
  if (!tg) {
    throw new Error("TELEGRAM_API_KEY not configured in environment");
  }

  return { lovable, tg };
}

async function tgCall<T = any>(method: string, body: Record<string, unknown>): Promise<T> {
  const startTime = Date.now();
  const { lovable, tg } = getKeys();

  try {
    const res = await fetch(`${GATEWAY_URL}/${method}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovable}`,
        "X-Connection-Api-Key": tg,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await res.text();
    let json: any;

    try {
      json = JSON.parse(responseText);
    } catch {
      json = { ok: false, error: responseText.slice(0, 200) };
    }

    if (!res.ok || json?.ok === false) {
      const errorMsg = `Telegram ${method} failed (${res.status}): ${JSON.stringify(json).slice(0, 300)}`;
      console.error(`[Telegram] ${errorMsg}`, { body, duration: Date.now() - startTime });
      throw new Error(errorMsg);
    }

    const duration = Date.now() - startTime;
    if (duration > 1000) {
      console.warn(`[Telegram] ${method} took ${duration}ms`, { body });
    }

    return json.result as T;
  } catch (error) {
    console.error(`[Telegram] ${method} error:`, error);
    throw error;
  }
}

function chunkMessage(text: string, maxLength: number = MAX_MESSAGE_LENGTH): string[] {
  if (text.length <= maxLength) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let chunk = remaining.slice(0, maxLength);
    // Try to break at a newline or space
    const lastNewline = chunk.lastIndexOf("\n");
    const lastSpace = chunk.lastIndexOf(" ");
    const breakPoint = Math.max(lastNewline, lastSpace);

    if (breakPoint > maxLength * 0.8) {
      chunk = remaining.slice(0, breakPoint);
      remaining = remaining.slice(breakPoint + 1);
    } else {
      remaining = remaining.slice(maxLength);
    }

    chunks.push(chunk);
  }

  return chunks;
}

// ============================================================================
// Main API Functions
// ============================================================================

export async function tgSendMessage(
  chatId: number | string,
  text: string,
  options: SendMessageOptions = {},
): Promise<TelegramMessage> {
  if (!text || text.trim().length === 0) {
    throw new Error("Message text cannot be empty");
  }

  const chunks = chunkMessage(text);

  if (chunks.length === 1) {
    return tgCall<TelegramMessage>("sendMessage", {
      chat_id: chatId,
      text: chunks[0],
      parse_mode: options.parse_mode || DEFAULT_PARSE_MODE,
      reply_markup: options.reply_markup,
      disable_web_page_preview: options.disable_web_page_preview,
      disable_notification: options.disable_notification,
      reply_to_message_id: options.reply_to_message_id,
    });
  }

  // Send multiple messages for long text
  let lastMessage: TelegramMessage | null = null;
  for (let i = 0; i < chunks.length; i++) {
    const isLast = i === chunks.length - 1;
    const chunkText = isLast ? chunks[i] : `${chunks[i]} (${i + 1}/${chunks.length})`;

    lastMessage = await tgCall<TelegramMessage>("sendMessage", {
      chat_id: chatId,
      text: chunkText,
      parse_mode: options.parse_mode || DEFAULT_PARSE_MODE,
      reply_markup: isLast ? options.reply_markup : undefined,
      disable_web_page_preview: options.disable_web_page_preview,
      disable_notification: options.disable_notification,
    });
  }

  return lastMessage!;
}

export async function tgSendPhoto(
  chatId: number | string,
  photo: string | Buffer,
  caption?: string,
  options: Partial<SendMessageOptions> = {},
): Promise<any> {
  const { lovable, tg } = getKeys();

  let photoData: string;
  if (Buffer.isBuffer(photo)) {
    photoData = photo.toString("base64");
  } else if (photo.startsWith("http")) {
    photoData = photo;
  } else {
    photoData = photo;
  }

  const res = await fetch(`${GATEWAY_URL}/sendPhoto`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovable}`,
      "X-Connection-Api-Key": tg,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      photo: photoData,
      caption,
      parse_mode: options.parse_mode || DEFAULT_PARSE_MODE,
      reply_markup: options.reply_markup,
    }),
  });

  const json = await res.json();
  if (!res.ok || json?.ok === false) {
    throw new Error(`Telegram sendPhoto failed: ${JSON.stringify(json).slice(0, 200)}`);
  }

  return json.result;
}

export async function tgSendChatAction(chatId: number | string, action: ChatAction): Promise<boolean> {
  try {
    await tgCall("sendChatAction", {
      chat_id: chatId,
      action,
    });
    return true;
  } catch {
    return false;
  }
}

export async function tgSetWebhook(url: string, secretToken?: string): Promise<boolean> {
  const result = await tgCall<{ ok: boolean }>("setWebhook", {
    url,
    secret_token: secretToken,
    allowed_updates: ["message", "edited_message", "callback_query"],
  });
  return result?.ok === true;
}

export async function tgDeleteWebhook(): Promise<boolean> {
  const result = await tgCall<{ ok: boolean }>("deleteWebhook", {});
  return result?.ok === true;
}

export async function tgGetWebhookInfo(): Promise<TelegramWebhookInfo | null> {
  try {
    return await tgCall<TelegramWebhookInfo>("getWebhookInfo", {});
  } catch {
    return null;
  }
}

export async function tgGetMe(): Promise<{ id: number; username: string; first_name: string }> {
  return tgCall("getMe", {});
}

export async function tgSendMessageToAll(
  userIds: (number | string)[],
  text: string,
  options: SendMessageOptions = {},
): Promise<{ success: number; failed: number; errors: Error[] }> {
  const results = await Promise.allSettled(
    userIds.map(async (userId) => {
      await tgSendMessage(userId, text, options);
      return userId;
    }),
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;
  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => r.reason as Error);

  return {
    success: succeeded,
    failed,
    errors,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

export function deriveTelegramWebhookSecret(): string {
  const { tg } = getKeys();
  return createHash("sha256").update(`telegram-webhook:${tg}`).digest("base64url");
}

export function tgEscape(s: string): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function tgEscapeMarkdown(s: string): string {
  // Escape special characters for MarkdownV2
  const specialChars = /[_*\[\]()~`>#+\-=|{}.!]/g;
  return s.replace(specialChars, (match) => `\\${match}`);
}

export function formatNumber(n: number): string {
  return n.toLocaleString();
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  tgSendMessage,
  tgSendPhoto,
  tgSendChatAction,
  tgSetWebhook,
  tgDeleteWebhook,
  tgGetWebhookInfo,
  tgGetMe,
  tgSendMessageToAll,
  deriveTelegramWebhookSecret,
  tgEscape,
  tgEscapeMarkdown,
  formatNumber,
  formatDate,
};
