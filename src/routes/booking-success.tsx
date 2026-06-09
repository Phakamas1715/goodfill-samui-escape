import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";
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
        content: "การจองของคุณเสร็จสมบูรณ์ ทีม Goodfill Care กำลังเตรียมประสบการณ์เฉพาะคุณที่เกาะสมุย",
      },
      { property: "og:title", content: "Booking Confirmed — Goodfill Care" },
      { property: "og:description", content: "การจองเสร็จสมบูรณ์ พร้อมเริ่มทริป Wellness ที่เกาะสมุย" },
    ],
  }),
  component: BookingSuccessPage,
});

function BookingSuccessPage() {
  const search = useSearch({ from: "/booking-success" });
  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      {/* Tropical background */}
      <div className="absolute inset-0">
        <img src={images.samuiInfinity} alt="" className="absolute inset-0 size-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-deep/55 via-emerald-deep/40 to-emerald-deep/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(201,184,155,0.25),transparent_70%)]" />
      </div>

      <main className="relative h-full flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md text-center"
        >
          {/* Checkmark */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", damping: 14 }}
            className="mx-auto size-28 md:size-32 rounded-full bg-cream grid place-items-center ring-8 ring-cream/30 shadow-[0_24px_60px_-12px_rgba(20,44,37,0.45)] mb-7"
          >
            <CheckCircle2 className="size-16 md:size-20 text-emerald-deep" strokeWidth={1.5} />
          </motion.div>

          <div className="inline-flex items-center gap-1.5 chip-glass mb-4">
            <Sparkles size={12} /> การจองเสร็จสมบูรณ์
          </div>

          <h1 className="font-display text-3xl md:text-4xl text-cream leading-tight tracking-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]">
            ขอบคุณที่ไว้วางใจ
            <br />
            <span className="italic text-gold-soft">Goodfill Care</span>
          </h1>
          <p className="mt-3 text-cream/85 text-sm md:text-base leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)] px-2">
            ทีมผู้เชี่ยวชาญของเรากำลังเตรียมประสบการณ์เฉพาะคุณ
            <br />
            คุณจะได้รับอีเมลยืนยันและรายละเอียดภายใน 24 ชั่วโมง
          </p>

          {/* Detail card */}
          {(search.programName || search.dates || search.location) && (
            <div className="mt-7 card-soft p-5 text-left">
              {search.programName && (
                <div className="flex items-start gap-3">
                  <Sparkles size={18} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">โปรแกรม</div>
                    <div className="font-display text-lg text-navy mt-0.5">{search.programName}</div>
                  </div>
                </div>
              )}
              {search.dates && (
                <div className="mt-4 flex items-start gap-3">
                  <Calendar size={18} className="text-emerald mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">วันที่</div>
                    <div className="text-navy mt-0.5">{search.dates}</div>
                  </div>
                </div>
              )}
              {search.location && (
                <div className="mt-4 flex items-start gap-3">
                  <MapPin size={18} className="text-emerald mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">สถานที่</div>
                    <div className="text-navy mt-0.5">{search.location}</div>
                  </div>
                </div>
              )}
              {search.bookingId && (
                <div className="mt-5 pt-4 border-t border-border text-center">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">หมายเลขการจอง</div>
                  <div className="font-mono text-sm text-navy mt-1 tracking-wider">{search.bookingId}</div>
                </div>
              )}
            </div>
          )}

          {/* CTAs */}
          <div className="mt-7 flex flex-col gap-3">
            <Link
              to="/care"
              className="btn-emerald rounded-full px-7 py-4 inline-flex items-center justify-center gap-2 text-base font-semibold"
            >
              ดูแผนของฉัน <ArrowRight size={18} />
            </Link>
            <Link
              to="/"
              className="rounded-full px-7 py-3 inline-flex items-center justify-center gap-2 text-sm font-medium text-cream/90 hover:text-cream bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 transition"
            >
              กลับหน้าแรก
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
