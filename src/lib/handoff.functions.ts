import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { tgSendMessage, tgEscape } from "@/lib/telegram.server";

// ============================================================================
// Types & Schemas
// ============================================================================

const HandoffInput = z.object({
  personaId: z.string().min(1).max(80),
  personaName: z.string().min(1).max(160),
  personaThai: z.string().max(160).optional().default(""),
  tagline: z.string().max(240).optional().default(""),
  pillars: z.array(z.string().min(1).max(80)).max(8).optional().default([]),
  summary: z.string().max(1200).optional().default(""),
  strengths: z.array(z.string().min(1).max(160)).max(6).optional().default([]),
  focusAreas: z.array(z.string().min(1).max(160)).max(6).optional().default([]),
  dailyRitual: z.array(z.string().min(1).max(160)).max(6).optional().default([]),
  avoid: z.array(z.string().min(1).max(160)).max(6).optional().default([]),
  recommended: z
    .object({
      id: z.string().min(1).max(80),
      name: z.string().min(1).max(160),
      price: z.number().min(0).max(10_000_000),
      url: z.string().url().max(500),
    })
    .optional(),
  lang: z.enum(["th", "en"]).optional().default("th"),
});

type HandoffData = z.infer<typeof HandoffInput>;

interface PushResult {
  ok: boolean;
  status?: number;
  error?: string;
  channel?: string;
}

// ============================================================================
// Label Constants (Multi-language)
// ============================================================================

const getLabels = (lang: "th" | "en") => ({
  headerTitle: lang === "th" ? "Wellness Persona ของคุณ" : "Your Wellness Persona",
  strengthsLabel: lang === "th" ? "✨ จุดแข็ง" : "✨ Strengths",
  focusLabel: lang === "th" ? "🎯 จุดที่ต้องโฟกัส" : "🎯 Focus Areas",
  ritualLabel: lang === "th" ? "🌿 Ritual ประจำวัน" : "🌿 Daily Rituals",
  avoidLabel: lang === "th" ? "⚠️ ควรหลีกเลี่ยง" : "⚠️ Things to Avoid",
  bookButton: lang === "th" ? "จองแพ็กเกจ" : "Book Package",
  recommendedLabel: lang === "th" ? "แพ็กเกจที่แนะนำ" : "Recommended Package",
});

// ============================================================================
// Helper Functions
// ============================================================================

function logHandoffAction(action: string, userId: string, details?: any) {
  console.log(`[PersonaHandoff:${action}] User: ${userId}`, {
    ...details,
    timestamp: new Date().toISOString(),
  });
}

function logHandoffError(action: string, userId: string, error: any) {
  console.error(`[PersonaHandoff:${action}] User: ${userId} Error:`, {
    message: error.message,
    timestamp: new Date().toISOString(),
  });
}

async function linePush(token: string, to: string, messages: unknown[]): Promise<PushResult> {
  try {
    const res = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ to, messages }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, status: res.status, error: text.slice(0, 500), channel: "line" };
    }
    return { ok: true, channel: "line" };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      channel: "line",
    };
  }
}

// ============================================================================
// Flex Message Builders
// ============================================================================

function bulletBox(label: string, items: string[], color: string, maxItems: number = 4) {
  if (!items.length) return null;

  return {
    type: "box",
    layout: "vertical",
    spacing: "xs",
    margin: "md",
    contents: [
      { type: "text", text: label, size: "xs", color, weight: "bold" },
      ...items.slice(0, maxItems).map((s) => ({
        type: "text",
        text: `• ${s}`,
        size: "sm",
        color: "#0F3D2E",
        wrap: true,
      })),
    ],
  };
}

