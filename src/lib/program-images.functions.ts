import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BUCKET = "program-images";
const SIGNED_URL_EXPIRES = 60 * 60 * 24 * 365 * 5; // 5 years

async function assertAdminOrStaff(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r: any) => r.role as string);
  if (!roles.includes("admin") && !roles.includes("staff")) {
    throw new Error("forbidden: admin or staff role required");
  }
}

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  return "png";
}

/** Upload a base64 image to storage and return {path, url}. */
export const uploadProgramImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        base64: z.string().min(10),
        mime: z.string().default("image/png"),
        slug: z.string().min(1).max(100).default("program"),
        alt: z.string().max(300).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const cleaned = data.base64.replace(/^data:[^;]+;base64,/, "");
    const buf = Buffer.from(cleaned, "base64");
    const ext = extFromMime(data.mime);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `${data.slug}/${filename}`;
    const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(path, buf, {
      contentType: data.mime,
      upsert: false,
    });
    if (upErr) throw new Error(upErr.message);
    const { data: signed, error: sErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_EXPIRES);
    if (sErr || !signed) throw new Error(sErr?.message ?? "failed to sign url");
    return { path, url: signed.signedUrl, alt: data.alt ?? null };
  });

/** Generate an image with Lovable AI Gateway, then upload to storage. */
export const generateProgramImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        prompt: z.string().min(3).max(2000),
        slug: z.string().min(1).max(100).default("program"),
        model: z
          .enum([
            "google/gemini-3.1-flash-image-preview",
            "google/gemini-2.5-flash-image",
            "google/gemini-3-pro-image-preview",
            "openai/gpt-image-2",
          ])
          .default("google/gemini-3.1-flash-image-preview"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY missing");

    const isGemini = data.model.startsWith("google/");
    const body = isGemini
      ? {
          model: data.model,
          messages: [{ role: "user", content: data.prompt }],
          modalities: ["image", "text"],
        }
      : {
          model: data.model,
          prompt: data.prompt,
          size: "1024x1024",
          quality: "low",
          n: 1,
        };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("AI rate limit – ลองใหม่อีกครั้ง");
      if (res.status === 402) throw new Error("Credits หมด – เติม credits ที่ Workspace");
      throw new Error(`AI gateway ${res.status}: ${t.slice(0, 200)}`);
    }
    const json = (await res.json()) as { data?: Array<{ b64_json?: string }> };
    const b64 = json.data?.[0]?.b64_json;
    if (!b64) throw new Error("AI ไม่ส่งรูปกลับมา");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const buf = Buffer.from(b64, "base64");
    const filename = `${Date.now()}-ai-${Math.random().toString(36).slice(2, 8)}.png`;
    const path = `${data.slug}/${filename}`;
    const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(path, buf, {
      contentType: "image/png",
      upsert: false,
    });
    if (upErr) throw new Error(upErr.message);
    const { data: signed, error: sErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_EXPIRES);
    if (sErr || !signed) throw new Error(sErr?.message ?? "failed to sign url");
    return { path, url: signed.signedUrl, alt: data.prompt.slice(0, 120) };
  });

/** Remove an image from storage. */
export const deleteProgramImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ path: z.string().min(1).max(500) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([data.path]);
    if (error) throw new Error(error.message);
    return { ok: true };
  });