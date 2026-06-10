import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * LINE Rich Menu setup — admin only.
 * Generates an AI image, creates the rich menu, uploads the image,
 * and sets it as the default for all users of the channel.
 */

const SITE = "https://goodfillcare-samui.com";

// ============================================================================
// Types & Constants
// ============================================================================

const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB
const MIN_WIDTH = 800;
const MAX_WIDTH = 2500;
const MIN_HEIGHT = 250;
const MAX_HEIGHT = 1686;

const PROMPTS = {
  customer: {
    th:
      "แบนเนอร์ Rich Menu แบบ 3 ช่อง สำหรับแบรนด์ wellness 'Goodfill Care' บนเกาะสมุย " +
      "โทนสีครีมอ่อนและเขียวมรกต เสริมด้วยสีทอง หรูหราแบบมินิมอล " +
      "ช่องซ้าย: ไอคอนโปรแกรม wellness พร้อมข้อความภาษาไทย 'โปรแกรม' " +
      "ช่องกลาง: ไอคอนปฏิทินกับใบปาล์ม ข้อความ 'My Journey' " +
      "ช่องขวา: ไอคอนคลิปบอร์ดเครื่องหมายถูก ข้อความ 'สถานะ' " +
      "ภาพประกอบแนวเรียบหรู ระยะห่างสมดุล ไม่มีข้อความเพิ่มเติม",
    en:
      "Wide banner 3-panel rich menu for a wellness retreat brand 'Goodfill Care' on Koh Samui. " +
      "Soft cream and emerald palette, gold accents, minimal luxury. " +
      "Left panel: tropical wellness program icon with Thai label โปรแกรม. " +
      "Middle panel: calendar with palm leaf, label My Journey. " +
      "Right panel: clipboard checkmark, label สถานะ. " +
      "Flat editorial illustration, generous padding, balanced composition, no extra text.",
  },
  partner: {
    th:
      "แบนเนอร์ Rich Menu แบบ 3 ช่อง สำหรับ 'Goodfill Care Partner' (ผู้เชี่ยวชาญ wellness) " +
      "โทนสีน้ำเงินเข้มและทอง ดูเป็นมืออาชีพมินิมอล " +
      "ช่องซ้าย: ไอคอนรายการงาน ข้อความภาษาไทย 'งานวันนี้' " +
      "ช่องกลาง: ไอคอนกราฟ/ข้อมูล ข้อความ 'ภาพรวม' " +
      "ช่องขวา: ไอคอนแชท ข้อความ 'ช่วยเหลือ' " +
      "ภาพประกอบแนวเรียบหรู องค์ประกอบสมดุล ไม่มีข้อความเพิ่มเติม",
    en:
      "Wide banner 3-panel rich menu for 'Goodfill Care Partner' (wellness experts). " +
      "Deep navy and gold palette, professional minimal. " +
      "Left panel: tasks/checklist icon, Thai label งานวันนี้. " +
      "Middle panel: chart/analytics icon, label ภาพรวม. " +
      "Right panel: chat bubble, label ช่วยเหลือ. " +
      "Flat editorial illustration, balanced composition, no extra text.",
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

function logRichMenuAction(action: string, channel: string, details?: any) {
  console.log(`[RichMenu:${action}] Channel: ${channel}`, {
    ...details,
    timestamp: new Date().toISOString(),
  });
}

function logRichMenuError(action: string, channel: string, error: any) {
  console.error(`[RichMenu:${action}] Channel: ${channel} Error:`, {
    message: error.message,
    timestamp: new Date().toISOString(),
  });
}

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);

  const roles = (data ?? []).map((r: any) => r.role as string);
  if (!roles.includes("admin")) {
    throw new Error("forbidden: admin role required");
  }
  return roles;
}

/** Read width/height from a PNG buffer header. */
function readPngSize(buf: Buffer): { width: number; height: number } {
  if (buf.length < 24) throw new Error("Not a valid PNG file");

  const signature = buf.toString("hex", 0, 8);
  if (signature !== "89504e470d0a1a0a") {
    throw new Error("File is not a PNG image");
  }

  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);

  return { width, height };
}

