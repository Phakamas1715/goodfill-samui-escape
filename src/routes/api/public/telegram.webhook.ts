import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { tgSendMessage, deriveTelegramWebhookSecret, tgEscape } from "@/lib/telegram.server";

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
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
                `เปิดเว็บไซต์: https://goodfillcare-samui.com`,
              { parse_mode: "HTML" },
            ).catch(() => {});
            return Response.json({ ok: true });
          }

          // Generic auto-reply for any other text
          if (text && !text.startsWith("/")) {
            await tgSendMessage(
              chatId,
              "ขอบคุณที่ติดต่อ Goodfill Care 🌿\nทีมงานจะตอบกลับเร็วๆ นี้ หรือคุณสามารถจองโปรแกรมได้ที่ https://goodfillcare-samui.com",
            ).catch(() => {});
          }
        }

        return Response.json({ ok: true });
      },
    },
  },
});