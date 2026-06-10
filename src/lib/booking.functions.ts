import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { tgSendMessage, tgEscape } from "@/lib/telegram.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ============================================================================
// Types & Schemas
// ============================================================================

const BookingInput = z.object({
  programId: z.string().min(1).max(100),
  programName: z.string().min(1).max(200),
  programDuration: z.string().min(1).max(100),
  programVenue: z.string().min(1).max(200),
  programPrice: z.number().min(0).max(10_000_000),
  bookingDate: z.string().min(1).max(64),
  mealPlan: z.array(z.string().min(1).max(200)).max(20).optional().default([]),
  mealsUrl: z.string().url().max(500).optional(),
  expertName: z.string().min(1).max(200).optional(),
  dietaryPlan: z.enum(["Signature", "Plant-based", "High-Protein", "Detox Light"]).optional(),
  dietaryNotes: z.string().max(1000).optional(),
  personaNote: z.string().max(1200).optional(),
  lang: z.enum(["th", "en"]).default("th"),
});

type PushResult = { ok: boolean; status?: number; error?: string };

// ============================================================================
// Helper Functions
// ============================================================================

function logBookingAction(action: string, bookingId: string, details?: any) {
  console.log(`[Booking:${action}] ${bookingId}`, {
    ...details,
    timestamp: new Date().toISOString(),
  });
}

function logBookingError(action: string, bookingId: string, error: any) {
  console.error(`[Booking:${action}] ${bookingId} Error:`, {
    message: error.message,
    timestamp: new Date().toISOString(),
  });
}

async function linePush(token: string, to: string, messages: unknown[]) {
  try {
    const res = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ to, messages }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false as const, status: res.status, error: text.slice(0, 500) };
    }
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : String(error) };
  }
}

// ============================================================================
// Flex Message Builders
// ============================================================================

