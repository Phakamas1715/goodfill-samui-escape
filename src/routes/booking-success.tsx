import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Gift,
  Mail,
  Clock,
} from "lucide-react";
import { z } from "zod";
import { images } from "@/lib/data";

const searchSchema = z.object({
  bookingId: z.string().optional(),
  programName: z.string().optional(),
  dates: z.string().optional(),
  location: z.string().optional(),
});

export const Route = createFileRoute("/booking-success")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "ยืนยันการจอง — Goodfill Care" },
      {
        name: "description",
        content:
          "การจองของคุณเสร็จสมบูรณ์ ทีม Goodfill Care กำลังเตรียมประสบการณ์เฉพาะคุณที่เกาะสมุย",
      },
      { property: "og:title", content: "Booking Confirmed — Goodfill Care" },
      {
        property: "og:description",
        content: "การจองเสร็จสมบูรณ์ พร้อมเริ่มทริป Wellness ที่เกาะสมุย",
      },
    ],
  }),
  component: BookingSuccessPage,
});

function BookingSuccessPage() {
  const search = useSearch({ from: "/booking-success" });

  // Format date if present
  const formattedDate = search.dates
    ? new Date(search.dates).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      {/* Tropical background */}
      <div className="absolute inset-0">
        <img
          src={images.samuiInfinity}
          alt=""
          className="absolute inset-0 size-full object-cover"
          loading="eager"
        />
        {/* เพิ่ม Gradient ให้คมชัดขึ้น */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-deep/70 via-emerald-deep/50 to-emerald-deep/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(201,184,155,0.3),transparent_70%)]" />
      </div>

      <main className="relative h-full flex items-center justify-center px-4 md:px-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md md:max-w-lg py-8"
        >
          {/* Checkmark — larger */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", damping: 14 }}
            className="mx-auto size-28 md:size-36 rounded-full bg-cream grid place-items-center ring-8 ring-cream/30 shadow-2xl mb-6"
          >
            <CheckCircle2 className="size-16 md:size-20 text-emerald-deep" strokeWidth={1.5} />
          </motion.div>

          {/* Success Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 backdrop-blur-sm border border-gold/30">
              <Sparkles size={14} className="text-gold" />
              <span className="text-[11px] md:text-xs font-semibold text-gold uppercase tracking-wide">
                การจองเสร็จสมบูรณ์
              </span>
            </div>
          </div>

          {/* Title — larger */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream leading-tight tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] text-center">
            ขอบคุณที่ไว้วางใจ
            <br />
            <span className="italic text-gold">Goodfill Care</span>
          </h1>

          {/* Description — larger */}
          <p className="mt-4 text-cream/90 text-sm md:text-base leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)] text-center px-2">
            ทีมผู้เชี่ยวชาญของเรากำลังเตรียมประสบการณ์เฉพาะคุณ
            <br />
            คุณจะได้รับอีเมลยืนยันและรายละเอียดภายใน 24 ชั่วโมง
          </p>

          {/* What happens next - new section */}
          <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="text-center">
              <div className="text-[10px] md:text-[11px] uppercase tracking-wider text-gold mb-2">
                ขั้นตอนต่อไป
              </div>
              <div className="flex flex-col gap-2 text-[11px] md:text-xs text-cream/85">
                <div className="flex items-center gap-2 justify-center">
                  <Mail size={14} className="text-gold" />
                  <span>รอรับอีเมลยืนยันภายใน 24 ชั่วโมง</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Clock size={14} className="text-gold" />
                  <span>ผู้เชี่ยวชาญจะติดต่อคุณเพื่อปรับโปรแกรม</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detail card — larger */}
          {(search.programName || formattedDate || search.location) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6 bg-white/95 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-xl"
            >
              {search.programName && (
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                    <Sparkles size={18} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] md:text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      โปรแกรม
                    </div>
                    <div className="font-display text-base md:text-lg text-navy mt-0.5 font-semibold">
                      {search.programName}
                    </div>
                  </div>
                </div>
              )}

              {formattedDate && (
                <div className="mt-4 flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-emerald/15 flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-emerald" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] md:text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      วันที่
                    </div>
                    <div className="text-sm md:text-base text-navy mt-0.5 font-medium">
                      {formattedDate}
                    </div>
                  </div>
                </div>
              )}

              {search.location && (
                <div className="mt-4 flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-sky/15 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] md:text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      สถานที่
                    </div>
                    <div className="text-sm md:text-base text-navy mt-0.5 font-medium">
                      {search.location}
                    </div>
                  </div>
                </div>
              )}

              {search.bookingId && (
                <div className="mt-5 pt-4 border-t border-mint/30 text-center">
                  <div className="text-[10px] md:text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    หมายเลขการจอง
                  </div>
                  <div className="font-mono text-sm md:text-base text-navy mt-1.5 tracking-wider font-bold bg-pale-mint/30 inline-block px-4 py-1.5 rounded-lg">
                    {search.bookingId}
                  </div>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground mt-2">
                    กรุณาจดบันทึกหมายเลขการจองของคุณ
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Special Gift Note */}
          <div className="mt-5 text-center">
            <div className="inline-flex items-center gap-2 text-[10px] md:text-[11px] text-cream/70">
              <Gift size={12} />
              <span>คุณได้รับ 300 Calm Credits แล้ว! ไปที่ Care Plan เพื่อเริ่มใช้งาน</span>
            </div>
          </div>

          {/* CTAs — larger */}
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/care"
              className="btn-emerald rounded-full px-8 py-4 md:py-4.5 inline-flex items-center justify-center gap-2 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              ดูแผนของฉัน <ArrowRight size={18} />
            </Link>
            <Link
              to="/"
              className="rounded-full px-8 py-3 md:py-3.5 inline-flex items-center justify-center gap-2 text-sm md:text-base font-medium text-cream/90 hover:text-cream bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/25 transition-all"
            >
              กลับหน้าแรก
            </Link>
          </div>

          {/* Support hint */}
          <p className="text-center text-[9px] md:text-[10px] text-cream/50 mt-6">
            มีคำถาม? ติดต่อเราได้ที่ LINE: @goodfillcare หรือ admin@goodfillcare-samui.com
          </p>
        </motion.div>
      </main>
    </div>
  );
}
