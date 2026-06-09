import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ============================================================================
// Constants
// ============================================================================

const BUCKET = "program-images";
const SIGNED_URL_EXPIRES = 60 * 60 * 24 * 365 * 5; // 5 years
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const AI_MODELS = [
  "google/gemini-3.1-flash-image-preview",
  "google/gemini-2.5-flash-image",
  "google/gemini-3-pro-image-preview",
  "openai/gpt-image-2",
] as const;

type AIModel = (typeof AI_MODELS)[number];

// ============================================================================
// Helper Functions
// ============================================================================

function logImageAction(action: string, userId: string, details?: any) {
  console.log(`[ProgramImages:${action}] User: ${userId}`, {
    ...details,
    timestamp: new Date().toISOString(),
  });
}

function logImageError(action: string, userId: string, error: any) {
  console.error(`[ProgramImages:${action}] User: ${userId} Error:`, {
    message: error.message,
    timestamp: new Date().toISOString(),
  });
}

async function assertAdminOrStaff(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);

  const roles = (data ?? []).map((r: any) => r.role as string);
  if (!roles.includes("admin") && !roles.includes("staff")) {
    throw new Error("forbidden: admin or staff role required");
  }
  return roles;
}

function extFromMime(mime: string): string {
  const mimeMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/png": "png",
  };
  return mimeMap[mime] || "png";
}

function validateBase64(base64: string): void {
  if (!base64 || base64.length < 10) {
    throw new Error("Invalid image data: file is empty or corrupted");
  }

  // Check approximate size from base64 string
  const estimatedBytes = base64.length * 0.75;
  if (estimatedBytes > MAX_IMAGE_SIZE) {
    throw new Error(`Image too large: ${Math.round(estimatedBytes / 1024 / 1024)}MB (max 5MB)`);
  }
}

function validateMimeType(mime: string): void {
  if (!ALLOWED_MIME_TYPES.includes(mime)) {
    throw new Error(`Unsupported image type: ${mime}. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`);
  }
}

function generateFilename(prefix: string = "img", ext: string = "png"): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 10);
  return `${timestamp}-${prefix}-${random}.${ext}`;
}

// ============================================================================
// Upload Function
// ============================================================================

export const uploadProgramImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        base64: z.string().min(10),
        mime: z.string().default("image/png"),
        slug: z
          .string()
          .min(1)
          .max(100)
          .regex(/^[a-z0-9-]+$/),
        alt: z.string().max(300).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const startTime = Date.now();
    await assertAdminOrStaff(context.supabase, context.userId);

    logImageAction("upload_start", context.userId, { slug: data.slug, mime: data.mime });

    // Validate input
    validateBase64(data.base64);
    validateMimeType(data.mime);

    // Clean and decode base64
    const cleaned = data.base64.replace(/^data:[^;]+;base64,/, "");
    const buf = Buffer.from(cleaned, "base64");
    const ext = extFromMime(data.mime);
    const filename = generateFilename("upload", ext);
    const path = `${data.slug}/${filename}`;

    // Upload to Supabase Storage
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(path, buf, {
      contentType: data.mime,
      upsert: false,
      cacheControl: "31536000", // 1 year cache
    });

    if (upErr) {
      logImageError("upload", context.userId, upErr);
      throw new Error(`Upload failed: ${upErr.message}`);
    }

    // Generate signed URL
    const { data: signed, error: sErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_EXPIRES);

    if (sErr || !signed) {
      logImageError("sign_url", context.userId, sErr);
      throw new Error(sErr?.message ?? "Failed to generate signed URL");
    }

    const duration = Date.now() - startTime;
    logImageAction("upload_complete", context.userId, {
      path,
      size: buf.length,
      durationMs: duration,
    });

    return {
      success: true,
      path,
      url: signed.signedUrl,
      alt: data.alt ?? null,
      size: buf.length,
      mime: data.mime,
    };
  });

// ============================================================================
// AI Generation Function
// ============================================================================

