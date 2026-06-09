import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Sparkles, ArrowRight, Trophy } from "lucide-react";
import { DashShell, DashCard } from "@/components/DashShell";
import { personas, programs } from "@/lib/data";
import { useAppState } from "@/lib/state";

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
  const recommended = programs[0];

  function toggleHabit(name: string) {
    const k = todayKey();
    setState((s) => ({
      ...s,
      habits: s.habits.map((h) =>
        h.name === name
          ? { ...h, days: h.days.includes(k) ? h.days.filter((d) => d !== k) : [...h.days, k] }
          : h,
      ),
      credits: s.credits + (s.habits.find((h) => h.name === name)?.days.includes(k) ? 0 : 5),
    }));
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
          <div className="font-display text-base md:text-lg text-navy mt-1 line-clamp-1">{persona?.name ?? "Quest first"}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Your persona</div>
        </DashCard>
      </div>

      <div className="mt-3">
        <div className="text-[11px] tracking-widest text-gold uppercase mb-2">นิสัยวันนี้ · Daily Habits</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {state.habits.map((h) => {
              const done = h.days.includes(todayKey());
              return (
                <button
                  key={h.name}
                  onClick={() => toggleHabit(h.name)}
                  className={`rounded-2xl p-3 text-left transition border shadow-sm ${done ? "border-gold/60 bg-gold/10" : "border-white/60 bg-white/85 hover:bg-pale-mint/40"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-navy">{h.name}</span>
                    <span className={`size-6 rounded-full grid place-items-center text-[10px] ${done ? "bg-gold text-emerald-deep" : "border border-mint text-muted-foreground"}`}>
                      {done ? "✓" : ""}
                    </span>
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
                </button>
              );
            })}
        </div>
      </div>

      <DashCard className="mt-3 flex items-center gap-3">
        <img src={recommended.image} alt={recommended.name} loading="lazy" className="size-16 md:size-20 object-cover rounded-xl shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] tracking-widest uppercase text-gold">Alumni · −15%</div>
          <div className="font-display text-sm md:text-base text-navy line-clamp-1">{recommended.name}</div>
          <div className="text-[10px] text-muted-foreground">{recommended.duration} · ฿{recommended.price.toLocaleString()}</div>
        </div>
        <Link to="/programs" className="btn-emerald rounded-full px-3 py-2 text-xs inline-flex items-center gap-1 shrink-0">
          จองอีกครั้ง <ArrowRight size={12} />
        </Link>
      </DashCard>
    </DashShell>
  );
}