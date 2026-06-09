import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, TrendingUp, Heart, Moon, Battery, Sparkles } from "lucide-react";
import { Shell, Section, Eyebrow } from "@/components/Shell";
import { personas } from "@/lib/data";
import { useAppState } from "@/lib/state";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Final Wellness Report — Goodfill Care" },
      { name: "description", content: "สรุปผล Before/After และแผน 90 วันต่อจากนี้" },
    ],
  }),
  component: ReportPage,
});

const metrics = [
  { icon: Moon, label: "Sleep Quality", before: 4.2, after: 7.8, unit: "/10" },
  { icon: Battery, label: "Energy Level", before: 5.1, after: 8.3, unit: "/10" },
  { icon: Heart, label: "Heart Rate Variability", before: 38, after: 62, unit: "ms" },
  { icon: Sparkles, label: "Stress Score", before: 7.2, after: 3.1, unit: "/10" },
];

function ReportPage() {
  const [state] = useAppState();
  const persona = state.persona ? personas[state.persona] : null;

  return (
    <Shell>
      <Section>
        <div className="text-center">
          <Eyebrow>Phase 4 · Final Wellness Report</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl mt-4">
            <em className="gold-text not-italic">7 วันที่</em> เปลี่ยนคุณ
          </h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            สรุปผลก่อนและหลังจากทริปของคุณที่เกาะสมุย
          </p>
        </div>

        <div className="mt-14 glass rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 size-64 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs tracking-widest text-gold uppercase">Wellness Persona</div>
                <div className="font-display text-3xl mt-1">{persona?.name ?? "Sleep Seeker"}</div>
              </div>
              <div className="flex items-center gap-2 text-gold">
                <Award size={18} />
                <span className="text-sm tracking-widest uppercase">Samui Alumni Badge</span>
              </div>
            </div>

            <div className="mt-10 grid md:grid-cols-2 gap-4">
              {metrics.map((m) => {
                const delta = m.after - m.before;
                const positive = m.label.includes("Stress") ? delta < 0 : delta > 0;
                return (
                  <div key={m.label} className="rounded-2xl bg-background/50 border border-white/10 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-emerald/20 grid place-items-center text-gold">
                          <m.icon size={16} />
                        </div>
                        <div className="text-sm">{m.label}</div>
                      </div>
                      <div className={`text-xs flex items-center gap-1 ${positive ? "text-emerald" : "text-destructive"}`}>
                        <TrendingUp size={12} /> {positive ? "+" : ""}{((delta / m.before) * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Before</div>
                        <div className="font-display text-2xl text-muted-foreground line-through decoration-1">{m.before}{m.unit}</div>
                      </div>
                      <div className="text-gold">→</div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-gold">After</div>
                        <div className="font-display text-3xl gold-text">{m.after}{m.unit}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {[
            { t: "Practiced Habits", v: state.checkins.length + 12, s: "habits logged" },
            { t: "Calm Credits", v: state.credits + 480, s: "ของคุณตอนนี้" },
            { t: "Days at Samui", v: 7, s: "memorable" },
          ].map((s) => (
            <div key={s.t} className="glass rounded-2xl p-6 text-center">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.t}</div>
              <div className="font-display text-4xl gold-text mt-2">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.s}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">การเดินทางยังไม่สิ้นสุด — เริ่มแผน 90 วันของคุณ</p>
          <Link to="/care" className="btn-gold rounded-full px-8 py-4 inline-flex items-center gap-2">
            ดู Long-term Care Plan
          </Link>
        </div>
      </Section>
    </Shell>
  );
}