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

// Multi-language menu texts
const getMainMenu = (lang: string) => {
  const isThai = lang === "th";
  return {
    inline_keyboard: [
      [
        { text: isThai ? "🌿 ดูโปรแกรม" : "🌿 View Programs", url: `${SITE}/programs` },
        { text: isThai ? "📅 My Journey" : "📅 My Journey", url: `${SITE}/journey` },
      ],
      [
        { text: isThai ? "📋 สถานะการจอง" : "📋 Booking Status", callback_data: "status" },
        { text: isThai ? "📊 My Care Plan" : "📊 My Care Plan", url: `${SITE}/care` },
      ],
      [
        { text: isThai ? "💬 ติดต่อทีมงาน" : "💬 Contact Us", callback_data: "contact" },
        { text: isThai ? "🌐 เปลี่ยนภาษา" : "🌐 Change Language", callback_data: "change_lang" },
      ],
    ],
  };
};

const getSupportMenu = (lang: string) => {
  const isThai = lang === "th";
  return {
    inline_keyboard: [
      [
        { text: isThai ? "📞 โทรหาเรา" : "📞 Call Us", url: "tel:+66945958741" },
        { text: isThai ? "💬 LINE" : "💬 LINE", url: "https://line.me/R/ti/p/@goodfillcare" },
      ],
      [{ text: isThai ? "📧 Email" : "📧 Email", url: "mailto:admin@goodfillcare-samui.com" }],
      [{ text: isThai ? "🌿 เมนูหลัก" : "🌿 Main Menu", callback_data: "main_menu" }],
    ],
  };
};

const getLanguageMenu = (lang: string) => {
  return {
    inline_keyboard: [
      [
        { text: "🇹🇭 ภาษาไทย", callback_data: "lang_th" },
        { text: "🇬🇧 English", callback_data: "lang_en" },
      ],
      [{ text: "◀️ " + (lang === "th" ? "กลับ" : "Back"), callback_data: "main_menu" }],
    ],
  };
};

