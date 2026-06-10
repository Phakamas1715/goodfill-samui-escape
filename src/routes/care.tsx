import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Sparkles, ArrowRight, Trophy, Clock, CheckCircle2, Calendar } from "lucide-react";
import { DashShell, DashCard } from "@/components/DashShell";
import { personas, programs, pick } from "@/lib/data";
import { useAppState } from "@/lib/state";
import { useI18n } from "@/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/care")({
  head: () => ({
    meta: [
      { title: "Long-term Care — Goodfill Care" },
      {
        name: "description",
        content:
          "แผน 90 วันต่อจากทริปของคุณที่เกาะสมุย พร้อม habit tracker รายวัน, Calm Credits, และสิทธิ์ Alumni สำหรับการจองครั้งต่อไป",
      },
      { property: "og:title", content: "Long-term Care — แผนดูแลตัวเอง 90 วันหลังเกาะสมุย" },
      {
        property: "og:description",
        content:
          "Habit tracker, Calm Credits และโปรแกรม Alumni สำหรับคงผลลัพธ์ Wellness ของคุณหลังจบทริปที่เกาะสมุย",
      },
      { property: "og:url", content: "https://goodfillcare-samui.com/care" },
    ],
    links: [{ rel: "canonical", href: "https://goodfillcare-samui.com/care" }],
  }),
  component: CarePage,
});

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function CarePage() {
  const { t, lang } = useI18n();
  const [state, setState] = useAppState();
  const persona = state.persona ? personas[state.persona] : null;
  const alumni = programs;
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const todayCheckedCount = state.habits.filter((h) => h.days.includes(todayKey())).length;
  const showHabitHint = todayCheckedCount === 0;

  function toggleHabit(name: string) {
    const k = todayKey();
    const wasDone = state.habits.find((h) => h.name === name)?.days.includes(k);
    setState((s) => ({
      ...s,
      habits: s.habits.map((h) =>
        h.name === name
          ? { ...h, days: h.days.includes(k) ? h.days.filter((d) => d !== k) : [...h.days, k] }
          : h,
      ),
      credits: s.credits + (s.habits.find((h) => h.name === name)?.days.includes(k) ? 0 : 5),
    }));
    if (!wasDone) {
      setCelebrate(name);
      window.setTimeout(() => setCelebrate((c) => (c === name ? null : c)), 900);
    }
  }

  return (
    <DashShell
      bg="meditation"
      kicker="Phase 5 · Long-term Care"
      title="Care Plan ของคุณ"
      subtitle="ติดตามนิสัย · สะสม Calm Credits"
    >
      {/* Stats Grid — larger */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <DashCard variant="deep" className="p-4 md:p-5 text-center">
          <div className="flex flex-col items-center">
            <Sparkles className="text-gold" size={22} />
            <div className="font-display text-3xl md:text-4xl lg:text-5xl text-gold mt-2 leading-none font-bold">
              {state.credits}
            </div>
            <div className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-ivory/70 mt-1">
              Calm Credits
            </div>
          </div>
        </DashCard>

        <DashCard variant="deep" className="p-4 md:p-5 text-center">
          <div className="flex flex-col items-center">
            <Flame className="text-mint" size={22} />
            <div className="font-display text-3xl md:text-4xl lg:text-5xl text-ivory mt-2 leading-none font-bold">
              {Math.max(...state.habits.map((h) => h.days.length), 0)}
            </div>
            <div className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-ivory/70 mt-1">
              {t("care.streak")}
            </div>
          </div>
        </DashCard>

        <DashCard variant="deep" className="p-4 md:p-5">
          <div className="flex flex-col h-full">
            <Trophy className="text-gold" size={22} />
            {persona ? (
              <>
                <div className="font-display text-base md:text-lg lg:text-xl text-ivory mt-2 line-clamp-2 font-semibold">
                  {pick(persona.name, lang)}
                </div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-ivory/70 mt-1">
                  {t("care.yourPersona")}
                </div>
              </>
            ) : (
              <Link to="/quest" className="mt-2 group">
                <div className="text-[11px] md:text-xs text-ivory leading-snug line-clamp-2">
                  {t("care.readyToStart")}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-gold group-hover:translate-x-0.5 transition-transform mt-1">
                  {t("care.firstMission")} →
                </div>
              </Link>
            )}
          </div>
        </DashCard>
      </div>

      {/* Daily Habits Section — larger */}
      <div className="mt-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={14} className="text-gold" />
          <div className="text-[11px] md:text-xs tracking-widest text-gold uppercase font-semibold">
            {t("care.habitsTitle")}
          </div>
          {showHabitHint && (
            <motion.span
              aria-hidden
              initial={{ opacity: 0.6 }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-1 rounded-full bg-gold/20 text-gold ring-1 ring-gold/50 px-2 py-0.5 text-[9px] md:text-[10px] font-medium"
            >
              <span className="size-1.5 rounded-full bg-gold animate-pulse" />
              {t("care.checkinHint")}
            </motion.span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.habits.map((h) => {
            const done = h.days.includes(todayKey());
            return (
              <motion.button
                key={h.name}
                onClick={() => toggleHabit(h.name)}
                whileTap={{ scale: 0.98 }}
                animate={celebrate === h.name ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                transition={{ duration: 0.45 }}
                className={`relative overflow-hidden rounded-xl p-4 text-left transition-all border ${
                  done
                    ? "border-gold/70 bg-gold/15 shadow-md"
                    : "border-white/30 bg-white/90 hover:bg-pale-mint/50 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm md:text-base font-semibold text-navy">{h.name}</span>
                  <motion.span
                    animate={
                      celebrate === h.name ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}
                    }
                    transition={{ duration: 0.5 }}
                    className={`size-7 rounded-full grid place-items-center text-xs font-bold ${
                      done
                        ? "bg-gold text-emerald-deep shadow-md"
                        : "border-2 border-mint/60 text-muted-foreground"
                    }`}
                  >
                    {done ? "✓" : ""}
                  </motion.span>
                </div>

                {/* Week progress bars — larger */}
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    const k = d.toISOString().slice(0, 10);
                    const filled = h.days.includes(k);
                    return (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all ${
                          filled ? "bg-gold shadow-[0_0_4px_rgba(212,175,55,0.5)]" : "bg-mint/30"
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground">
                    {h.days.length}d streak
                  </div>
                  <div className="text-[9px] md:text-[10px] text-emerald font-medium">
                    +5 credits/day
                  </div>
                </div>

                {/* Celebration effect */}
                <AnimatePresence>
                  {celebrate === h.name && (
                    <>
                      <motion.div
                        initial={{ opacity: 0.55, scale: 0.6 }}
                        animate={{ opacity: 0, scale: 1.6 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-radial from-gold/40 to-transparent"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: -6 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.7 }}
                        className="pointer-events-none absolute top-2 right-10 text-[11px] font-bold text-gold drop-shadow"
                      >
                        +5 ✨
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Alumni Programs Section — larger */}
      <div className="mt-6 pt-5 border-t border-white/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-gold" />
            <div className="text-[11px] md:text-xs tracking-widest text-gold uppercase font-semibold">
              {t("care.alumniTitle")}
            </div>
          </div>
          <div className="text-[9px] md:text-[10px] tracking-widest uppercase text-ivory/60">
            {t("common.swipeShort")}
          </div>
        </div>

        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 pb-2 overscroll-x-contain"
          style={{ touchAction: "pan-x" }}
        >
          {alumni.map((p, i) => (
            <div
              key={p.id}
              className="snap-start shrink-0 w-[80vw] sm:w-[55vw] md:w-[380px] lg:w-[420px] relative rounded-xl overflow-hidden border border-white/30 shadow-xl"
            >
              <img
                src={p.image}
                alt={pick(p.name, lang)}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/95 via-emerald-deep/50 to-black/30" />

              <div className="relative z-10 flex flex-col justify-between p-4 md:p-5 min-h-[160px] md:min-h-[180px]">
                <div className="flex items-start justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[10px] md:text-[11px] text-ivory ring-1 ring-white/30">
                    <Clock size={12} /> {pick(p.duration, lang)}
                  </span>
                  <span className="rounded-full bg-gold/95 text-emerald-deep text-[10px] md:text-[11px] font-bold px-2.5 py-1 shadow-md">
                    Alumni #{i + 1}
                  </span>
                </div>

                <div className="mt-auto">
                  <div className="font-display text-lg md:text-xl text-ivory leading-tight line-clamp-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-semibold">
                    {pick(p.name, lang)}
                  </div>

                  <div className="flex items-center justify-between mt-3 gap-3">
                    <div className="text-ivory drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-ivory/70">
                        Special Price
                      </div>
                      <div className="font-display text-lg md:text-xl font-bold">
                        ฿{p.price.toLocaleString()}
                      </div>
                    </div>
                    <Link
                      to="/programs"
                      className="rounded-full bg-white/15 backdrop-blur-sm text-ivory ring-1 ring-gold/60 px-3.5 py-2 text-[11px] md:text-xs font-medium inline-flex items-center gap-1.5 hover:bg-gold/20 hover:ring-gold transition-all"
                    >
                      {t("common.bookAgain")} <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hint for more programs */}
        <div className="mt-4 text-center">
          <Link
            to="/programs"
            className="inline-flex items-center gap-1 text-[10px] md:text-[11px] text-ivory/70 hover:text-gold transition"
          >
            ดูโปรแกรมทั้งหมด <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </DashShell>
  );
}
