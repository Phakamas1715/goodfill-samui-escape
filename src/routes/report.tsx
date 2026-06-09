import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, TrendingUp, Heart, Moon, Battery, Sparkles } from "lucide-react";
import { DashShell, DashCard } from "@/components/DashShell";
import { personas, pick } from "@/lib/data";
import { useAppState } from "@/lib/state";
import { useI18n, type TKey } from "@/lib/i18n";

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
  { icon: Moon, labelKey: "report.sleep" as TKey, isStress: false, before: 4.2, after: 7.8, unit: "/10" },
  { icon: Battery, labelKey: "report.energy" as TKey, isStress: false, before: 5.1, after: 8.3, unit: "/10" },
  { icon: Heart, labelKey: "report.hrv" as TKey, isStress: false, before: 38, after: 62, unit: "ms" },
  { icon: Sparkles, labelKey: "report.stress" as TKey, isStress: true, before: 7.2, after: 3.1, unit: "/10" },
];

function ReportPage() {
  const { t, lang } = useI18n();
  const [state] = useAppState();
  const persona = state.persona ? personas[state.persona] : null;

  return (
    <DashShell bg="spa" host="wai" kicker={t("report.kicker")} title={t("report.title")} subtitle={t("report.subtitle")}>
      <DashCard className="relative overflow-hidden">
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
              <div className="text-[10px] tracking-widest text-gold uppercase">{t("report.personaLabel")}</div>
              <div className="font-display text-xl text-navy mt-0.5">{persona ? pick(persona.name, lang) : "Sleep Seeker"}</div>
              </div>
              <div className="flex items-center gap-1.5 text-gold pill bg-gold/10">
                <Award size={14} />
                <span className="text-[10px] tracking-widest uppercase">{t("report.alumniBadge")}</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 md:gap-3">
              {metrics.map((m) => {
                const delta = m.after - m.before;
                const positive = m.isStress ? delta < 0 : delta > 0;
                return (
                  <div key={m.labelKey} className="rounded-xl bg-pale-mint/30 border border-mint/40 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="size-8 rounded-lg bg-emerald/15 grid place-items-center text-emerald shrink-0">
                          <m.icon size={14} />
                        </div>
                        <div className="text-[11px] md:text-xs text-navy/80 truncate">{t(m.labelKey)}</div>
                      </div>
                      <div className={`text-[10px] flex items-center gap-0.5 shrink-0 ${positive ? "text-emerald" : "text-destructive"}`}>
                        <TrendingUp size={10} /> {positive ? "+" : ""}{((delta / m.before) * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <div>
                        <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{t("report.before")}</div>
                        <div className="font-display text-base text-muted-foreground line-through decoration-1">{m.before}{m.unit}</div>
                      </div>
                      <div className="text-gold text-sm">→</div>
                      <div>
                        <div className="text-[9px] uppercase tracking-widest text-gold">{t("report.after")}</div>
                        <div className="font-display text-xl gold-text">{m.after}{m.unit}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
      </DashCard>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: t("report.statHabits"), v: state.checkins.length + 12 },
          { label: t("report.statCredits"), v: state.credits + 480 },
          { label: t("report.statDays"), v: 7 },
        ].map((s) => (
          <DashCard key={s.label} className="text-center !p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
            <div className="font-display text-2xl gold-text mt-0.5">{s.v}</div>
          </DashCard>
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <Link to="/care" className="btn-gold rounded-full px-5 py-2.5 text-xs inline-flex items-center gap-1.5">
          <Sparkles size={12} /> {t("report.startCare")}
        </Link>
      </div>
    </DashShell>
  );
}