function receiptFlex(opts: {
  title: string;
  subtitle: string;
  programName: string;
  programDuration: string;
  programVenue: string;
  programPrice: number;
  bookingDate: string;
  bookingId: string;
  accent: string;
  qrUrl?: string;
  mealsUrl?: string;
  expertName?: string;
  partnerActions?: boolean;
  dietaryPlan?: string;
  dietaryNotes?: string;
  personaNote?: string;
  lang?: "th" | "en";
}) {
  const isThai = opts.lang === "th";
  const dateStr = new Date(opts.bookingDate).toLocaleDateString(isThai ? "th-TH" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const rows = [
    row(isThai ? "เลขที่จอง" : "Booking ID", opts.bookingId),
    row(isThai ? "วันที่" : "Date", dateStr),
    row(isThai ? "สถานที่" : "Venue", opts.programVenue),
    row(isThai ? "ราคา" : "Price", `฿${opts.programPrice.toLocaleString()}`),
  ];

  if (opts.expertName) {
    rows.push(row(isThai ? "ผู้เชี่ยวชาญ" : "Expert", opts.expertName));
  }
  if (opts.dietaryPlan) {
    rows.push(row(isThai ? "แผนอาหาร" : "Meal Plan", opts.dietaryPlan));
  }

  const additionalContents = [];

  if (opts.dietaryNotes) {
    additionalContents.push(
      { type: "separator", margin: "md" },
      {
        type: "text",
        text: isThai ? "แพ้อาหาร / หมายเหตุ" : "Allergies / Notes",
        size: "xs",
        color: "#B45309",
        weight: "bold",
        margin: "md",
      },
      { type: "text", text: opts.dietaryNotes, size: "sm", color: "#0F3D2E", wrap: true },
    );
  }

  if (opts.personaNote) {
    additionalContents.push(
      { type: "separator", margin: "md" },
      {
        type: "text",
        text: isThai ? "ข้อมูลโปรไฟล์ลูกค้า" : "Customer Profile",
        size: "xs",
        color: "#0B4A3F",
        weight: "bold",
        margin: "md",
      },
      { type: "text", text: opts.personaNote, size: "sm", color: "#0F3D2E", wrap: true },
    );
  }

  if (opts.qrUrl) {
    additionalContents.push(
      { type: "separator", margin: "md" },
      {
        type: "text",
        text: isThai ? "QR Code สำหรับรับบริการ" : "QR Code for Service",
        size: "xs",
        color: "#6B7280",
        align: "center",
        margin: "md",
      },
      {
        type: "image",
        url: opts.qrUrl,
        size: "full",
        aspectMode: "cover",
        aspectRatio: "1:1",
        margin: "md",
      },
    );
  }

  const footerContents = [];

  if (opts.partnerActions) {
    footerContents.push(
      {
        type: "box",
        layout: "horizontal",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#0F3D2E",
            flex: 1,
            action: {
              type: "postback",
              label: isThai ? "✓ รับงาน" : "✓ Accept",
              data: `action=accept&id=${opts.bookingId}&lang=${opts.lang || "th"}`,
              displayText: `${isThai ? "รับงาน" : "Accept"} ${opts.bookingId}`,
            },
          },
          {
            type: "button",
            style: "secondary",
            flex: 1,
            action: {
              type: "postback",
              label: isThai ? "✗ ปฏิเสธ" : "✗ Reject",
              data: `action=reject&id=${opts.bookingId}&lang=${opts.lang || "th"}`,
              displayText: `${isThai ? "ปฏิเสธ" : "Reject"} ${opts.bookingId}`,
            },
          },
        ],
      },
      {
        type: "button",
        style: "link",
        action: {
          type: "postback",
          label: isThai ? "เสร็จสิ้นงาน" : "Complete",
          data: `action=complete&id=${opts.bookingId}&lang=${opts.lang || "th"}`,
          displayText: `${isThai ? "เสร็จสิ้น" : "Complete"} ${opts.bookingId}`,
        },
      },
      {
        type: "text",
        text: isThai ? "พิมพ์ข้อความตอบกลับเพื่อบันทึกเป็นโน้ต" : "Reply to add notes",
        size: "xxs",
        color: "#6B7280",
        wrap: true,
        align: "center",
      },
    );
  }

  if (opts.mealsUrl) {
    footerContents.push({
      type: "button",
      style: "primary",
      color: "#0F3D2E",
      action: {
        type: "uri",
        label: isThai ? "เปิดแผนอาหาร" : "View Meal Plan",
        uri: opts.mealsUrl,
      },
    });
  }

  footerContents.push({
    type: "text",
    text: isThai ? "แสดง QR หรือกดปุ่มเพื่อดูแผนอาหาร" : "Show QR or tap to view meal plan",
    size: "xs",
    color: "#6B7280",
    align: "center",
    wrap: true,
  });

  return {
    type: "flex",
    altText: `${opts.title} — ${opts.programName}`,
    contents: {
      type: "bubble",
      size: "mega",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: opts.accent,
        paddingAll: "20px",
        contents: [
          { type: "text", text: "GOODFILL CARE", size: "xs", color: "#F4E4BC", weight: "bold" },
          {
            type: "text",
            text: opts.title,
            size: "xl",
            color: "#FFFFFF",
            weight: "bold",
            margin: "sm",
          },
          {
            type: "text",
            text: opts.subtitle,
            size: "sm",
            color: "#E6F4EA",
            margin: "sm",
            wrap: true,
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: opts.programName,
            weight: "bold",
            size: "lg",
            wrap: true,
            color: "#0F3D2E",
          },
          { type: "text", text: opts.programDuration, size: "sm", color: "#6B7280" },
          { type: "separator", margin: "md" },
          ...rows,
          ...additionalContents,
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: footerContents,
      },
    },
  };
}

function row(label: string, value: string) {
  return {
    type: "box",
    layout: "baseline",
    spacing: "sm",
    contents: [
      { type: "text", text: label, size: "sm", color: "#6B7280", flex: 2 },
      {
        type: "text",
        text: value,
        size: "sm",
        color: "#0F3D2E",
        flex: 4,
        weight: "bold",
        wrap: true,
      },
    ],
  };
}

// ============================================================================
// Main Booking Function
// ============================================================================

