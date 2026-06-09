import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";

type LineEvent = {
  type: string;
  replyToken?: string;
  source?: { userId?: string; type?: string };
  message?: { type: string; text?: string };
  postback?: { data: string };
  timestamp?: number;
};

function verifySignature(secret: string, rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("base64");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

async function lineReply(token: string, replyToken: string, messages: unknown[]) {
  try {
    const res = await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ replyToken, messages }),
    });
    if (!res.ok) {
      console.error("[partner-webhook] reply failed", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[partner-webhook] reply error:", err);
  }
}

function parsePostback(data: string): { action?: string; id?: string; lang?: string } {
  const out: Record<string, string> = {};
  for (const part of data.split("&")) {
    const [k, v] = part.split("=");
    if (k) out[k] = decodeURIComponent(v ?? "");
  }
  return out;
}

const STATUS_LABEL: Record<string, { th: string; en: string }> = {
  accepted: { th: "รับงานแล้ว ✓", en: "Accepted ✓" },
  rejected: { th: "ปฏิเสธงาน", en: "Rejected" },
  completed: { th: "เสร็จสิ้นงาน ✓", en: "Completed ✓" },
  pending: { th: "รอตรวจสอบ", en: "Pending" },
};

function getUserLanguage(userId: string): Promise<string> {
  // Could fetch from database or default to English
  // For now, default to English for international partners
  return Promise.resolve("en");
}

function getStatusText(status: string, lang: string): string {
  const label = STATUS_LABEL[status];
  if (!label) return status;
  return lang === "th" ? label.th : label.en;
}