function validateImageSize(width: number, height: number, bytes: number): void {
  if (width < MIN_WIDTH || width > MAX_WIDTH) {
    throw new Error(`Image width must be between ${MIN_WIDTH} and ${MAX_WIDTH}px, got ${width}px`);
  }
  if (height < MIN_HEIGHT || height > MAX_HEIGHT) {
    throw new Error(
      `Image height must be between ${MIN_HEIGHT} and ${MAX_HEIGHT}px, got ${height}px`,
    );
  }
  if (bytes > MAX_IMAGE_SIZE) {
    throw new Error(`Image too large: ${bytes} bytes (max ${MAX_IMAGE_SIZE / 1024}KB)`);
  }
}

// ============================================================================
// LINE API Helpers
// ============================================================================

async function lineApi(
  token: string,
  path: string,
  init: RequestInit & { body?: any } = {},
): Promise<any> {
  const res = await fetch(`https://api.line.me${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`LINE API ${path} ${res.status}: ${text.slice(0, 300)}`);
  }

  return text ? JSON.parse(text) : {};
}

async function lineUploadRichMenuImage(
  token: string,
  richMenuId: string,
  image: Buffer,
): Promise<void> {
  const arr = image.buffer.slice(
    image.byteOffset,
    image.byteOffset + image.byteLength,
  ) as ArrayBuffer;
  const body = new Blob([arr], { type: "image/png" });

  const res = await fetch(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "image/png",
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`LINE upload image ${res.status}: ${text.slice(0, 300)}`);
  }
}

async function lineDeleteExistingDefault(token: string): Promise<void> {
  try {
    await fetch("https://api.line.me/v2/bot/user/all/richmenu", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // Best-effort, ignore errors
  }
}

async function aiGenerateImage(prompt: string, lang: "th" | "en" = "en"): Promise<Buffer> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) {
    throw new Error("LOVABLE_API_KEY not configured");
  }

  const selectedPrompt =
    lang === "th" ? prompt : PROMPTS[prompt as keyof typeof PROMPTS]?.en || prompt;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-image-preview",
      messages: [{ role: "user", content: selectedPrompt }],
      modalities: ["image", "text"],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("AI rate limit exceeded, please try again later");
    if (res.status === 402) throw new Error("AI credits exhausted");
    throw new Error(`AI gateway error (${res.status}): ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as { data?: Array<{ b64_json?: string }> };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("AI did not return an image");
  }

  return Buffer.from(b64, "base64");
}

// ============================================================================
// Rich Menu Payload Builder
// ============================================================================

function buildRichMenuPayload(
  width: number,
  height: number,
  channel: "customer" | "partner",
  lang: "th" | "en" = "th",
) {
  const colW = Math.floor(width / 3);
  const isThai = lang === "th";

  if (channel === "partner") {
    return {
      size: { width, height },
      selected: true,
      name: "Goodfill Care · Partner Menu",
      chatBarText: isThai ? "พาร์ทเนอร์" : "Partner",
      areas: [
        {
          bounds: { x: 0, y: 0, width: colW, height },
          action: {
            type: "uri",
            label: isThai ? "งานวันนี้" : "Today's Tasks",
            uri: `${SITE}/admin/bookings`,
          },
        },
        {
          bounds: { x: colW, y: 0, width: colW, height },
          action: { type: "uri", label: isThai ? "ภาพรวม" : "Overview", uri: `${SITE}/admin` },
        },
        {
          bounds: { x: colW * 2, y: 0, width: width - colW * 2, height },
          action: {
            type: "message",
            label: isThai ? "ช่วยเหลือ" : "Help",
            text: isThai ? "ช่วยเหลือ" : "help",
          },
        },
      ],
    };
  }

  // Customer menu
  return {
    size: { width, height },
    selected: true,
    name: "Goodfill Care · Customer Menu",
    chatBarText: isThai ? "เมนู" : "Menu",
    areas: [
      {
        bounds: { x: 0, y: 0, width: colW, height },
        action: { type: "uri", label: isThai ? "โปรแกรม" : "Programs", uri: `${SITE}/programs` },
      },
      {
        bounds: { x: colW, y: 0, width: colW, height },
        action: { type: "uri", label: "Journey", uri: `${SITE}/journey` },
      },
      {
        bounds: { x: colW * 2, y: 0, width: width - colW * 2, height },
        action: {
          type: "message",
          label: isThai ? "สถานะ" : "Status",
          text: isThai ? "สถานะ" : "status",
        },
      },
    ],
  };
}