function pillarBadges(pillars: string[], maxItems: number = 4) {
  if (!pillars.length) return null;

  return {
    type: "box",
    layout: "horizontal",
    spacing: "xs",
    margin: "md",
    contents: pillars.slice(0, maxItems).map((p) => ({
      type: "box",
      layout: "vertical",
      backgroundColor: "#FAF6EC",
      cornerRadius: "8px",
      paddingAll: "6px",
      flex: 1,
      contents: [
        {
          type: "text",
          text: p,
          size: "xxs",
          color: "#0B4A3F",
          align: "center",
          weight: "bold",
          wrap: true,
        },
      ],
    })),
  };
}

function personaFlex(data: HandoffData): any {
  const labels = getLabels(data.lang);
  const isThai = data.lang === "th";

  const bodyContents: any[] = [
    { type: "text", text: data.personaName, weight: "bold", size: "xl", wrap: true, color: "#0F3D2E" },
  ];

  if (data.personaThai) {
    bodyContents.push({
      type: "text",
      text: data.personaThai,
      size: "sm",
      color: "#6B7280",
      margin: "xs",
    });
  }

  if (data.tagline) {
    bodyContents.push({
      type: "text",
      text: data.tagline,
      size: "sm",
      color: "#0B4A3F",
      wrap: true,
      margin: "md",
    });
  }

  const badges = pillarBadges(data.pillars);
  if (badges) bodyContents.push(badges);

  bodyContents.push({ type: "separator", margin: "lg" });

  if (data.summary) {
    bodyContents.push({
      type: "text",
      text: data.summary,
      size: "sm",
      color: "#0F3D2E",
      wrap: true,
      margin: "md",
    });
  }

  const strengthsBox = bulletBox(labels.strengthsLabel, data.strengths, "#B07A1F");
  if (strengthsBox) bodyContents.push(strengthsBox);

  const focusBox = bulletBox(labels.focusLabel, data.focusAreas, "#0B4A3F");
  if (focusBox) bodyContents.push(focusBox);

  const ritualBox = bulletBox(labels.ritualLabel, data.dailyRitual, "#0B4A3F");
  if (ritualBox) bodyContents.push(ritualBox);

  const avoidBox = bulletBox(labels.avoidLabel, data.avoid, "#B53A2B");
  if (avoidBox) bodyContents.push(avoidBox);

  const footerContents: any[] = [];

  if (data.recommended) {
    const buttonLabel = `${labels.bookButton} · ฿${data.recommended.price.toLocaleString()}`;
    footerContents.push({
      type: "button",
      style: "primary",
      color: "#B07A1F",
      action: {
        type: "uri",
        label: buttonLabel,
        uri: data.recommended.url,
      },
    });
    footerContents.push({
      type: "text",
      text: data.recommended.name,
      size: "xxs",
      color: "#6B7280",
      align: "center",
      wrap: true,
      margin: "xs",
    });
  }

  return {
    type: "flex",
    altText: `${labels.headerTitle} — ${data.personaName}`,
    contents: {
      type: "bubble",
      size: "mega",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#0F3D2E",
        paddingAll: "20px",
        contents: [
          { type: "text", text: "GOODFILL CARE", size: "xs", color: "#F4E4BC", weight: "bold" },
          {
            type: "text",
            text: labels.headerTitle,
            size: "lg",
            color: "#FFFFFF",
            weight: "bold",
            margin: "sm",
          },
        ],
      },
      body: { type: "box", layout: "vertical", spacing: "sm", contents: bodyContents },
      footer: footerContents.length
        ? { type: "box", layout: "vertical", spacing: "sm", contents: footerContents }
        : undefined,
    },
  };
}

// ============================================================================
// Telegram Message Builder
// ============================================================================