async function updateBookingStatus(
  supabaseAdmin: any,
  id: string,
  status: string,
  partnerUserId: string,
  lang: string,
): Promise<{ success: boolean; bookingCode?: string; programName?: string; error?: string }> {
  try {
    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .update({
        status,
        partner_response: {
          last_action: status,
          actor_line_user_id: partnerUserId,
          responded_at: new Date().toISOString(),
        },
      })
      .eq("id", id)
      .eq("partner_line_user_id", partnerUserId)
      .select("booking_code, program_name")
      .maybeSingle();

    if (error || !row) {
      return { success: false, error: error?.message || "Booking not found" };
    }
    return { success: true, bookingCode: row.booking_code, programName: row.program_name };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

async function addMealNote(
  supabaseAdmin: any,
  bookingCode: string,
  note: string,
  partnerUserId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const { data: row } = await supabaseAdmin
      .from("bookings")
      .select("id, booking_code, meal_plan, partner_line_user_id")
      .eq("booking_code", bookingCode)
      .eq("partner_line_user_id", partnerUserId)
      .maybeSingle();

    if (!row) {
      return { success: false, message: `ไม่พบการจอง ${bookingCode} หรือไม่ได้รับอนุญาต` };
    }

    const prev = Array.isArray(row.meal_plan) ? (row.meal_plan as string[]) : [];
    const stamp = new Date().toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" });
    const updated = [...prev, `[Chef ${stamp}] ${note}`];

    await supabaseAdmin.from("bookings").update({ meal_plan: updated }).eq("id", row.id);
    return { success: true, message: `อัปเดตแผนอาหารแล้ว: ${bookingCode}` };
  } catch (err) {
    return { success: false, message: String(err) };
  }
}

async function addPartnerNote(supabaseAdmin: any, target: any, note: string): Promise<boolean> {
  try {
    const stamp = new Date().toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" });
    const appended = `${target.partner_notes ? target.partner_notes + "\n" : ""}[${stamp}] ${note}`;
    await supabaseAdmin.from("bookings").update({ partner_notes: appended }).eq("id", target.id);
    return true;
  } catch (err) {
    console.error("Failed to add partner note:", err);
    return false;
  }
}

async function handleEvent(event: LineEvent) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const partnerToken = process.env.PARTNER_LINE_CHANNEL_ACCESS_TOKEN!;
  const partnerUserId = event.source?.userId;

  if (!partnerToken) {
    console.error("[partner-webhook] Missing PARTNER_LINE_CHANNEL_ACCESS_TOKEN");
    return;
  }

  // Postback button → update booking status
  if (event.type === "postback" && event.postback?.data) {
    const { action, id, lang = "en" } = parsePostback(event.postback.data);
    if (!action || !id) return;

    const statusMap: Record<string, string> = {
      accept: "accepted",
      reject: "rejected",
      complete: "completed",
    };
    const status = statusMap[action];
    if (!status) return;

    if (!partnerUserId) return;

    // Verify ownership before mutating
    const { data: target } = await supabaseAdmin
      .from("bookings")
      .select("id, partner_line_user_id")
      .eq("booking_code", id)
      .maybeSingle();

    if (!target || target.partner_line_user_id !== partnerUserId) {
      if (event.replyToken) {
        const errorMsg =
          lang === "th" ? `ไม่ได้รับอนุญาตให้จัดการการจอง ${id}` : `Unauthorized to manage booking ${id}`;
        await lineReply(partnerToken, event.replyToken, [{ type: "text", text: errorMsg }]);
      }
      return;
    }

    const result = await updateBookingStatus(supabaseAdmin, target.id, status, partnerUserId, lang);

    if (event.replyToken) {
      if (!result.success) {
        const errorMsg =
          lang === "th" ? `ไม่พบการจอง ${id} หรืออัปเดตไม่สำเร็จ` : `Booking ${id} not found or update failed`;
        await lineReply(partnerToken, event.replyToken, [{ type: "text", text: errorMsg }]);
      } else {
        const statusText = getStatusText(status, lang);
        const replyMsg =
          lang === "th"
            ? `บันทึกแล้ว: ${result.bookingCode} · ${result.programName}\nสถานะ: ${statusText}\n\nพิมพ์ข้อความเพื่อบันทึกเป็นโน้ตของการจองนี้`
            : `Updated: ${result.bookingCode} · ${result.programName}\nStatus: ${statusText}\n\nType a message to add a note to this booking`;
        await lineReply(partnerToken, event.replyToken, [{ type: "text", text: replyMsg }]);
      }
    }
    return;
  }

  // Text message → append as note to the latest booking handled by this partner
  if (event.type === "message" && event.message?.type === "text" && event.message.text) {
    const text = event.message.text.trim();
    if (!text) return;

    // Detect language from message content (simple detection)
    const hasThai = /[ก-๙]/.test(text);
    const lang = hasThai ? "th" : "en";

    // Meal-plan edit command: "GF-XXXX meal: เปลี่ยน Day 2 dinner เป็น..."
    const mealMatch = text.match(/^(GF-[A-Z0-9]+)\s+meal\s*[:：-]\s*(.+)$/i);
    if (mealMatch) {
      const code = mealMatch[1].toUpperCase();
      const line = mealMatch[2].trim();
      if (!partnerUserId) return;

      const result = await addMealNote(supabaseAdmin, code, line, partnerUserId);

      if (event.replyToken) {
        if (!result.success) {
          await lineReply(partnerToken, event.replyToken, [{ type: "text", text: result.message }]);
        } else {
          const replyMsg = lang === "th" ? `${result.message}\n+ ${line}` : `${result.message}\n+ ${line}`;
          await lineReply(partnerToken, event.replyToken, [{ type: "text", text: replyMsg }]);
        }
      }
      return;
    }

    // Optional: explicit booking ref like "GF-XXXX: note"
    const refMatch = text.match(/^(GF-[A-Z0-9]+)\s*[:：-]\s*(.+)$/i);
    let bookingCode: string | null = null;
    let note = text;
    if (refMatch) {
      bookingCode = refMatch[1].toUpperCase();
      note = refMatch[2].trim();
    }

    let query = supabaseAdmin
      .from("bookings")
      .select("id, booking_code, program_name, partner_notes")
      .order("created_at", { ascending: false })
      .limit(1);

    if (!partnerUserId) return;
    query = query.eq("partner_line_user_id", partnerUserId);
    if (bookingCode) query = query.eq("booking_code", bookingCode);

    const { data: rows } = await query;
    const target = rows?.[0];

    if (!target) {
      if (event.replyToken) {
        const errorMsg =
          lang === "th"
            ? "ยังไม่พบการจองที่จะบันทึกโน้ต ลองพิมพ์ในรูปแบบ:\nGF-XXXX: ข้อความของคุณ"
            : "No booking found to add note. Try format:\nGF-XXXX: your message";
        await lineReply(partnerToken, event.replyToken, [{ type: "text", text: errorMsg }]);
      }
      return;
    }

    const success = await addPartnerNote(supabaseAdmin, target, note);

    if (event.replyToken) {
      if (success) {
        const replyMsg =
          lang === "th"
            ? `บันทึกโน้ตแล้ว: ${target.booking_code}\n"${note}"`
            : `Note added: ${target.booking_code}\n"${note}"`;
        await lineReply(partnerToken, event.replyToken, [{ type: "text", text: replyMsg }]);
      } else {
        const errorMsg =
          lang === "th" ? "ไม่สามารถบันทึกโน้ตได้ กรุณาลองอีกครั้ง" : "Failed to add note. Please try again.";
        await lineReply(partnerToken, event.replyToken, [{ type: "text", text: errorMsg }]);
      }
    }
  }
}

export const Route = createFileRoute("/api/public/line/partner-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.PARTNER_LINE_CHANNEL_SECRET;
        if (!secret) {
          console.error("[partner-webhook] Missing PARTNER_LINE_CHANNEL_SECRET");
          return new Response("Missing PARTNER_LINE_CHANNEL_SECRET", { status: 500 });
        }

        let rawBody: string;
        try {
          rawBody = await request.text();
        } catch (err) {
          console.error("[partner-webhook] Failed to read body:", err);
          return new Response("Failed to read body", { status: 400 });
        }

        const signature = request.headers.get("x-line-signature");
        if (!verifySignature(secret, rawBody, signature)) {
          console.warn("[partner-webhook] Invalid signature");
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: { events?: LineEvent[] } = {};
        try {
          payload = JSON.parse(rawBody);
        } catch (err) {
          console.error("[partner-webhook] Invalid JSON:", err);
          return new Response("Invalid JSON", { status: 400 });
        }

        const events = payload.events ?? [];

        // Process sequentially so reply tokens are used predictably
        for (const e of events) {
          try {
            await handleEvent(e);
          } catch (err) {
            console.error("[partner-webhook] event error:", err);
          }
        }

        return new Response("ok", { status: 200 });
      },
      GET: async () => {
        return new Response("LINE Partner Webhook is running", { status: 200 });
      },
    },
  },
});
