import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";

type LineEvent = {
  type: string;
  replyToken?: string;
  source?: { userId?: string; type?: string };
  message?: { type: string; text?: string };
  postback?: { data: string };
  follow?: unknown;
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
      console.error("[customer-webhook] reply failed", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[customer-webhook] reply error:", err);
  }
}

// Multi-language status labels
const STATUS_LABEL: Record<string, { th: string; en: string }> = {
  pending: { th: "⏳ รอยืนยันจากผู้ดูแล", en: "⏳ Pending confirmation" },
  accepted: { th: "✅ ยืนยันแล้ว ทีมงานกำลังเตรียมการ", en: "✅ Confirmed - Team is preparing" },
  rejected: { th: "❌ ขออภัย ไม่สามารถรับงานช่วงนี้ได้", en: "❌ Sorry, unable to accept at this time" },
  completed: { th: "🎉 เสร็จสิ้นการดูแล ขอบคุณที่ใช้บริการ", en: "🎉 Completed - Thank you for choosing us" },
  cancelled: { th: "🚫 ยกเลิกการจองแล้ว", en: "🚫 Booking cancelled" },
};

function getStatusText(status: string, lang: string): string {
  const label = STATUS_LABEL[status];
  if (!label) return status;
  return lang === "th" ? label.th : label.en;
}

function detectLanguage(text: string): string {
  // Thai character range
  const hasThai = /[ก-๙]/.test(text);
  return hasThai ? "th" : "en";
}

// Multi-language welcome messages
function getWelcomeText(lang: string): string {
  if (lang === "en") {
    return (
      "🌿 Welcome to Goodfill Care · Koh Samui 🌿\n\n" +
      "Available commands:\n" +
      "• /programs — View wellness packages\n" +
      "• /status — Check latest booking status\n" +
      "• /status GF-XXXX — Check specific booking\n" +
      "• /contact — Contact support team\n" +
      "• /help — Show this menu again\n\n" +
      "✨ Start your wellness journey today!"
    );
  }
  return (
    "🌿 ยินดีต้อนรับสู่ Goodfill Care · Koh Samui 🌿\n\n" +
    "พิมพ์คำสั่ง:\n" +
    "• /programs — ดูแพ็กเกจดูแลสุขภาพ\n" +
    "• /status — เช็คสถานะการจองล่าสุด\n" +
    "• /status GF-XXXX — เช็คสถานะตามรหัส\n" +
    "• /contact — ติดต่อทีมงาน\n" +
    "• /help — แสดงเมนูนี้\n\n" +
    "✨ เริ่มต้นการเดินทาง Wellness ของคุณวันนี้!"
  );
}

function getProgramsText(lang: string): string {
  if (lang === "en") {
    return (
      "🌿 View our wellness programs:\n\n" +
      "https://goodfillcare-samui.com/programs\n\n" +
      "Choose from:\n" +
      "• 3-day Mindful Balance\n" +
      "• 5-day Detox Reset\n" +
      "• 7-day Full Transformation\n\n" +
      "✨ Each program includes meals, activities, and expert guidance."
    );
  }
  return (
    "🌿 ดูโปรแกรม wellness ของเรา:\n\n" +
    "https://goodfillcare-samui.com/programs\n\n" +
    "เลือกโปรแกรม:\n" +
    "• Mindful Balance 3 วัน\n" +
    "• Detox Reset 5 วัน\n" +
    "• Full Transformation 7 วัน\n\n" +
    "✨ ทุกโปรแกรมรวมอาหาร กิจกรรม และคำแนะนำจากผู้เชี่ยวชาญ"
  );
}

function getContactText(lang: string): string {
  if (lang === "en") {
    return (
      "💬 Contact Goodfill Care Team:\n\n" +
      "📞 Phone: +66 94-595-8741\n" +
      "💬 LINE: @goodfillcare\n" +
      "📧 Email: admin@goodfillcare-samui.com\n" +
      "🌐 Website: https://goodfillcare-samui.com\n\n" +
      "We'll get back to you within 24 hours."
    );
  }
  return (
    "💬 ติดต่อทีมงาน Goodfill Care:\n\n" +
    "📞 โทร: 094-595-8741\n" +
    "💬 LINE: @goodfillcare\n" +
    "📧 อีเมล: admin@goodfillcare-samui.com\n" +
    "🌐 เว็บไซต์: https://goodfillcare-samui.com\n\n" +
    "ทีมงานจะตอบกลับภายใน 24 ชั่วโมง"
  );
}