function buildTelegramText(data: HandoffData): string {
  const isThai = data.lang === "th";
  const labels = getLabels(data.lang);

  const lines: string[] = [];

  // Header
  lines.push(`🌿 <b>${labels.headerTitle}</b>`);
  lines.push(`<b>${tgEscape(data.personaName)}</b>${data.personaThai ? ` · ${tgEscape(data.personaThai)}` : ""}`);

  if (data.tagline) {
    lines.push(`<i>${tgEscape(data.tagline)}</i>`);
  }

  if (data.pillars.length) {
    lines.push(`\n🪷 ${data.pillars.map(tgEscape).join(" · ")}`);
  }

  if (data.summary) {
    lines.push(`\n${tgEscape(data.summary)}`);
  }

  // Helper to add section
  const addSection = (label: string, items: string[]) => {
    if (!items.length) return;
    lines.push(`\n<b>${label}</b>`);
    items.slice(0, 4).forEach((s) => lines.push(`• ${tgEscape(s)}`));
  };

  addSection(labels.strengthsLabel, data.strengths);
  addSection(labels.focusLabel, data.focusAreas);
  addSection(labels.ritualLabel, data.dailyRitual);
  addSection(labels.avoidLabel, data.avoid);

  if (data.recommended) {
    lines.push(`\n🎁 <b>${labels.recommendedLabel}</b>`);
    lines.push(`${tgEscape(data.recommended.name)} — ฿${data.recommended.price.toLocaleString()}`);
    lines.push(data.recommended.url);
  }

  return lines.join("\n");
}

// ============================================================================
// Main Server Function
// ============================================================================

export const sendPersonaSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => HandoffInput.parse(input))
  .handler(async ({ data, context }) => {
    const startTime = Date.now();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    logHandoffAction("start", context.userId, { personaId: data.personaId, lang: data.lang });

    // Resolve linked channels for the authenticated user
    const [lineResult, tgResult] = await Promise.all([
      supabaseAdmin
        .from("line_identities")
        .select("line_user_id")
        .eq("user_id", context.userId)
        .eq("channel", "customer")
        .maybeSingle(),
      supabaseAdmin
        .from("telegram_identities")
        .select("chat_id")
        .eq("user_id", context.userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const lineTo = lineResult.data?.line_user_id as string | undefined;
    const tgChatId = tgResult.data?.chat_id as number | undefined;

    // Send to LINE
    let lineResultPush: PushResult = { ok: false, error: "Not linked", channel: "line" };
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

    if (lineToken && lineTo) {
      try {
        lineResultPush = await linePush(lineToken, lineTo, [personaFlex(data)]);
        logHandoffAction("line", context.userId, { ok: lineResultPush.ok, to: lineTo });
      } catch (error) {
        lineResultPush = { ok: false, error: error instanceof Error ? error.message : String(error), channel: "line" };
        logHandoffError("line", context.userId, error);
      }
    } else if (!lineToken) {
      lineResultPush = { ok: false, error: "LINE channel not configured", channel: "line" };
      logHandoffError("line", context.userId, lineResultPush);
    }

    // Send to Telegram
    let tgResultPush: PushResult = { ok: false, error: "Not linked", channel: "telegram" };
    const tgApiKey = process.env.TELEGRAM_API_KEY;
    const lovableKey = process.env.LOVABLE_API_KEY;

    if (tgChatId && tgApiKey && lovableKey) {
      try {
        await tgSendMessage(tgChatId, buildTelegramText(data), { parse_mode: "HTML" });
        tgResultPush = { ok: true, channel: "telegram" };
        logHandoffAction("telegram", context.userId, { ok: true, chatId: tgChatId });
      } catch (error) {
        tgResultPush = {
          ok: false,
          error: error instanceof Error ? error.message : String(error),
          channel: "telegram",
        };
        logHandoffError("telegram", context.userId, error);
      }
    } else if (!tgApiKey || !lovableKey) {
      tgResultPush = { ok: false, error: "Telegram not configured", channel: "telegram" };
    }

    const duration = Date.now() - startTime;
    logHandoffAction("complete", context.userId, {
      durationMs: duration,
      lineOk: lineResultPush.ok,
      telegramOk: tgResultPush.ok,
    });

    return {
      line: lineResultPush,
      telegram: tgResultPush,
      anyOk: lineResultPush.ok || tgResultPush.ok,
      durationMs: duration,
    };
  });
