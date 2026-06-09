import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Sparkles, ArrowRight, Trophy } from "lucide-react";
import { Shell, Section, Eyebrow } from "@/components/Shell";
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
    <Shell>
      <Section>
        <Eyebrow>Phase 5 · Long-term Goodfill Care</Eyebrow>
        <h1 className="font-display text-5xl md:text-6xl mt-4">
          Care Plan ของคุณ
        </h1>
        <p className="mt-5 text-muted-foreground max-w-xl">
          การเดินทางไม่จบที่สนามบิน — ติดตามนิสัยใหม่ของคุณและสะสม Calm Credits
          ไว้สำหรับทริปครั้งถัดไป
        </p>

        <div className="grid lg:grid-cols-3 gap-5 mt-12">
          <div className="glass rounded-3xl p-6 bg-gradient-to-br from-gold/10 to-transparent">
            <Sparkles className="text-gold" size={20} />
            <div className="font-display text-5xl gold-text mt-3">{state.credits}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Calm Credits</div>
            <div className="text-xs text-muted-foreground mt-3">ใช้เป็นส่วนลดในการจองครั้งถัดไป</div>
          </div>
          <div className="glass rounded-3xl p-6">
            <Flame className="text-gold" size={20} />
            <div className="font-display text-5xl mt-3">
              {Math.max(...state.habits.map((h) => h.days.length), 0)}
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Habit Streak</div>
            <div className="text-xs text-muted-foreground mt-3">วันสูงสุดที่ทำต่อเนื่อง</div>
          </div>
          <div className="glass rounded-3xl p-6">
            <Trophy className="text-gold" size={20} />
            <div className="font-display text-3xl mt-3">{persona?.name ?? "Find your persona"}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Your persona</div>
          </div>
        </div>

        <div className="mt-16">
          <div className="text-xs tracking-widest text-gold uppercase">Daily habits — วันนี้</div>
          <h2 className="font-display text-3xl mt-2">นิสัยที่จะเปลี่ยนชีวิต</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-3">
            {state.habits.map((h) => {
              const done = h.days.includes(todayKey());
              return (
                <button
                  key={h.name}
                  onClick={() => toggleHabit(h.name)}
                  className={`glass rounded-2xl p-5 text-left transition ${done ? "border-gold/60 bg-gold/5" : "hover:bg-white/5"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{h.name}</span>
                    <span className={`size-7 rounded-full grid place-items-center text-xs ${done ? "bg-gold text-emerald-deep" : "border border-white/20 text-muted-foreground"}`}>
                      {done ? "✓" : ""}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() - (6 - i));
                      const k = d.toISOString().slice(0, 10);
                      const filled = h.days.includes(k);
                      return (
                        <div key={i} className={`flex-1 h-1.5 rounded-full ${filled ? "bg-gold" : "bg-white/10"}`} />
                      );
                    })}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">{h.days.length} days · +5 credits/day</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-20 glass rounded-[2rem] p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Eyebrow>Return to Samui</Eyebrow>
            <h2 className="font-display text-3xl md:text-4xl mt-3">
              พร้อมกลับมาอีกครั้ง?
            </h2>
            <p className="text-muted-foreground mt-3">
              สำหรับ alumni ของเรา — รับส่วนลด 15% + ใช้ Calm Credits ที่สะสมไว้
            </p>
            <Link to="/programs" className="btn-gold rounded-full px-6 py-3 inline-flex items-center gap-2 mt-6 text-sm">
              วางแผนทริปครั้งถัดไป <ArrowRight size={14} />
            </Link>
          </div>
          <div className="glass rounded-2xl p-5 bg-background/40">
            <img src={recommended.image} alt={recommended.name} loading="lazy" className="aspect-[16/10] object-cover rounded-xl" />
            <div className="font-display text-lg mt-4">{recommended.name}</div>
            <div className="text-xs text-muted-foreground">{recommended.duration} · ฿{recommended.price.toLocaleString()}</div>
          </div>
        </div>
      </Section>
    </Shell>
  );
}