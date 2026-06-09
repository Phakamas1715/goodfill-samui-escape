import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { tgSendMessage, deriveTelegramWebhookSecret, tgEscape } from "@/lib/telegram.server";

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

const SITE = "https://goodfillcare-samui.com";

const CUSTOMER_MAIN_MENU = {
  inline_keyboard: [
    [
      { text: "🌿 ดูโปรแกรม", url: `${SITE}/programs` },
      { text: "📅 My Journey", url: `${SITE}/journey` },
    ],
    [
      { text: "📋 สถานะการจอง", callback_data: "status" },
      { text: "💬 ติดต่อทีมงาน", callback_data: "contact" },
    ],
  ],
};

async function tgAnswerCallback(callbackQueryId: string, text?: string) {
  const { tg, lovable } = (() => {
    const lovable = process.env.LOVABLE_API_KEY!;
    const tg = process.env.TELEGRAM_API_KEY!;
    return { lovable, tg };
  })();
  await fetch("https://connector-gateway.lovable.dev/telegram/answerCallbackQuery", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovable}`,
      "X-Connection-Api-Key": tg,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  }).catch(() => {});
}

export const Route = createFileRoute("/api/public/telegram/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let expected: string;
        try {
          expected = deriveTelegramWebhookSecret();
        } catch {
          return new Response("Server not configured", { status: 500 });
        }
        const got = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
        if (!safeEqual(got, expected)) {
          return new Response("Unauthorized", { status: 401 });
        }

        const update = (await request.json().catch(() => null)) as any;
        if (!update || typeof update.update_id !== "number") {
          return Response.json({ ok: true, ignored: true });
        }

        // Handle inline button callbacks
        if (update.callback_query) {
          const cq = update.callback_query;
          const chatId: number | undefined = cq.message?.chat?.id;
          const action: string | undefined = cq.data;
          await tgAnswerCallback(cq.id);
          if (!chatId || !action) return Response.json({ ok: true });

          if (action === "status") {
            const tgUserId = cq.from?.id;
            // Try to look up most recent booking for this telegram chat
            const { data: ident } = await supabaseAdmin
              .from("telegram_identities")
              .select("user_id")
              .eq("chat_id", chatId)
              .maybeSingle();
            let booking: any = null;
            if (ident?.user_id) {
              const { data } = await supabaseAdmin
                .from("bookings")
                .select("booking_code, program_name, program_duration, booking_date, status")
                .eq("customer_user_id", ident.user_id)
                .order("created_at", { ascending: false })
                .limit(1);
              booking = data?.[0] ?? null;
            }
            const text = booking
              ? `📋 <b>${tgEscape(booking.booking_code)}</b>\n` +
                `โปรแกรม: ${tgEscape(booking.program_name)} (${booking.program_duration} วัน)\n` +
                `วันที่: ${booking.booking_date ?? "-"}\n` +
                `สถานะ: <b>${tgEscape(booking.status)}</b>`
              : `ยังไม่พบการจองในระบบ\nกดดูโปรแกรมเพื่อเริ่มจองได้เลยครับ 🌿`;
            await tgSendMessage(chatId, text, { parse_mode: "HTML", reply_markup: CUSTOMER_MAIN_MENU }).catch(() => {});
            return Response.json({ ok: true });
          }

          if (action === "contact") {
            await tgSendMessage(
              chatId,
              `💬 ติดต่อทีมงาน Goodfill Care\n📞 099-xxx-xxxx\n🌿 หรือเปิดแชท: ${SITE}`,
              { reply_markup: CUSTOMER_MAIN_MENU },
            ).catch(() => {});
            return Response.json({ ok: true });
          }

          return Response.json({ ok: true });
        }

        const msg = update.message ?? update.edited_message;
        const chatId: number | undefined = msg?.chat?.id;
        const tgUserId: number | undefined = msg?.from?.id;
        const text: string | undefined = msg?.text;

        // Persist message (idempotent on update_id)
        if (chatId) {
          await supabaseAdmin
            .from("telegram_messages")
            .upsert(
              {
                update_id: update.update_id,
                chat_id: chatId,
                tg_user_id: tgUserId ?? null,
                text: text ?? null,
                raw_update: update,
              },
              { onConflict: "update_id" },
            );
        }

        // Handle /start [param] — link identity
        if (chatId && typeof text === "string") {
          const startMatch = text.match(/^\/start(?:\s+(\S+))?/);
          if (startMatch) {
            const startParam = startMatch[1] ?? null;
            await supabaseAdmin
              .from("telegram_identities")
              .upsert(
                {
                  chat_id: chatId,
                  tg_user_id: tgUserId ?? null,
                  username: msg?.from?.username ?? null,
                  first_name: msg?.from?.first_name ?? null,
                  last_name: msg?.from?.last_name ?? null,
                  language_code: msg?.from?.language_code ?? null,
                  start_param: startParam,
                },
                { onConflict: "chat_id" },
              );

            const name = tgEscape(msg?.from?.first_name ?? "คุณลูกค้า");
            await tgSendMessage(
              chatId,
              `🌿 <b>ยินดีต้อนรับสู่ Goodfill Care</b>\n\nสวัสดีครับ ${name} 👋\n\n` +
                `คุณจะได้รับการแจ้งเตือนต่อไปนี้ผ่าน Telegram:\n` +
                `• ยืนยันการจอง wellness program\n` +
                `• QR แผนอาหารและการรับบริการ\n` +
                `• อัปเดตจากผู้เชี่ยวชาญ\n\n` +
                `เลือกเมนูด้านล่าง:`,
              { parse_mode: "HTML", reply_markup: CUSTOMER_MAIN_MENU },
            ).catch(() => {});
            return Response.json({ ok: true });
          }

          // /menu — show inline menu
          if (text.trim() === "/menu" || text.trim().toLowerCase() === "menu") {
            await tgSendMessage(chatId, "🌿 เมนูหลัก Goodfill Care", { reply_markup: CUSTOMER_MAIN_MENU }).catch(() => {});
            return Response.json({ ok: true });
          }

          // Generic auto-reply for any other text
          if (text && !text.startsWith("/")) {
            await tgSendMessage(
              chatId,
              "ขอบคุณที่ติดต่อ Goodfill Care 🌿\nทีมงานจะตอบกลับเร็วๆ นี้ หรือเลือกเมนูด้านล่างได้เลยครับ",
              { reply_markup: CUSTOMER_MAIN_MENU },
            ).catch(() => {});
          }
        }

        return Response.json({ ok: true });
      },
    },
  },
});