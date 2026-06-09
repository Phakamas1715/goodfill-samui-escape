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
  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ replyToken, messages }),
  });
  if (!res.ok) {
    console.error("[customer-webhook] reply failed", res.status, await res.text().catch(() => ""));
  }
}

const STATUS_LABEL: Record<string, string> = {
  pending: "รอยืนยันจากผู้ดูแล ⏳",
  accepted: "ยืนยันแล้ว ✓ ทีมงานกำลังเตรียมการ",
  rejected: "ขออภัย ไม่สามารถรับงานช่วงนี้ได้",
  completed: "เสร็จสิ้นการดูแล ✓ ขอบคุณที่ใช้บริการ",
};

const WELCOME_TEXT =
  "ยินดีต้อนรับสู่ Goodfill Care · Koh Samui 🌿\n\n" +
  "พิมพ์คำสั่ง:\n" +
  "• โปรแกรม — ดูแพ็กเกจดูแลสุขภาพ\n" +
  "• สถานะ — เช็คสถานะการจองล่าสุด\n" +
  "• GF-XXXX — เช็คสถานะการจองตามรหัส\n" +
  "• ติดต่อ — พูดคุยกับทีมงาน";

async function handleEvent(event: LineEvent) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN!;
  const customerUserId = event.source?.userId;

  // Follow / friend added → welcome
  if (event.type === "follow") {
    if (event.replyToken && token) {
      await lineReply(token, event.replyToken, [{ type: "text", text: WELCOME_TEXT }]);
    }
    return;
  }

  if (event.type === "message" && event.message?.type === "text" && event.message.text) {
    const text = event.message.text.trim();
    const lower = text.toLowerCase();

    // Status by explicit code
    const codeMatch = text.match(/^(GF-[A-Z0-9]+)/i);
    if (codeMatch) {
      const code = codeMatch[1].toUpperCase();
      const { data: row } = await supabaseAdmin
        .from("bookings")
        .select("booking_code, program_name, program_duration, booking_date, status")
        .eq("booking_code", code)
        .maybeSingle();
      if (event.replyToken && token) {
        if (!row) {
          await lineReply(token, event.replyToken, [
            { type: "text", text: `ไม่พบการจอง ${code}` },
          ]);
        } else {
          await lineReply(token, event.replyToken, [
            {
              type: "text",
              text:
                `📋 ${row.booking_code}\n` +
                `โปรแกรม: ${row.program_name} (${row.program_duration} วัน)\n` +
                `วันที่: ${row.booking_date ?? "-"}\n` +
                `สถานะ: ${STATUS_LABEL[row.status] ?? row.status}`,
            },
          ]);
        }
      }
      return;
    }

    // Status of latest booking for this customer userId
    if (lower.includes("สถานะ") || lower === "status") {
      if (!customerUserId) return;
      const { data: rows } = await supabaseAdmin
        .from("bookings")
        .select("booking_code, program_name, program_duration, booking_date, status")
        .eq("customer_line_user_id", customerUserId)
        .order("created_at", { ascending: false })
        .limit(1);
      const row = rows?.[0];
      if (event.replyToken && token) {
        if (!row) {
          await lineReply(token, event.replyToken, [
            { type: "text", text: "ยังไม่พบการจองในระบบ พิมพ์ 'โปรแกรม' เพื่อดูแพ็กเกจครับ" },
          ]);
        } else {
          await lineReply(token, event.replyToken, [
            {
              type: "text",
              text:
                `📋 ${row.booking_code}\n` +
                `โปรแกรม: ${row.program_name} (${row.program_duration} วัน)\n` +
                `วันที่: ${row.booking_date ?? "-"}\n` +
                `สถานะ: ${STATUS_LABEL[row.status] ?? row.status}`,
            },
          ]);
        }
      }
      return;
    }

    if (lower.includes("โปรแกรม") || lower === "menu" || lower === "เมนู") {
      if (event.replyToken && token) {
        await lineReply(token, event.replyToken, [
          {
            type: "text",
            text:
              "เลือกดูโปรแกรมและจองได้ที่:\n" +
              "https://goodfill-samui-escape.lovable.app/programs",
          },
        ]);
      }
      return;
    }

    if (lower.includes("ติดต่อ") || lower.includes("contact") || lower.includes("help")) {
      if (event.replyToken && token) {
        await lineReply(token, event.replyToken, [
          { type: "text", text: "ทีมงานจะติดต่อกลับโดยเร็วที่สุด หรือโทร 099-xxx-xxxx ครับ 🌿" },
        ]);
      }
      return;
    }

    // Default: welcome menu
    if (event.replyToken && token) {
      await lineReply(token, event.replyToken, [{ type: "text", text: WELCOME_TEXT }]);
    }
  }
}

export const Route = createFileRoute("/api/public/line/customer-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.CUSTOMER_LINE_CHANNEL_SECRET;
        if (!secret) {
          return new Response("Missing CUSTOMER_LINE_CHANNEL_SECRET", { status: 500 });
        }
        const rawBody = await request.text();
        const signature = request.headers.get("x-line-signature");
        if (!verifySignature(secret, rawBody, signature)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: { events?: LineEvent[] } = {};
        try {
          payload = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        for (const e of payload.events ?? []) {
          try {
            await handleEvent(e);
          } catch (err) {
            console.error("[customer-webhook] event error", err);
          }
        }
        return new Response("ok");
      },
      GET: async () => new Response("ok"),
    },
  },
});