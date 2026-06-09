import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Sparkles, ArrowRight, Trophy, Clock } from "lucide-react";
import { DashShell, DashCard, hosts } from "@/components/DashShell";
import { personas, programs } from "@/lib/data";
import { useAppState } from "@/lib/state";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/care")({
  head: () => ({
    meta: [
      { title: "Long-term Care — Goodfill Care" },
      { name: "description", content: "แผน 90 วันต่อจากทริปของคุณ habit tracker และ Calm Credits" },
    ],
  }),
  component: CarePage,
});

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function CarePage() {
  const [state, setState] = useAppState();
  const persona = state.persona ? personas[state.persona] : null;
  const alumni = programs;
  const [celebrate, setCelebrate] = useState<string | null>(null);

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
    <DashShell bg="meditation" host="gift" kicker="Phase 5 · Long-term Care" title="Care Plan ของคุณ" subtitle="ติดตามนิสัย · สะสม Calm Credits">
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <DashCard className="bg-gradient-to-br from-gold/15 to-white/85">
          <Sparkles className="text-gold" size={18} />
          <div className="font-display text-2xl md:text-3xl text-gold mt-1">{state.credits}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Calm Credits</div>
        </DashCard>
        <DashCard>
          <Flame className="text-gold" size={18} />
          <div className="font-display text-2xl md:text-3xl text-navy mt-1">
            {Math.max(...state.habits.map((h) => h.days.length), 0)}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Streak (days)</div>
        </DashCard>
        <DashCard>
          <Trophy className="text-gold" size={18} />
          {persona ? (
            <>
              <div className="font-display text-base md:text-lg text-navy mt-1 line-clamp-1">{persona.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Your persona</div>
            </>
          ) : (
            <div className="mt-1 flex items-center gap-2">
              <div className="relative shrink-0">
                <img
                  src={hosts.gift}
                  alt=""
                  className="size-10 md:size-12 rounded-full object-cover object-top bg-white/80 ring-2 ring-gold/50 shadow"
                />
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-gold ring-2 ring-white animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] md:text-xs text-navy leading-snug line-clamp-2">
                  พร้อมเริ่มสะสมพลังบวกหรือยังคะ?
                </div>
                <div className="text-[9px] uppercase tracking-widest text-gold">เริ่มภารกิจแรก →</div>
              </div>
            </div>
          )}
        </DashCard>
      </div>

      <div className="mt-3">
        <div className="text-[11px] tracking-widest text-gold uppercase mb-2">นิสัยวันนี้ · Daily Habits</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {state.habits.map((h) => {
              const done = h.days.includes(todayKey());
              return (
                <motion.button
                  key={h.name}
                  onClick={() => toggleHabit(h.name)}
                  whileTap={{ scale: 0.97 }}
                  animate={celebrate === h.name ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                  transition={{ duration: 0.45 }}
                  className={`relative overflow-hidden rounded-2xl p-3 text-left transition border shadow-sm ${done ? "border-gold/60 bg-gold/10" : "border-white/60 bg-white/85 hover:bg-pale-mint/40"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-navy">{h.name}</span>
                    <motion.span
                      animate={celebrate === h.name ? { rotate: [0, -10, 10, 0], scale: [1, 1.25, 1] } : {}}
                      transition={{ duration: 0.5 }}
                      className={`size-6 rounded-full grid place-items-center text-[10px] ${done ? "bg-gold text-emerald-deep shadow-[0_0_0_4px_rgba(212,175,55,0.18)]" : "border border-mint text-muted-foreground"}`}
                    >
                      {done ? "✓" : ""}
                    </motion.span>
                  </div>
                  <div className="mt-2 flex gap-0.5">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() - (6 - i));
                      const k = d.toISOString().slice(0, 10);
                      const filled = h.days.includes(k);
                      return (
                        <div key={i} className={`flex-1 h-1 rounded-full ${filled ? "bg-gold" : "bg-mint/30"}`} />
                      );
                    })}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">{h.days.length}d · +5/day</div>
                  <AnimatePresence>
                    {celebrate === h.name && (
                      <>
                        <motion.div
                          initial={{ opacity: 0.55, scale: 0.6 }}
                          animate={{ opacity: 0, scale: 1.6 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-radial from-gold/40 to-transparent"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: -4 }}
                          exit={{ opacity: 0, y: -14 }}
                          transition={{ duration: 0.7 }}
                          className="pointer-events-none absolute top-2 right-8 text-[10px] font-medium text-gold drop-shadow"
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

      <div className="mt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] tracking-widest text-gold uppercase">Alumni · −15% · กลับมาอีกครั้ง</div>
          <div className="text-[9px] tracking-widest uppercase text-muted-foreground hidden sm:block">ปัดซ้าย–ขวา</div>
        </div>
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-3 px-3 pb-1">
          {alumni.map((p, i) => (
            <div
              key={p.id}
              className="snap-start shrink-0 w-[78vw] sm:w-[58vw] md:w-[360px] relative rounded-2xl overflow-hidden border border-white/60 shadow-[0_10px_32px_rgba(8,42,67,0.18)]"
            >
              <img src={p.image} alt={p.name} loading="lazy" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/90 via-emerald-deep/40 to-black/20" />
              <div className="relative z-10 flex flex-col justify-between p-3 md:p-4 min-h-[150px] md:min-h-[170px]">
                <div className="flex items-start justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/35 backdrop-blur px-2 py-1 text-[10px] text-ivory ring-1 ring-white/20">
                    <Clock size={11} /> {p.duration}
                  </span>
                  <span className="rounded-full bg-gold/95 text-emerald-deep text-[10px] font-medium px-2 py-1 shadow">
                    #{i + 1}
                  </span>
                </div>
                <div>
                  <div className="font-display text-base md:text-lg text-ivory leading-tight line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                    {p.name}
                  </div>
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <div className="text-ivory drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
                      <span className="text-[10px] uppercase tracking-widest text-ivory/75">Alumni</span>
                      <div className="font-display text-sm md:text-base">฿{p.price.toLocaleString()}</div>
                    </div>
                    <Link
                      to="/programs"
                      className="rounded-full bg-white/10 backdrop-blur-sm text-ivory ring-1 ring-gold/70 px-3 py-1.5 text-[11px] font-medium inline-flex items-center gap-1 hover:bg-gold/15 hover:ring-gold transition"
                    >
                      จองอีกครั้ง <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashShell>
  );
}