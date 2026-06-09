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
  customerUserId: z.string().min(1).max(64).optional(),
  partnerUserId: z.string().min(1).max(64).optional(),
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
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          { type: "text", text: "แสดง QR Code นี้ที่หน้าเช็คอิน", size: "xs", color: "#6B7280", align: "center", wrap: true },
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

    return { bookingId, customer, partner };
  });