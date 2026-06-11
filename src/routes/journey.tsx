import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Camera, Smile, QrCode, ArrowRight, Send, Sparkles } from "lucide-react";
import { DashShell, DashCard } from "@/components/DashShell";
import { programs, pick } from "@/lib/data";
import { useAppState } from "@/lib/state";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "My Journey — Goodfill Care" },
      {
        name: "description",
        content:
          "ตารางวันต่อวันของทริป Wellness ที่เกาะสมุย พร้อม daily check-in, Service QR, mood tracking และเชื่อมต่อกับ partner LINE สำหรับยืนยันบริการแบบเรียลไทม์",
      },
      { property: "og:title", content: "My Journey — แผนการเดินทาง Wellness ที่เกาะสมุย" },
      {
        property: "og:description",
        content:
          "ตารางวันต่อวัน, check-in รายวัน, Service QR และ mood log สำหรับแขก Goodfill Care ที่จองโปรแกรมที่เกาะสมุย",
      },
      { property: "og:url", content: "https://goodfillcare-samui.com/journey" },
    ],
    links: [{ rel: "canonical", href: "https://goodfillcare-samui.com/journey" }],
  }),
  component: JourneyPage,
});

function JourneyPage() {
  const { t, lang } = useI18n();
  const [state, setState] = useAppState();
  const program = programs.find((p) => p.id === state.bookedProgramId);
  const [mood, setMood] = useState<number | null>(null);
  const [showQr, setShowQr] = useState(false);

  if (!program) {
    return (
      <DashShell
        bg="villa"
        kicker={t("journey.empty.kicker")}
        title={t("journey.empty.title")}
        subtitle={t("journey.empty.subtitle")}
      >
        <DashCard className="text-center p-8 md:p-10">
          <div className="mb-4">
            <Sparkles size={48} className="text-gold mx-auto" />
          </div>
          <Link
            to="/programs"
            className="btn-gold rounded-full px-6 py-3 md:px-8 md:py-4 inline-flex items-center gap-2 text-sm md:text-base font-semibold"
          >
            {t("common.seePrograms")} <ArrowRight size={18} />
          </Link>
        </DashCard>
      </DashShell>
    );
  }

  const today = program.schedule[1] ?? program.schedule[0];
  const arrival = new Date(state.bookingDate ?? Date.now());

  function logCheckin(m: number) {
    setMood(m);
    setState((s) => ({
      ...s,
      checkins: [...s.checkins, { date: new Date().toISOString(), mood: m }],
      credits: s.credits + 20,
    }));
  }

  return (
    <DashShell
      bg="yoga"
      kicker={t("journey.kicker")}
      title={t("journey.title")}
      subtitle={`${t("journey.checkinAt")} ${arrival.toLocaleDateString(lang === "th" ? "th-TH" : "en-US", { day: "numeric", month: "short", year: "numeric" })} · ${pick(program.name, lang)}`}
    >
      <div className="grid lg:grid-cols-3 gap-4 md:gap-5">
        {/* Today's Schedule — larger card */}
        <DashCard variant="light" className="lg:col-span-2 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] md:text-xs tracking-widest text-gold uppercase font-semibold">
                {pick(program.name, lang)}
              </div>
              <div className="font-display text-2xl md:text-3xl mt-2 text-navy">
                {pick(today.day, lang)}
              </div>
            </div>
            <div className="size-12 md:size-14 rounded-full bg-pale-mint grid place-items-center text-2xl md:text-3xl text-gold shadow-md">
              ☀️
            </div>
          </div>

          <ul className="mt-4 space-y-2.5">
            {today.items.map((i, idx) => (
              <li
                key={i.th}
                className="flex items-start gap-3 p-2 md:p-3 rounded-xl hover:bg-pale-mint/50 transition-all duration-200"
              >
                <div className="size-7 md:size-8 rounded-full bg-pale-mint border border-mint grid place-items-center text-[11px] md:text-xs text-emerald font-semibold mt-0.5 shrink-0">
                  {idx + 1}
                </div>
                <div className="text-sm md:text-base text-navy/90 leading-relaxed">
                  {pick(i, lang)}
                </div>
              </li>
            ))}
          </ul>
        </DashCard>

        {/* Right Column — QR & Mood */}
        <div className="space-y-4">
          {/* QR Card — larger */}
          <DashCard variant="light" className="p-5 md:p-6">
            <div className="text-[11px] md:text-xs tracking-widest text-gold uppercase flex items-center gap-2 font-semibold">
              <QrCode size={16} /> {t("journey.qrTitle")}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
              {t("journey.qrHint")}
            </p>
            {!showQr ? (
              <button
                onClick={() => setShowQr(true)}
                className="btn-emerald rounded-full px-5 py-3 mt-4 text-sm md:text-base font-medium w-full shadow-md hover:shadow-lg transition-all"
              >
                {t("journey.qrOpen")}
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 aspect-square rounded-xl bg-white p-4 grid place-items-center shadow-inner"
              >
                <div className="size-full grid grid-cols-8 grid-rows-8 gap-0.5">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-emerald-deep"
                      style={{ opacity: (i * 37) % 7 < 4 ? 1 : 0 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </DashCard>

          {/* Mood Check-in — larger */}
          <DashCard variant="light" className="p-5 md:p-6">
            <div className="text-[11px] md:text-xs tracking-widest text-gold uppercase flex items-center gap-2 font-semibold">
              <Smile size={16} /> {t("journey.moodTitle")}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
              {t("journey.moodHint")}
            </p>
            <div className="flex justify-between mt-4 gap-2">
              {[
                { emoji: "😴", label: "Very tired" },
                { emoji: "😐", label: "Neutral" },
                { emoji: "🙂", label: "Good" },
                { emoji: "😊", label: "Happy" },
                { emoji: "🤩", label: "Amazing" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => logCheckin(i + 1)}
                  className={`flex-1 aspect-square rounded-xl text-2xl md:text-3xl transition-all duration-200 ${
                    mood === i + 1
                      ? "bg-gold/30 ring-2 ring-gold scale-105 shadow-md"
                      : "bg-pale-mint/40 hover:bg-pale-mint hover:scale-105"
                  }`}
                  aria-label={item.label}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
            {mood && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs md:text-sm text-emerald mt-3 text-center font-medium"
              >
                ✨ {t("journey.moodLogged")} (+20 credits)
              </motion.p>
            )}
          </DashCard>
        </div>
      </div>

      {/* Bottom Actions — larger */}
      <div className="mt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-xs md:text-sm text-muted-foreground">
          <Calendar size={14} className="inline mr-1.5" />
          {t("journey.endTripHint")}
        </div>
        <Link
          to="/report"
          className="btn-gold rounded-full px-6 py-3 text-sm md:text-base inline-flex items-center gap-2 font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <Camera size={16} /> {t("journey.finalReport")}
        </Link>
      </div>

      {/* Telegram Integration — larger */}
      <a
        href={`https://t.me/goodfillcare_bot?start=journey-${program.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex items-center justify-between gap-3 rounded-xl md:rounded-2xl border border-mint/50 bg-white/90 backdrop-blur px-5 py-4 hover:border-gold hover:shadow-md transition-all duration-300 group"
      >
        <div className="flex items-center gap-3">
          <div className="size-12 md:size-14 rounded-full bg-[#229ED9]/15 grid place-items-center text-[#229ED9] shadow-sm">
            <Send size={20} />
          </div>
          <div>
            <div className="text-sm md:text-base font-semibold text-navy">
              รับการแจ้งเตือนผ่าน Telegram
            </div>
            <div className="text-[11px] md:text-xs text-muted-foreground mt-0.5">
              QR แผนอาหาร · ยืนยันบริการ · อัปเดตจาก expert
            </div>
          </div>
        </div>
        <ArrowRight
          size={18}
          className="text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all"
        />
      </a>

      {/* Credits earned indicator */}
      {mood && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-[11px] md:text-xs text-emerald font-medium"
        >
          🎉 คุณได้รับ 20 Calm Credits แล้ว! รวม {state.credits} credits
        </motion.div>
      )}
    </DashShell>
  );
}