async function tgAnswerCallback(callbackQueryId: string, text?: string) {
  const { tg, lovable } = (() => {
    const lovable = process.env.LOVABLE_API_KEY!;
    const tg = process.env.TELEGRAM_API_KEY!;
    return { lovable, tg };
  })();

  try {
    await fetch("https://connector-gateway.lovable.dev/telegram/answerCallbackQuery", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovable}`,
        "X-Connection-Api-Key": tg,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
    });
  } catch (err) {
    console.error("Failed to answer callback query:", err);
  }
}

async function getUserLanguage(chatId: number): Promise<string> {
  const { data } = await supabaseAdmin
    .from("telegram_identities")
    .select("language_preference")
    .eq("chat_id", chatId)
    .single();

  return data?.language_preference || "th"; // Default to Thai
}

async function updateUserLanguage(chatId: number, lang: string) {
  await supabaseAdmin
    .from("telegram_identities")
    .update({ language_preference: lang, updated_at: new Date().toISOString() })
    .eq("chat_id", chatId);
}

async function getBookingByChatId(chatId: number) {
  const { data: rows } = await supabaseAdmin
    .from("bookings")
    .select("booking_code, program_name, program_duration, booking_date, status, customer_push")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    (rows ?? []).find((b: any) => {
      const tg = b?.customer_push?.telegram;
      if (!tg) return false;
      return Number(tg?.chat_id ?? tg) === chatId;
    }) ?? null
  );
}

function formatBookingStatus(booking: any, lang: string): string {
  const isThai = lang === "th";

  const statusMap: Record<string, { emoji: string; th: string; en: string }> = {
    pending: { emoji: "⏳", th: "รอการยืนยัน", en: "Pending" },
    confirmed: { emoji: "✅", th: "ยืนยันแล้ว", en: "Confirmed" },
    cancelled: { emoji: "❌", th: "ยกเลิกแล้ว", en: "Cancelled" },
    completed: { emoji: "🎉", th: "เสร็จสิ้น", en: "Completed" },
  };

  const statusInfo = statusMap[booking.status] || { emoji: "📋", th: booking.status, en: booking.status };
  const emoji = statusInfo.emoji;
  const statusText = isThai ? statusInfo.th : statusInfo.en;

  const bookingDate = booking.booking_date
    ? new Date(booking.booking_date).toLocaleDateString(isThai ? "th-TH" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  if (isThai) {
    return (
      `${emoji} <b>${tgEscape(booking.booking_code)}</b>\n` +
      `📌 โปรแกรม: ${tgEscape(booking.program_name)} (${booking.program_duration || "-"} วัน)\n` +
      `📅 วันที่: ${bookingDate}\n` +
      `📊 สถานะ: <b>${tgEscape(statusText)}</b>`
    );
  } else {
    return (
      `${emoji} <b>${tgEscape(booking.booking_code)}</b>\n` +
      `📌 Program: ${tgEscape(booking.program_name)} (${booking.program_duration || "-"} days)\n` +
      `📅 Date: ${bookingDate}\n` +
      `📊 Status: <b>${tgEscape(statusText)}</b>`
    );
  }
}

export const Route = createFileRoute("/api/public/telegram/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Verify webhook secret
        let expected: string;
        try {
          expected = deriveTelegramWebhookSecret();
        } catch (err) {
          console.error("Failed to derive webhook secret:", err);
          return new Response("Server not configured", { status: 500 });
        }

        const got = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
        if (!safeEqual(got, expected)) {
          console.warn("Unauthorized webhook request - invalid secret");
          return new Response("Unauthorized", { status: 401 });
        }

        // Parse update
        let update: any;
        try {
          update = await request.json();
        } catch (err) {
          console.error("Failed to parse JSON:", err);
          return new Response("Invalid JSON", { status: 400 });
        }

        if (!update || typeof update.update_id !== "number") {
          return Response.json({ ok: true, ignored: true });
        }

        // Handle inline button callbacks
        if (update.callback_query) {
          const cq = update.callback_query;
          const chatId: number | undefined = cq.message?.chat?.id;
          const action: string | undefined = cq.data;

          await tgAnswerCallback(cq.id);

          if (!chatId || !action) {
            return Response.json({ ok: true });
          }

          // Get user's language preference
          const userLang = await getUserLanguage(chatId);

          // Handle language selection
          if (action === "lang_th") {
            await updateUserLanguage(chatId, "th");
            await tgSendMessage(chatId, "🌿 เปลี่ยนภาษาเป็นไทยเรียบร้อยแล้ว\n\nเลือกเมนูด้านล่าง:", {
              reply_markup: getMainMenu("th"),
            }).catch(() => {});
            return Response.json({ ok: true });
          }

          if (action === "lang_en") {
            await updateUserLanguage(chatId, "en");
            await tgSendMessage(chatId, "🌿 Language changed to English\n\nChoose from menu below:", {
              reply_markup: getMainMenu("en"),
            }).catch(() => {});
            return Response.json({ ok: true });
          }

          // Handle change language menu
          if (action === "change_lang") {
            await tgSendMessage(chatId, userLang === "th" ? "🌐 เลือกภาษา:" : "🌐 Select language:", {
              reply_markup: getLanguageMenu(userLang),
            }).catch(() => {});
            return Response.json({ ok: true });
          }

          // Handle main menu
          if (action === "main_menu") {
            const menuText = userLang === "th" ? "🌿 เมนูหลัก Goodfill Care" : "🌿 Goodfill Care Main Menu";
            await tgSendMessage(chatId, menuText, { reply_markup: getMainMenu(userLang) }).catch(() => {});
            return Response.json({ ok: true });
          }

          // Handle status check
          if (action === "status") {
            const booking = await getBookingByChatId(chatId);

            let text: string;
            if (booking) {
              text = formatBookingStatus(booking, userLang);
            } else {
              text =
                userLang === "th"
                  ? "📭 ยังไม่พบการจองในระบบ\nกด 'ดูโปรแกรม' เพื่อเริ่มจองได้เลยครับ 🌿"
                  : "📭 No booking found\nClick 'View Programs' to start your journey 🌿";
            }

            await tgSendMessage(chatId, text, {
              parse_mode: "HTML",
              reply_markup: getMainMenu(userLang),
            }).catch(() => {});
            return Response.json({ ok: true });
          }

          // Handle contact
          if (action === "contact") {
            const contactText =
              userLang === "th"
                ? `💬 <b>ติดต่อทีมงาน Goodfill Care</b>\n\n📞 โทร: 094-595-8741\n💬 LINE: @goodfillcare\n📧 อีเมล: admin@goodfillcare-samui.com\n🌐 เว็บไซต์: ${SITE}\n\nทีมงานพร้อมให้บริการทุกวัน 09:00-18:00 น.`
                : `💬 <b>Contact Goodfill Care Team</b>\n\n📞 Phone: +66 94-595-8741\n💬 LINE: @goodfillcare\n📧 Email: admin@goodfillcare-samui.com\n🌐 Website: ${SITE}\n\nWe're available daily 09:00-18:00`;

            await tgSendMessage(chatId, contactText, {
              parse_mode: "HTML",
              reply_markup: getSupportMenu(userLang),
            }).catch(() => {});
            return Response.json({ ok: true });
          }

          return Response.json({ ok: true });
        }

        // Handle regular messages
        const msg = update.message ?? update.edited_message;
        const chatId: number | undefined = msg?.chat?.id;
        const tgUserId: number | undefined = msg?.from?.id;
        const text: string | undefined = msg?.text;
        const userLangCode = msg?.from?.language_code || "th"; // Telegram user's language

        // Persist message (idempotent on update_id)
        if (chatId) {
          try {
            await supabaseAdmin.from("telegram_messages").upsert(
              {
                update_id: update.update_id,
                chat_id: chatId,
                tg_user_id: tgUserId ?? null,
                text: text ?? null,
                raw_update: update,
                processed_at: new Date().toISOString(),
              },
              { onConflict: "update_id" },
            );
          } catch (err) {
            console.error("Failed to persist message:", err);
          }
        }

        // Handle /start command
        if (chatId && typeof text === "string") {
          const startMatch = text.match(/^\/start(?:\s+(\S+))?/);
          if (startMatch) {
            const startParam = startMatch[1] ?? null;
            // Detect language from Telegram user or default to Thai
            const detectedLang = userLangCode === "en" ? "en" : "th";

            try {
              await supabaseAdmin.from("telegram_identities").upsert(
                {
                  chat_id: chatId,
                  tg_user_id: tgUserId ?? null,
                  username: msg?.from?.username ?? null,
                  first_name: msg?.from?.first_name ?? null,
                  last_name: msg?.from?.last_name ?? null,
                  language_code: msg?.from?.language_code ?? null,
                  language_preference: detectedLang,
                  start_param: startParam,
                  last_active_at: new Date().toISOString(),
                } as never,
                { onConflict: "chat_id" },
              );
            } catch (err) {
              console.error("Failed to upsert identity:", err);
            }

            const name = tgEscape(msg?.from?.first_name ?? (detectedLang === "th" ? "คุณลูกค้า" : "Customer"));

            let welcomeMessage: string;
            if (detectedLang === "en") {
              welcomeMessage =
                `🌿 <b>Welcome to Goodfill Care</b>\n\n` +
                `Hello ${name} 👋\n\n` +
                `🎯 You'll receive Telegram notifications for:\n` +
                `• ✅ Booking confirmation\n` +
                `• 📱 Meal plan QR codes\n` +
                `• 👨‍⚕️ Expert updates\n` +
                `• 📊 Real-time booking status\n\n` +
                `✨ Get started by selecting an option below:`;
            } else {
              welcomeMessage =
                `🌿 <b>ยินดีต้อนรับสู่ Goodfill Care</b>\n\n` +
                `สวัสดีครับ ${name} 👋\n\n` +
                `🎯 คุณจะได้รับการแจ้งเตือนผ่าน Telegram:\n` +
                `• ✅ ยืนยันการจอง wellness program\n` +
                `• 📱 QR แผนอาหารและการรับบริการ\n` +
                `• 👨‍⚕️ อัปเดตจากผู้เชี่ยวชาญ\n` +
                `• 📊 สถานะการจองแบบ real-time\n\n` +
                `✨ เริ่มต้นด้วยการเลือกเมนูด้านล่าง:`;
            }

            await tgSendMessage(chatId, welcomeMessage, {
              parse_mode: "HTML",
              reply_markup: getMainMenu(detectedLang),
            }).catch((err) => console.error("Failed to send welcome message:", err));

            return Response.json({ ok: true });
          }

          // Get user language for responses
          const userLang = await getUserLanguage(chatId);
          const isThai = userLang === "th";

          // Handle /menu command
          if (text.trim() === "/menu" || text.trim().toLowerCase() === "menu") {
            const menuText = isThai ? "🌿 เมนูหลัก Goodfill Care" : "🌿 Goodfill Care Main Menu";
            await tgSendMessage(chatId, menuText, {
              reply_markup: getMainMenu(userLang),
            }).catch(() => {});
            return Response.json({ ok: true });
          }

          // Handle /help command
          if (text.trim() === "/help" || text.trim().toLowerCase() === "help") {
            const helpText = isThai
              ? `📖 <b>คำสั่งที่ใช้งานได้</b>\n\n/start - เริ่มต้นใช้งาน\n/menu - แสดงเมนูหลัก\n/help - แสดงคำสั่งนี้\n/status - ตรวจสอบสถานะการจอง\n/language - เปลี่ยนภาษา\n\nหรือกดปุ่มเมนูด้านล่างได้เลย`
              : `📖 <b>Available Commands</b>\n\n/start - Start the bot\n/menu - Show main menu\n/help - Show this help\n/status - Check booking status\n/language - Change language\n\nOr use the buttons below:`;

            await tgSendMessage(chatId, helpText, {
              parse_mode: "HTML",
              reply_markup: getMainMenu(userLang),
            }).catch(() => {});
            return Response.json({ ok: true });
          }

          // Handle /status command
          if (text.trim() === "/status") {
            const booking = await getBookingByChatId(chatId);

            let responseText: string;
            if (booking) {
              responseText = formatBookingStatus(booking, userLang);
            } else {
              responseText = isThai
                ? "📭 ยังไม่พบการจองในระบบ\nกด 'ดูโปรแกรม' เพื่อเริ่มจองได้เลยครับ 🌿"
                : "📭 No booking found\nClick 'View Programs' to start your journey 🌿";
            }

            await tgSendMessage(chatId, responseText, {
              parse_mode: "HTML",
              reply_markup: getMainMenu(userLang),
            }).catch(() => {});
            return Response.json({ ok: true });
          }

          // Handle /language command
          if (text.trim() === "/language" || text.trim().toLowerCase() === "language") {
            await tgSendMessage(chatId, isThai ? "🌐 เลือกภาษา:" : "🌐 Select language:", {
              reply_markup: getLanguageMenu(userLang),
            }).catch(() => {});
            return Response.json({ ok: true });
          }

          // Generic auto-reply for any other text
          if (text && !text.startsWith("/")) {
            const replyText = isThai
              ? "🙏 ขอบคุณที่ติดต่อ Goodfill Care 🌿\n\nทีมงานจะตอบกลับเร็วๆ นี้ หรือเลือกเมนูด้านล่างได้เลยครับ"
              : "🙏 Thank you for contacting Goodfill Care 🌿\n\nOur team will get back to you soon, or select an option from the menu below:";

            await tgSendMessage(chatId, replyText, { reply_markup: getMainMenu(userLang) }).catch(() => {});
          }
        }

        return Response.json({ ok: true });
      },
    },
  },
});
