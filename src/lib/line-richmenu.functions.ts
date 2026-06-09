import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * LINE Rich Menu setup — admin only.
 * Generates an AI image, creates the rich menu, uploads the image,
 * and sets it as the default for all users of the channel.
 */

const SITE = "https://goodfillcare-samui.com";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r: any) => r.role as string);
  if (!roles.includes("admin")) throw new Error("forbidden: admin role required");
}

/** Read width/height from a PNG buffer header. */
function readPngSize(buf: Buffer): { width: number; height: number } {
  // PNG signature 8 bytes, then IHDR chunk: length(4) + "IHDR"(4) + width(4) + height(4)
  if (buf.length < 24) throw new Error("not a PNG");
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

async function aiGenerateImage(prompt: string): Promise<Buffer> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-image-preview",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("AI rate limit");
    if (res.status === 402) throw new Error("Credits หมด");
    throw new Error(`AI gateway ${res.status}: ${t.slice(0, 200)}`);
  }
  const json = (await res.json()) as { data?: Array<{ b64_json?: string }> };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("AI ไม่ส่งรูปกลับมา");
  return Buffer.from(b64, "base64");
}

async function lineApi(token: string, path: string, init: RequestInit & { body?: any } = {}) {
  const res = await fetch(`https://api.line.me${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`LINE ${path} ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

async function lineUploadRichMenuImage(token: string, richMenuId: string, image: Buffer) {
  // Image upload uses the data-api host
  const body = new Uint8Array(image.buffer, image.byteOffset, image.byteLength);
  const res = await fetch(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "image/png",
    },
    body,
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`LINE upload image ${res.status}: ${t.slice(0, 300)}`);
  }
}

async function lineDeleteExistingDefault(token: string) {
  // Best-effort: ignore errors
  await fetch("https://api.line.me/v2/bot/user/all/richmenu", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {});
}

function buildRichMenuPayload(
  width: number,
  height: number,
  channel: "customer" | "partner",
) {
  // 3 vertical strips
  const colW = Math.floor(width / 3);
  const customer = {
    size: { width, height },
    selected: true,
    name: "Goodfill Care · Customer Menu",
    chatBarText: "เมนู",
    areas: [
      {
        bounds: { x: 0, y: 0, width: colW, height },
        action: { type: "uri", label: "โปรแกรม", uri: `${SITE}/programs` },
      },
      {
        bounds: { x: colW, y: 0, width: colW, height },
        action: { type: "uri", label: "Journey", uri: `${SITE}/journey` },
      },
      {
        bounds: { x: colW * 2, y: 0, width: width - colW * 2, height },
        action: { type: "message", label: "สถานะ", text: "สถานะ" },
      },
    ],
  };
  const partner = {
    size: { width, height },
    selected: true,
    name: "Goodfill Care · Partner Menu",
    chatBarText: "Partner",
    areas: [
      {
        bounds: { x: 0, y: 0, width: colW, height },
        action: { type: "uri", label: "งานวันนี้", uri: `${SITE}/admin/bookings` },
      },
      {
        bounds: { x: colW, y: 0, width: colW, height },
        action: { type: "uri", label: "ภาพรวม", uri: `${SITE}/admin` },
      },
      {
        bounds: { x: colW * 2, y: 0, width: width - colW * 2, height },
        action: { type: "message", label: "ช่วยเหลือ", text: "help" },
      },
    ],
  };
  return channel === "partner" ? partner : customer;
}

const PROMPTS = {
  customer:
    "Wide banner 3-panel rich menu for a wellness retreat brand 'Goodfill Care' on Koh Samui. " +
    "Soft cream and emerald palette, gold accents, minimal luxury. " +
    "Left panel: tropical wellness program icon with Thai label โปรแกรม. " +
    "Middle panel: calendar with palm leaf, label My Journey. " +
    "Right panel: clipboard checkmark, label สถานะ. " +
    "Flat editorial illustration, generous padding, balanced composition, no extra text.",
  partner:
    "Wide banner 3-panel rich menu for 'Goodfill Care Partner' (wellness experts). " +
    "Deep navy and gold palette, professional minimal. " +
    "Left panel: tasks/checklist icon, Thai label งานวันนี้. " +
    "Middle panel: chart/analytics icon, label ภาพรวม. " +
    "Right panel: chat bubble, label ช่วยเหลือ. " +
    "Flat editorial illustration, balanced composition, no extra text.",
};

export const setupLineRichMenu = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ channel: z.enum(["customer", "partner"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const token =
      data.channel === "partner"
        ? process.env.PARTNER_LINE_CHANNEL_ACCESS_TOKEN
        : process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (!token) throw new Error(`Missing ${data.channel} LINE access token`);

    // 1. Generate image
    const image = await aiGenerateImage(PROMPTS[data.channel]);
    const { width, height } = readPngSize(image);
    if (width < 800 || width > 2500 || height < 250 || height > 1686) {
      throw new Error(`Image size out of LINE bounds: ${width}x${height}`);
    }
    if (image.length > 1024 * 1024) {
      throw new Error(`Image too large: ${image.length} bytes (max 1MB)`);
    }

    // 2. Create rich menu
    const payload = buildRichMenuPayload(width, height, data.channel);
    const created = (await lineApi(token, "/v2/bot/richmenu", {
      method: "POST",
      body: JSON.stringify(payload),
    })) as { richMenuId: string };

    // 3. Upload image
    await lineUploadRichMenuImage(token, created.richMenuId, image);

    // 4. Clear previous default + set new default
    await lineDeleteExistingDefault(token);
    await lineApi(token, `/v2/bot/user/all/richmenu/${created.richMenuId}`, {
      method: "POST",
    });

    return {
      ok: true,
      richMenuId: created.richMenuId,
      size: { width, height },
      bytes: image.length,
    };
  });

export const listLineRichMenus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ channel: z.enum(["customer", "partner"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const token =
      data.channel === "partner"
        ? process.env.PARTNER_LINE_CHANNEL_ACCESS_TOKEN
        : process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (!token) throw new Error(`Missing ${data.channel} LINE access token`);
    const res = (await lineApi(token, "/v2/bot/richmenu/list", { method: "GET" })) as {
      richmenus?: Array<{ richMenuId: string; name: string; chatBarText: string }>;
    };
    return res.richmenus ?? [];
  });

export const deleteLineRichMenu = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        channel: z.enum(["customer", "partner"]),
        richMenuId: z.string().min(1).max(200),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const token =
      data.channel === "partner"
        ? process.env.PARTNER_LINE_CHANNEL_ACCESS_TOKEN
        : process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (!token) throw new Error(`Missing ${data.channel} LINE access token`);
    await lineApi(token, `/v2/bot/richmenu/${data.richMenuId}`, { method: "DELETE" });
    return { ok: true };
  });