export const confirmBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => BookingInput.parse(input))
  .handler(async ({ data, context }) => {
    const startTime = Date.now();
    const customerToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const partnerToken = process.env.PARTNER_LINE_CHANNEL_ACCESS_TOKEN;
    const bookingId = `GF-${Date.now().toString(36).toUpperCase()}`;

    logBookingAction("start", bookingId, { userId: context.userId, programId: data.programId });

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Get customer LINE ID
    const { data: lineRow } = await supabaseAdmin
      .from("line_identities")
      .select("line_user_id")
      .eq("user_id", context.userId)
      .eq("channel", "customer")
      .maybeSingle();
    const customerTo =
      (lineRow?.line_user_id as string | undefined) ?? process.env.LINE_CUSTOMER_USER_ID ?? "";

    // Get partner LINE ID
    let partnerTo = process.env.LINE_PARTNER_USER_ID ?? "";
    if (!partnerTo) {
      const { data: partnerRow } = await supabaseAdmin
        .from("line_identities")
        .select("line_user_id")
        .eq("channel", "partner")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      partnerTo = (partnerRow?.line_user_id as string | undefined) ?? "";
    }

    // Get Telegram chat ID
    const { data: tgRow } = await supabaseAdmin
      .from("telegram_identities")
      .select("chat_id")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const mealsUrl = data.mealsUrl;
    const qrUrl = mealsUrl
      ? `https://api.qrserver.com/v1/create-qr-code/?size=480x480&margin=12&data=${encodeURIComponent(mealsUrl)}`
      : undefined;

    const lang = data.lang || "th";
    const isThai = lang === "th";

    // Customer message
    const customerMsg = receiptFlex({
      title: isThai ? "ยืนยันการจองสำเร็จ ✓" : "Booking Confirmed ✓",
      subtitle: isThai
        ? "ขอบคุณที่เลือก Goodfill Care — เราพร้อมต้อนรับคุณที่เกาะสมุย"
        : "Thank you for choosing Goodfill Care — We look forward to welcoming you to Koh Samui",
      programName: data.programName,
      programDuration: data.programDuration,
      programVenue: data.programVenue,
      programPrice: data.programPrice,
      bookingDate: data.bookingDate,
      bookingId,
      accent: "#0F3D2E",
      qrUrl,
      mealsUrl,
      expertName: data.expertName,
      dietaryPlan: data.dietaryPlan,
      dietaryNotes: data.dietaryNotes,
      lang,
    });

    // Partner message
    const partnerMsg = receiptFlex({
      title: isThai ? "มีการจองใหม่ 🔔" : "New Booking 🔔",
      subtitle: isThai
        ? "กรุณาเตรียมห้องพักและทีมงานสำหรับลูกค้า"
        : "Please prepare rooms and team for the customer",
      programName: data.programName,
      programDuration: data.programDuration,
      programVenue: data.programVenue,
      programPrice: data.programPrice,
      bookingDate: data.bookingDate,
      bookingId,
      accent: "#0B4A3F",
      mealsUrl,
      expertName: data.expertName,
      partnerActions: true,
      dietaryPlan: data.dietaryPlan,
      dietaryNotes: data.dietaryNotes,
      personaNote: data.personaNote,
      lang,
    });

    // Meal plan message
    const mealMsg =
      data.mealPlan && data.mealPlan.length
        ? {
            type: "flex",
            altText: isThai
              ? `แผนอาหารสำหรับ ${data.programName}`
              : `Meal plan for ${data.programName}`,
            contents: {
              type: "bubble",
              header: {
                type: "box",
                layout: "vertical",
                backgroundColor: "#0B4A3F",
                paddingAll: "16px",
                contents: [
                  {
                    type: "text",
                    text: isThai ? "แผนอาหาร" : "MEAL PLAN",
                    size: "xs",
                    color: "#F4E4BC",
                    weight: "bold",
                  },
                  {
                    type: "text",
                    text: data.programName,
                    size: "md",
                    color: "#FFFFFF",
                    weight: "bold",
                    margin: "sm",
                    wrap: true,
                  },
                ],
              },
              body: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: data.mealPlan.map((line) => ({
                  type: "text",
                  text: `• ${line}`,
                  size: "sm",
                  color: "#0F3D2E",
                  wrap: true,
                })),
              },
            },
          }
        : null;

    // Send LINE messages
    let customer: PushResult = { ok: false, error: "Not sent" };
    let partner: PushResult = { ok: false, error: "Not sent" };

    if (customerToken && customerTo) {
      customer = await linePush(customerToken, customerTo, [customerMsg]);
      logBookingAction("line_customer", bookingId, { ok: customer.ok, to: customerTo });
    } else {
      customer = {
        ok: false,
        error: customerToken ? "No customer LINE ID" : "LINE_CHANNEL_ACCESS_TOKEN missing",
      };
      logBookingError("line_customer", bookingId, customer);
    }

    if (partnerToken && partnerTo) {
      const partnerMessages = mealMsg ? [partnerMsg, mealMsg] : [partnerMsg];
      partner = await linePush(partnerToken, partnerTo, partnerMessages);
      logBookingAction("line_partner", bookingId, { ok: partner.ok, to: partnerTo });
    } else {
      partner = {
        ok: false,
        error: partnerToken ? "No partner LINE ID" : "PARTNER_LINE_CHANNEL_ACCESS_TOKEN missing",
      };
      logBookingError("line_partner", bookingId, partner);
    }

    // Send Telegram message
    let telegram: PushResult = { ok: false, error: "Not sent" };
    try {
      const tgChatId = tgRow?.chat_id as number | undefined;
      if (tgChatId && process.env.TELEGRAM_API_KEY && process.env.LOVABLE_API_KEY) {
        const dateLabel = new Date(data.bookingDate).toLocaleDateString(
          isThai ? "th-TH" : "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        );

        const msgText = isThai
          ? `🌿 <b>ยืนยันการจองสำเร็จ</b>\n\n` +
            `<b>${tgEscape(data.programName)}</b>\n` +
            `${tgEscape(data.programDuration)}\n\n` +
            `📍 ${tgEscape(data.programVenue)}\n` +
            `🗓 ${dateLabel}\n` +
            `💰 ฿${data.programPrice.toLocaleString()}\n` +
            `🎫 รหัสจอง: <code>${bookingId}</code>\n` +
            (data.expertName ? `👨‍🍳 ${tgEscape(data.expertName)}\n` : "") +
            (data.dietaryPlan ? `🥗 ${tgEscape(data.dietaryPlan)}\n` : "") +
            (data.dietaryNotes ? `⚠️ ${tgEscape(data.dietaryNotes)}\n` : "") +
            (mealsUrl ? `\n📋 แผนอาหาร: ${mealsUrl}` : "")
          : `🌿 <b>Booking Confirmed</b>\n\n` +
            `<b>${tgEscape(data.programName)}</b>\n` +
            `${tgEscape(data.programDuration)}\n\n` +
            `📍 ${tgEscape(data.programVenue)}\n` +
            `🗓 ${dateLabel}\n` +
            `💰 ฿${data.programPrice.toLocaleString()}\n` +
            `🎫 Booking Code: <code>${bookingId}</code>\n` +
            (data.expertName ? `👨‍🍳 ${tgEscape(data.expertName)}\n` : "") +
            (data.dietaryPlan ? `🥗 ${tgEscape(data.dietaryPlan)}\n` : "") +
            (data.dietaryNotes ? `⚠️ ${tgEscape(data.dietaryNotes)}\n` : "") +
            (mealsUrl ? `\n📋 Meal Plan: ${mealsUrl}` : "");

        await tgSendMessage(tgChatId, msgText, { parse_mode: "HTML" });
        telegram = { ok: true };
        logBookingAction("telegram", bookingId, { chatId: tgChatId });
      }
    } catch (error) {
      telegram = { ok: false, error: error instanceof Error ? error.message : String(error) };
      logBookingError("telegram", bookingId, error);
    }

    // Save to database
    let dbId: string | null = null;
    let dbError: string | null = null;

    try {
      const { data: row, error } = await supabaseAdmin
        .from("bookings")
        .insert({
          booking_code: bookingId,
          program_id: data.programId,
          program_name: data.programName,
          program_duration: data.programDuration,
          program_venue: data.programVenue,
          program_price: data.programPrice,
          booking_date: data.bookingDate,
          meal_plan: data.mealPlan ?? [],
          meals_url: data.mealsUrl ?? null,
          expert_name: data.expertName ?? null,
          customer_line_user_id: customerTo || null,
          partner_line_user_id: partnerTo || null,
          user_id: context.userId,
          status: "pending",
          customer_push: { line: customer, telegram },
          partner_push: partner,
          dietary_plan: data.dietaryPlan ?? null,
          dietary_notes: data.dietaryNotes ?? null,
          partner_notes: data.personaNote ?? null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (error) {
        dbError = error.message;
        logBookingError("database_insert", bookingId, error);
      } else {
        dbId = row?.id ?? null;
        logBookingAction("database_insert", bookingId, { id: dbId });
      }
    } catch (error) {
      dbError = error instanceof Error ? error.message : String(error);
      logBookingError("database_insert", bookingId, error);
    }

    const duration = Date.now() - startTime;
    logBookingAction("complete", bookingId, { durationMs: duration, dbId });

    return {
      bookingId,
      dbId,
      dbError,
      customer,
      partner,
      telegram,
      durationMs: duration,
    };
  });
