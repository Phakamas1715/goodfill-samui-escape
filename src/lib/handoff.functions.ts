import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { tgSendMessage, tgEscape } from "@/lib/telegram.server";

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

async function linePush(token: string, to: string, messages: unknown[]) {
  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ to, messages }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false as const, status: res.status, error: text.slice(0, 500) };
  }
  return { ok: true as const };
}

function bulletBox(label: string, items: string[], color: string) {
  return {
    type: "box",
    layout: "vertical",
    spacing: "xs",
    margin: "md",
    contents: [
      { type: "text", text: label, size: "xs", color, weight: "bold" },
      ...items.slice(0, 4).map((s) => ({
        type: "text",
        text: `• ${s}`,
        size: "sm",
        color: "#0F3D2E",
        wrap: true,
      })),
    ],
  };
}

function personaFlex(d: z.infer<typeof HandoffInput>) {
  const body: any[] = [
    { type: "text", text: d.personaName, weight: "bold", size: "xl", wrap: true, color: "#0F3D2E" },
    d.personaThai
      ? { type: "text", text: d.personaThai, size: "sm", color: "#6B7280", margin: "xs" }
      : null,
    d.tagline
      ? { type: "text", text: d.tagline, size: "sm", color: "#0B4A3F", wrap: true, margin: "md" }
      : null,
    d.pillars.length
      ? {
          type: "box",
          layout: "horizontal",
          spacing: "xs",
          margin: "md",
          contents: d.pillars.slice(0, 4).map((p) => ({
            type: "box",
            layout: "vertical",
            backgroundColor: "#FAF6EC",
            cornerRadius: "8px",
            paddingAll: "6px",
            contents: [
              { type: "text", text: p, size: "xxs", color: "#0B4A3F", align: "center", weight: "bold", wrap: true },
            ],
          })),
        }
      : null,
    { type: "separator", margin: "lg" },
    d.summary
      ? { type: "text", text: d.summary, size: "sm", color: "#0F3D2E", wrap: true, margin: "md" }
      : null,
    d.strengths.length ? bulletBox("✨ จุดแข็ง", d.strengths, "#B07A1F") : null,
    d.focusAreas.length ? bulletBox("🎯 จุดที่ต้องโฟกัส", d.focusAreas, "#0B4A3F") : null,
    d.dailyRitual.length ? bulletBox("🌿 Ritual ประจำวัน", d.dailyRitual, "#0B4A3F") : null,
    d.avoid.length ? bulletBox("⚠️ ควรหลีกเลี่ยง", d.avoid, "#B53A2B") : null,
  ].filter(Boolean);

  const footer = d.recommended
    ? {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#B07A1F",
            action: {
              type: "uri",
              label: `จองแพ็กเกจ · ฿${d.recommended.price.toLocaleString()}`,
              uri: d.recommended.url,
            },
          },
          {
            type: "text",
            text: d.recommended.name,
            size: "xxs",
            color: "#6B7280",
            align: "center",
            wrap: true,
          },
        ],
      }
    : undefined;

  return {
    type: "flex",
    altText: `Wellness Persona — ${d.personaName}`,
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
          { type: "text", text: "Wellness Persona ของคุณ", size: "lg", color: "#FFFFFF", weight: "bold", margin: "sm" },
        ],
      },
      body: { type: "box", layout: "vertical", spacing: "sm", contents: body },
      footer,
    },
  };
}

function buildTelegramText(d: z.infer<typeof HandoffInput>): string {
  const lines: string[] = [];
  lines.push(`🌿 <b>Wellness Persona ของคุณ</b>`);
  lines.push(`<b>${tgEscape(d.personaName)}</b>${d.personaThai ? ` · ${tgEscape(d.personaThai)}` : ""}`);
  if (d.tagline) lines.push(`<i>${tgEscape(d.tagline)}</i>`);
  if (d.pillars.length) lines.push(`\n🪷 ${d.pillars.map(tgEscape).join(" · ")}`);
  if (d.summary) lines.push(`\n${tgEscape(d.summary)}`);
  const block = (label: string, items: string[]) => {
    if (!items.length) return;
    lines.push(`\n<b>${label}</b>`);
    items.slice(0, 4).forEach((s) => lines.push(`• ${tgEscape(s)}`));
  };
  block("✨ จุดแข็ง", d.strengths);
  block("🎯 จุดที่ต้องโฟกัส", d.focusAreas);
  block("🌿 Ritual ประจำวัน", d.dailyRitual);
  block("⚠️ ควรหลีกเลี่ยง", d.avoid);
  if (d.recommended) {
    lines.push(`\n🎁 <b>แพ็กเกจที่แนะนำ</b>`);
    lines.push(`${tgEscape(d.recommended.name)} — ฿${d.recommended.price.toLocaleString()}`);
    lines.push(d.recommended.url);
  }
  return lines.join("\n");
}

export const sendPersonaSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => HandoffInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Resolve linked channels for the authenticated user.
    const { data: lineRow } = await supabaseAdmin
      .from("line_identities")
      .select("line_user_id")
      .eq("user_id", context.userId)
      .eq("channel", "customer")
      .maybeSingle();
    const { data: tgRow } = await supabaseAdmin
      .from("telegram_identities")
      .select("chat_id")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    type PushResult = { ok: boolean; status?: number; error?: string };
    let line: PushResult = { ok: false, error: "not linked" };
    let telegram: PushResult = { ok: false, error: "not linked" };

    const lineTo = lineRow?.line_user_id as string | undefined;
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (lineToken && lineTo) {
      try {
        line = await linePush(lineToken, lineTo, [personaFlex(data)]);
      } catch (e) {
        line = { ok: false, error: e instanceof Error ? e.message.slice(0, 300) : String(e) };
      }
    } else if (!lineToken) {
      line = { ok: false, error: "LINE channel not configured" };
    }

    const tgChatId = tgRow?.chat_id as number | undefined;
    if (tgChatId && process.env.TELEGRAM_API_KEY && process.env.LOVABLE_API_KEY) {
      try {
        await tgSendMessage(tgChatId, buildTelegramText(data), { parse_mode: "HTML" });
        telegram = { ok: true };
      } catch (e) {
        telegram = { ok: false, error: e instanceof Error ? e.message.slice(0, 300) : String(e) };
      }
    }

    return { line, telegram, anyOk: line.ok || telegram.ok };
  });