function formatBookingResponse(booking: any, lang: string): string {
  const isThai = lang === "th";
  const statusText = getStatusText(booking.status, lang);

  const bookingDate = booking.booking_date
    ? new Date(booking.booking_date).toLocaleDateString(isThai ? "th-TH" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  if (isThai) {
    return (
      `📋 <b>${booking.booking_code}</b>\n\n` +
      `📌 โปรแกรม: ${booking.program_name}\n` +
      `📅 ระยะเวลา: ${booking.program_duration || "-"} วัน\n` +
      `🗓️ วันที่: ${bookingDate}\n` +
      `📊 สถานะ: ${statusText}`
    );
  } else {
    return (
      `📋 <b>${booking.booking_code}</b>\n\n` +
      `📌 Program: ${booking.program_name}\n` +
      `📅 Duration: ${booking.program_duration || "-"} days\n` +
      `🗓️ Date: ${bookingDate}\n` +
      `📊 Status: ${statusText}`
    );
  }
}

async function handleEvent(event: LineEvent) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN!;
  const customerUserId = event.source?.userId;

  if (!token) {
    console.error("[customer-webhook] Missing LINE_CHANNEL_ACCESS_TOKEN");
    return;
  }

  // Follow / friend added → welcome
  if (event.type === "follow") {
    if (event.replyToken) {
      // Store user identity
      if (customerUserId) {
        try {
          await supabaseAdmin.from("line_identities").upsert(
            {
              line_user_id: customerUserId,
              last_active_at: new Date().toISOString(),
              language_preference: "th", // Default to Thai
            },
            { onConflict: "line_user_id" },
          );
        } catch (err) {
          console.error("Failed to store LINE identity:", err);
        }
      }
      await lineReply(token, event.replyToken, [{ type: "text", text: getWelcomeText("th") }]);
    }
    return;
  }

  if (event.type === "message" && event.message?.type === "text" && event.message.text) {
    const text = event.message.text.trim();
    const lower = text.toLowerCase();
    const lang = detectLanguage(text);

    // Update last active timestamp
    if (customerUserId) {
      try {
        await supabaseAdmin
          .from("line_identities")
          .update({ last_active_at: new Date().toISOString() })
          .eq("line_user_id", customerUserId);
      } catch (err) {
        console.error("Failed to update last active:", err);
      }
    }

    // Handle /start or /menu commands
    if (
      text === "/start" ||
      text === "/menu" ||
      text === "/help" ||
      lower === "menu" ||
      lower === "เมนู" ||
      lower === "help"
    ) {
      if (event.replyToken) {
        await lineReply(token, event.replyToken, [{ type: "text", text: getWelcomeText(lang) }]);
      }
      return;
    }

    // Handle /programs command
    if (text === "/programs" || lower === "programs" || lower === "โปรแกรม") {
      if (event.replyToken) {
        await lineReply(token, event.replyToken, [{ type: "text", text: getProgramsText(lang) }]);
      }
      return;
    }

    // Handle /contact command
    if (text === "/contact" || lower === "contact" || lower === "ติดต่อ") {
      if (event.replyToken) {
        await lineReply(token, event.replyToken, [{ type: "text", text: getContactText(lang) }]);
      }
      return;
    }

    // Handle /status command with optional booking code
    const statusMatch = text.match(/^\/status(?:\s+(GF-[A-Z0-9]+))?$/i);
    if (statusMatch || lower === "status" || lower === "สถานะ") {
      const specificCode = statusMatch?.[1] ? statusMatch[1].toUpperCase() : null;

      if (!customerUserId && !specificCode) return;

      let query = supabaseAdmin
        .from("bookings")
        .select("booking_code, program_name, program_duration, booking_date, status")
        .order("created_at", { ascending: false });

      if (specificCode) {
        query = query.eq("booking_code", specificCode);
      } else {
        query = query.eq("customer_line_user_id", customerUserId);
      }

      const { data: rows } = await query.limit(1);
      const row = rows?.[0];

      if (event.replyToken) {
        if (!row) {
          const noBookingMsg =
            lang === "th"
              ? "📭 ยังไม่พบการจองในระบบ\nพิมพ์ '/programs' เพื่อดูแพ็กเกจ หรือ '/contact' ติดต่อทีมงานครับ"
              : "📭 No booking found\nType '/programs' to view packages or '/contact' to reach our team";
          await lineReply(token, event.replyToken, [{ type: "text", text: noBookingMsg }]);
        } else {
          await lineReply(token, event.replyToken, [
            { type: "text", text: formatBookingResponse(row, lang), parseMode: "HTML" },
          ]);
        }
      }
      return;
    }

    // Handle direct booking code input (without /status prefix)
    const directCodeMatch = text.match(/^(GF-[A-Z0-9]+)$/i);
    if (directCodeMatch) {
      const code = directCodeMatch[1].toUpperCase();
      const { data: row } = await supabaseAdmin
        .from("bookings")
        .select("booking_code, program_name, program_duration, booking_date, status")
        .eq("booking_code", code)
        .maybeSingle();

      if (event.replyToken) {
        if (!row) {
          const notFoundMsg = lang === "th" ? `ไม่พบการจอง ${code}` : `Booking ${code} not found`;
          await lineReply(token, event.replyToken, [{ type: "text", text: notFoundMsg }]);
        } else {
          await lineReply(token, event.replyToken, [
            { type: "text", text: formatBookingResponse(row, lang), parseMode: "HTML" },
          ]);
        }
      }
      return;
    }

    // Default: show welcome menu for unrecognized commands
    if (event.replyToken && text && !text.startsWith("/")) {
      await lineReply(token, event.replyToken, [{ type: "text", text: getWelcomeText(lang) }]);
    }
  }
}

export const Route = createFileRoute("/api/public/line/customer-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.CUSTOMER_LINE_CHANNEL_SECRET;
        if (!secret) {
          console.error("[customer-webhook] Missing CUSTOMER_LINE_CHANNEL_SECRET");
          return new Response("Missing CUSTOMER_LINE_CHANNEL_SECRET", { status: 500 });
        }

        let rawBody: string;
        try {
          rawBody = await request.text();
        } catch (err) {
          console.error("[customer-webhook] Failed to read body:", err);
          return new Response("Failed to read body", { status: 400 });
        }

        const signature = request.headers.get("x-line-signature");
        if (!verifySignature(secret, rawBody, signature)) {
          console.warn("[customer-webhook] Invalid signature");
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: { events?: LineEvent[] } = {};
        try {
          payload = JSON.parse(rawBody);
        } catch (err) {
          console.error("[customer-webhook] Invalid JSON:", err);
          return new Response("Invalid JSON", { status: 400 });
        }

        const events = payload.events ?? [];

        for (const e of events) {
          try {
            await handleEvent(e);
          } catch (err) {
            console.error("[customer-webhook] event error:", err);
          }
        }

        return new Response("ok", { status: 200 });
      },
      GET: async () => {
        return new Response("LINE Customer Webhook is running", { status: 200 });
      },
    },
  },
});
