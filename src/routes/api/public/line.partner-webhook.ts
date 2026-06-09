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
  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ replyToken, messages }),
  });
  if (!res.ok) {
    console.error("[partner-webhook] reply failed", res.status, await res.text().catch(() => ""));
  }
}

function parsePostback(data: string): { action?: string; id?: string } {
  const out: Record<string, string> = {};
  for (const part of data.split("&")) {
    const [k, v] = part.split("=");
    if (k) out[k] = decodeURIComponent(v ?? "");
  }
  return out;
}

const STATUS_LABEL: Record<string, string> = {
  accepted: "รับงานแล้ว ✓",
  rejected: "ปฏิเสธงาน",
  completed: "เสร็จสิ้นงาน ✓",
};

async function handleEvent(event: LineEvent) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const partnerToken = process.env.PARTNER_LINE_CHANNEL_ACCESS_TOKEN!;
  const partnerUserId = event.source?.userId;

  // Postback button → update booking status
  if (event.type === "postback" && event.postback?.data) {
    const { action, id } = parsePostback(event.postback.data);
    if (!action || !id) return;
    const statusMap: Record<string, string> = { accept: "accepted", reject: "rejected", complete: "completed" };
    const status = statusMap[action];
    if (!status) return;

    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .update({
        status,
        partner_response: {
          last_action: action,
          actor_line_user_id: partnerUserId ?? null,
          responded_at: new Date().toISOString(),
        },
      })
      .eq("booking_code", id)
      .select("booking_code, program_name")
      .maybeSingle();

    if (event.replyToken && partnerToken) {
      if (error || !row) {
        await lineReply(partnerToken, event.replyToken, [
          { type: "text", text: `ไม่พบการจอง ${id} หรืออัปเดตไม่สำเร็จ` },
        ]);
      } else {
        await lineReply(partnerToken, event.replyToken, [
          {
            type: "text",
            text: `บันทึกแล้ว: ${row.booking_code} · ${row.program_name}\nสถานะ: ${STATUS_LABEL[status]}\n\nพิมพ์ข้อความถัดไปเพื่อบันทึกเป็นโน้ตของการจองนี้`,
          },
        ]);
      }
    }
    return;
  }

  // Text message → append as note to the latest booking handled by this partner
  if (event.type === "message" && event.message?.type === "text" && event.message.text) {
    const text = event.message.text.trim();
    if (!text) return;

    // Meal-plan edit command: "GF-XXXX meal: เปลี่ยน Day 2 dinner เป็น..."
    const mealMatch = text.match(/^(GF-[A-Z0-9]+)\s+meal\s*[:：-]\s*(.+)$/i);
    if (mealMatch) {
      const code = mealMatch[1].toUpperCase();
      const line = mealMatch[2].trim();
      const { data: row } = await supabaseAdmin
        .from("bookings")
        .select("id, booking_code, meal_plan")
        .eq("booking_code", code)
        .maybeSingle();
      if (!row) {
        if (event.replyToken && partnerToken) {
          await lineReply(partnerToken, event.replyToken, [{ type: "text", text: `ไม่พบการจอง ${code}` }]);
        }
        return;
      }
      const prev = Array.isArray(row.meal_plan) ? (row.meal_plan as string[]) : [];
      const stamp = new Date().toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" });
      const updated = [...prev, `[เชฟ ${stamp}] ${line}`];
      await supabaseAdmin.from("bookings").update({ meal_plan: updated }).eq("id", row.id);
      if (event.replyToken && partnerToken) {
        await lineReply(partnerToken, event.replyToken, [
          { type: "text", text: `อัปเดตแผนอาหารแล้ว: ${code}\n+ ${line}` },
        ]);
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
    if (bookingCode) query = query.eq("booking_code", bookingCode);
    else if (partnerUserId) query = query.eq("partner_line_user_id", partnerUserId);

    const { data: rows } = await query;
    const target = rows?.[0];

    if (!target) {
      if (event.replyToken && partnerToken) {
        await lineReply(partnerToken, event.replyToken, [
          { type: "text", text: "ยังไม่พบการจองที่จะบันทึกโน้ต ลองพิมพ์ในรูปแบบ:\nGF-XXXX: ข้อความของคุณ" },
        ]);
      }
      return;
    }

    const stamp = new Date().toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" });
    const appended = `${target.partner_notes ? target.partner_notes + "\n" : ""}[${stamp}] ${note}`;
    await supabaseAdmin
      .from("bookings")
      .update({ partner_notes: appended })
      .eq("id", target.id);

    if (event.replyToken && partnerToken) {
      await lineReply(partnerToken, event.replyToken, [
        { type: "text", text: `บันทึกโน้ตแล้ว: ${target.booking_code}\n"${note}"` },
      ]);
    }
  }
}

export const Route = createFileRoute("/api/public/line/partner-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.PARTNER_LINE_CHANNEL_SECRET;
        if (!secret) {
          return new Response("Missing PARTNER_LINE_CHANNEL_SECRET", { status: 500 });
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

        const events = payload.events ?? [];
        // Process sequentially so reply tokens are used predictably
        for (const e of events) {
          try {
            await handleEvent(e);
          } catch (err) {
            console.error("[partner-webhook] event error", err);
          }
        }
        return new Response("ok");
      },
      GET: async () => new Response("ok"),
    },
  },
});