// ============================================================================
// Server Functions
// ============================================================================

export const setupLineRichMenu = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        channel: z.enum(["customer", "partner"]),
        lang: z.enum(["th", "en"]).optional().default("th"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const startTime = Date.now();
    await assertAdmin(context.supabase, context.userId);

    logRichMenuAction("start", data.channel, { lang: data.lang });

    const token =
      data.channel === "partner"
        ? process.env.PARTNER_LINE_CHANNEL_ACCESS_TOKEN
        : process.env.LINE_CHANNEL_ACCESS_TOKEN;

    if (!token) {
      throw new Error(`Missing ${data.channel} LINE channel access token`);
    }

    // 1. Generate image
    let image: Buffer;
    try {
      image = await aiGenerateImage(data.channel, data.lang);
      logRichMenuAction("image_generated", data.channel, { bytes: image.length });
    } catch (error) {
      logRichMenuError("image_generation", data.channel, error);
      throw new Error(
        `Failed to generate image: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    // 2. Validate image
    const { width, height } = readPngSize(image);
    validateImageSize(width, height, image.length);

    logRichMenuAction("image_validated", data.channel, { width, height });

    // 3. Create rich menu
    let richMenuId: string;
    try {
      const payload = buildRichMenuPayload(width, height, data.channel, data.lang);
      const created = (await lineApi(token, "/v2/bot/richmenu", {
        method: "POST",
        body: JSON.stringify(payload),
      })) as { richMenuId: string };
      richMenuId = created.richMenuId;
      logRichMenuAction("menu_created", data.channel, { richMenuId });
    } catch (error) {
      logRichMenuError("menu_creation", data.channel, error);
      throw new Error(
        `Failed to create rich menu: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    // 4. Upload image
    try {
      await lineUploadRichMenuImage(token, richMenuId, image);
      logRichMenuAction("image_uploaded", data.channel, { richMenuId });
    } catch (error) {
      logRichMenuError("image_upload", data.channel, error);
      // Try to cleanup the created menu
      await lineApi(token, `/v2/bot/richmenu/${richMenuId}`, { method: "DELETE" }).catch(() => {});
      throw new Error(
        `Failed to upload image: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    // 5. Set as default
    try {
      await lineDeleteExistingDefault(token);
      await lineApi(token, `/v2/bot/user/all/richmenu/${richMenuId}`, { method: "POST" });
      logRichMenuAction("default_set", data.channel, { richMenuId });
    } catch (error) {
      logRichMenuError("set_default", data.channel, error);
      // Non-critical, menu is created but not default
    }

    const duration = Date.now() - startTime;
    logRichMenuAction("complete", data.channel, { richMenuId, durationMs: duration });

    return {
      ok: true,
      richMenuId,
      size: { width, height },
      bytes: image.length,
      durationMs: duration,
    };
  });

export const listLineRichMenus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ channel: z.enum(["customer", "partner"]) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const token =
      data.channel === "partner"
        ? process.env.PARTNER_LINE_CHANNEL_ACCESS_TOKEN
        : process.env.LINE_CHANNEL_ACCESS_TOKEN;

    if (!token) {
      throw new Error(`Missing ${data.channel} LINE channel access token`);
    }

    try {
      const res = (await lineApi(token, "/v2/bot/richmenu/list", { method: "GET" })) as {
        richmenus?: Array<{ richMenuId: string; name: string; chatBarText: string }>;
      };

      const menus = res.richmenus ?? [];
      logRichMenuAction("list", data.channel, { count: menus.length });

      return menus;
    } catch (error) {
      logRichMenuError("list", data.channel, error);
      throw new Error(
        `Failed to list rich menus: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
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

    if (!token) {
      throw new Error(`Missing ${data.channel} LINE channel access token`);
    }

    logRichMenuAction("delete_start", data.channel, { richMenuId: data.richMenuId });

    try {
      await lineApi(token, `/v2/bot/richmenu/${data.richMenuId}`, { method: "DELETE" });
      logRichMenuAction("delete_complete", data.channel, { richMenuId: data.richMenuId });
      return { ok: true };
    } catch (error) {
      logRichMenuError("delete", data.channel, error);
      throw new Error(
        `Failed to delete rich menu: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });
