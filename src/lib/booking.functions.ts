import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
  customerUserId: z.string().min(1).max(64).optional(),
  partnerUserId: z.string().min(1).max(64).optional(),
  dietaryPlan: z.enum(["Signature", "Plant-based", "High-Protein", "Detox Light"]).optional(),
  dietaryNotes: z.string().max(1000).optional(),
});

async function linePush(token: string, to: string, messages: unknown[]) {
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
}

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
}) {
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
          { type: "text", text: opts.title, size: "xl", color: "#FFFFFF", weight: "bold", margin: "sm" },
          { type: "text", text: opts.subtitle, size: "sm", color: "#E6F4EA", margin: "sm", wrap: true },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          { type: "text", text: opts.programName, weight: "bold", size: "lg", wrap: true, color: "#0F3D2E" },
          { type: "text", text: opts.programDuration, size: "sm", color: "#6B7280" },
          { type: "separator", margin: "md" },
          row("เลขที่จอง", opts.bookingId),
          row("วันที่", new Date(opts.bookingDate).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })),
          row("สถานที่", opts.programVenue),
          row("ราคา", `฿${opts.programPrice.toLocaleString()}`),
          ...(opts.expertName ? [row("ผู้เชี่ยวชาญ", opts.expertName)] : []),
          ...(opts.qrUrl
            ? [
                { type: "separator", margin: "md" },
                { type: "text", text: "QR Code รับมื้ออาหารตามแผน", size: "xs", color: "#6B7280", align: "center", margin: "md" },
                { type: "image", url: opts.qrUrl, size: "full", aspectMode: "cover", aspectRatio: "1:1", margin: "md" },
              ]
            : []),
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          ...(opts.partnerActions
            ? [
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
                      action: { type: "postback", label: "✓ รับงาน", data: `action=accept&id=${opts.bookingId}`, displayText: `รับงาน ${opts.bookingId}` },
                    },
                    {
                      type: "button",
                      style: "secondary",
                      flex: 1,
                      action: { type: "postback", label: "✗ ปฏิเสธ", data: `action=reject&id=${opts.bookingId}`, displayText: `ปฏิเสธ ${opts.bookingId}` },
                    },
                  ],
                },
                {
                  type: "button",
                  style: "link",
                  action: { type: "postback", label: "เสร็จสิ้นงาน", data: `action=complete&id=${opts.bookingId}`, displayText: `เสร็จสิ้น ${opts.bookingId}` },
                },
                { type: "text", text: "พิมพ์ข้อความตอบกลับเพื่อบันทึกเป็นโน้ตของการจองนี้", size: "xxs", color: "#6B7280", wrap: true, align: "center" },
              ]
            : []),
          ...(opts.mealsUrl
            ? [
                {
                  type: "button",
                  style: "primary",
                  color: "#0F3D2E",
                  action: { type: "uri", label: "เปิดแผนอาหาร", uri: opts.mealsUrl },
                },
              ]
            : []),
          { type: "text", text: "แสดง QR หรือกดปุ่ม เพื่อดูแผนอาหารและรับมื้ออาหาร", size: "xs", color: "#6B7280", align: "center", wrap: true },
        ],
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
      { type: "text", text: value, size: "sm", color: "#0F3D2E", flex: 4, weight: "bold", wrap: true },
    ],
  };
}

export const confirmBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => BookingInput.parse(input))
  .handler(async ({ data }) => {
    const customerToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const partnerToken = process.env.PARTNER_LINE_CHANNEL_ACCESS_TOKEN;
    const customerTo = data.customerUserId ?? process.env.LINE_CUSTOMER_USER_ID ?? "U81bc0e40c6f508c836b155037e729416";
    const partnerTo = data.partnerUserId ?? process.env.LINE_PARTNER_USER_ID ?? "U9547059d3a571df2bd3b0980e9132297";

    const bookingId = `GF-${Date.now().toString(36).toUpperCase()}`;
    const mealsUrl = data.mealsUrl;
    const qrUrl = mealsUrl
      ? `https://api.qrserver.com/v1/create-qr-code/?size=480x480&margin=12&data=${encodeURIComponent(mealsUrl)}`
      : undefined;

    const customerMsg = receiptFlex({
      title: "ยืนยันการจองสำเร็จ ✓",
      subtitle: "ขอบคุณที่เลือก Goodfill Care — เราพร้อมต้อนรับคุณที่เกาะสมุย",
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
    });

    const partnerMsg = receiptFlex({
      title: "มีการจองใหม่ 🔔",
      subtitle: "กรุณาเตรียมห้องพักและทีมงานสำหรับลูกค้า",
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
    });

    const mealMsg = data.mealPlan && data.mealPlan.length
      ? {
          type: "flex",
          altText: `แผนอาหารสำหรับ ${data.programName}`,
          contents: {
            type: "bubble",
            header: {
              type: "box",
              layout: "vertical",
              backgroundColor: "#0B4A3F",
              paddingAll: "16px",
              contents: [
                { type: "text", text: "MEAL PLAN", size: "xs", color: "#F4E4BC", weight: "bold" },
                { type: "text", text: data.programName, size: "md", color: "#FFFFFF", weight: "bold", margin: "sm", wrap: true },
              ],
            },
            body: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: data.mealPlan.map((line) => ({
                type: "text", text: `• ${line}`, size: "sm", color: "#0F3D2E", wrap: true,
              })),
            },
          },
        }
      : null;

    type PushResult = { ok: boolean; status?: number; error?: string };
    let customer: PushResult;
    let partner: PushResult;

    if (customerToken) {
      customer = await linePush(customerToken, customerTo, [customerMsg]);
    } else {
      customer = { ok: false, error: "LINE_CHANNEL_ACCESS_TOKEN missing" };
    }

    if (partnerToken) {
      const partnerMessages = mealMsg ? [partnerMsg, mealMsg] : [partnerMsg];
      partner = await linePush(partnerToken, partnerTo, partnerMessages);
    } else {
      partner = { ok: false, error: "PARTNER_LINE_CHANNEL_ACCESS_TOKEN missing" };
    }

    // Persist to DB (best-effort, never blocks the receipt response)
    let dbId: string | null = null;
    let dbError: string | null = null;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
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
          customer_line_user_id: customerTo,
          partner_line_user_id: partnerTo,
          status: "pending",
          customer_push: JSON.parse(JSON.stringify(customer)),
          partner_push: JSON.parse(JSON.stringify(partner)),
        })
        .select("id")
        .single();
      if (error) dbError = error.message;
      else dbId = row?.id ?? null;
    } catch (e) {
      dbError = e instanceof Error ? e.message : String(e);
    }

    return { bookingId, dbId, dbError, customer, partner };
  });