export const generateProgramImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        prompt: z.string().min(3).max(2000),
        slug: z
          .string()
          .min(1)
          .max(100)
          .regex(/^[a-z0-9-]+$/),
        model: z.enum(AI_MODELS).default("google/gemini-3.1-flash-image-preview"),
        lang: z.enum(["th", "en"]).default("th"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const startTime = Date.now();
    await assertAdminOrStaff(context.supabase, context.userId);

    logImageAction("ai_generate_start", context.userId, {
      slug: data.slug,
      model: data.model,
      promptPreview: data.prompt.slice(0, 100),
    });

    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      throw new Error("LOVABLE_API_KEY not configured in environment");
    }

    const isGemini = data.model.startsWith("google/");

    // Build request body based on model type
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
          quality: "standard",
          n: 1,
        };

    // Call AI Gateway
    const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (res.status === 429) {
        throw new Error(
          data.lang === "th"
            ? "AI สร้างรูปไม่สำเร็จเนื่องจากจำกัดอัตราการใช้งาน กรุณาลองอีกครั้ง"
            : "AI rate limit exceeded, please try again later",
        );
      }
      if (res.status === 402) {
        throw new Error(
          data.lang === "th"
            ? "เครดิต AI หมด กรุณาติดต่อผู้ดูแลระบบ"
            : "AI credits exhausted, please contact administrator",
        );
      }
      throw new Error(`AI gateway error (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as { data?: Array<{ b64_json?: string }> };
    const b64 = json.data?.[0]?.b64_json;

    if (!b64) {
      throw new Error(
        data.lang === "th" ? "AI ไม่ส่งรูปกลับมา กรุณาลองใหม่อีกครั้ง" : "AI did not return an image, please try again",
      );
    }

    // Upload generated image
    const buf = Buffer.from(b64, "base64");
    const filename = generateFilename("ai", "png");
    const path = `${data.slug}/${filename}`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(path, buf, {
      contentType: "image/png",
      upsert: false,
      cacheControl: "31536000",
    });

    if (upErr) {
      logImageError("ai_upload", context.userId, upErr);
      throw new Error(`Upload failed: ${upErr.message}`);
    }

    // Generate signed URL
    const { data: signed, error: sErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_EXPIRES);

    if (sErr || !signed) {
      logImageError("ai_sign_url", context.userId, sErr);
      throw new Error(sErr?.message ?? "Failed to generate signed URL");
    }

    const duration = Date.now() - startTime;
    logImageAction("ai_generate_complete", context.userId, {
      path,
      size: buf.length,
      model: data.model,
      durationMs: duration,
    });

    return {
      success: true,
      path,
      url: signed.signedUrl,
      alt: data.prompt.slice(0, 120),
      size: buf.length,
      model: data.model,
      durationMs: duration,
    };
  });

// ============================================================================
// Delete Function
// ============================================================================

export const deleteProgramImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        path: z
          .string()
          .min(1)
          .max(500)
          .regex(/^[a-z0-9/_-]+\.(png|jpg|jpeg|webp|gif)$/i),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);

    logImageAction("delete_start", context.userId, { path: data.path });

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([data.path]);

    if (error) {
      logImageError("delete", context.userId, error);
      throw new Error(`Delete failed: ${error.message}`);
    }

    logImageAction("delete_complete", context.userId, { path: data.path });

    return {
      success: true,
      path: data.path,
    };
  });

// ============================================================================
// List Images Function
// ============================================================================

export const listProgramImages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        slug: z
          .string()
          .min(1)
          .max(100)
          .regex(/^[a-z0-9-]+$/),
        limit: z.number().int().min(1).max(50).default(20),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: files, error } = await supabaseAdmin.storage.from(BUCKET).list(data.slug, {
      limit: data.limit,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      logImageError("list", context.userId, error);
      throw new Error(`List failed: ${error.message}`);
    }

    // Generate signed URLs for each file
    const images = await Promise.all(
      (files ?? []).map(async (file) => {
        const path = `${data.slug}/${file.name}`;
        const { data: signed } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_EXPIRES);

        return {
          name: file.name,
          path,
          url: signed?.signedUrl ?? null,
          size: file.metadata?.size,
          created_at: file.created_at,
        };
      }),
    );

    logImageAction("list_complete", context.userId, {
      slug: data.slug,
      count: images.length,
    });

    return {
      success: true,
      images: images.filter((img) => img.url !== null),
    };
  });
