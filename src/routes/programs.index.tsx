import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { DashShell } from "@/components/DashShell";
import { programs, personas, pick } from "@/lib/data";
import { useAppState } from "@/lib/state";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: [
      { title: "Programs — Goodfill Care" },
      { name: "description", content: "แพ็คเกจ Wellness ที่เกาะสมุย 3-7 วัน เลือกตามเป้าหมายของคุณ" },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const { t, lang } = useI18n();
  const [state] = useAppState();
  const persona = state.persona ? personas[state.persona] : null;

  return (
    <DashShell
      bg="villa"
      host="gift"
      kicker={t("programs.kicker")}
      title={t("programs.title")}
      subtitle={persona ? `${t("programs.subtitleFor")} ${pick(persona.name, lang)}` : t("programs.subtitlePick")}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] tracking-[0.25em] uppercase gold-text font-semibold">{t("common.swipeHint")}</div>
        <div className="text-[10px] text-muted-foreground">{programs.length} {t("programs.count")}</div>
      </div>
      <div className="-mx-5 md:-mx-8 px-5 md:px-8 overflow-x-auto snap-x snap-mandatory scrollbar-none [-webkit-overflow-scrolling:touch]">
        <div className="flex gap-4 md:gap-6 pb-4 pt-2">
          {programs.map((p, i) => (
            <Link
              key={p.id}
              to="/programs/$id"
              params={{ id: p.id }}
              className="snap-center shrink-0 w-[82vw] sm:w-[60vw] md:w-[420px] lg:w-[460px] card-glass overflow-hidden group flex flex-col rounded-[2.25rem]"
            >
              <div className="p-3 md:p-4">
                <div className="aspect-[16/10] overflow-hidden relative rounded-[1.75rem] shadow-inner">
                  <img src={p.image} alt={pick(p.name, lang)} loading="lazy" className="size-full object-cover group-hover:scale-110 transition duration-[1200ms] ease-out" />
                  {/* Strong gradient for text contrast over photo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/90 via-emerald-deep/30 to-transparent" />
                  <div className="absolute top-3 left-3 chip-glass">
                    {pick(p.duration, lang)}
                  </div>
                  <div className="absolute top-3 right-3 size-8 grid place-items-center rounded-2xl text-[11px] font-bold text-emerald-deep shadow-md bg-gradient-to-br from-gold-soft to-coral rotate-3">
                    {i + 1}
                  </div>
                  <div className="absolute inset-x-4 bottom-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
                    <div className="font-display text-2xl md:text-3xl leading-[1.1] line-clamp-1 tracking-tight">{pick(p.name, lang)}</div>
                    <div className="text-[13px] md:text-[14px] text-white/95 line-clamp-1 mt-1">{pick(p.tagline, lang)}</div>
                  </div>
                </div>
              </div>
              <div className="px-5 md:px-6 pb-5 md:pb-6 pt-1 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 text-[12px] text-emerald-deep/80 font-medium">
                  <MapPin size={14} className="text-gold" /> <span className="line-clamp-1">{pick(p.venue, lang)}</span>
                </div>
                <ul className="mt-3 space-y-1.5 text-[13px] md:text-[14px] flex-1">
                  {p.highlights.slice(0, 3).map((h) => (
                    <li key={h.th} className="flex items-start gap-2 text-emerald-deep/85">
                      <span className="mt-1.5 size-1.5 rounded-full bg-gradient-to-br from-gold to-coral shadow-[0_0_8px_rgba(244,166,74,0.6)] shrink-0" />
                      <span className="line-clamp-1">{pick(h, lang)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-mint/40">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">{t("common.startFrom")}</div>
                    <div className="font-display text-2xl md:text-[26px] text-emerald-deep tracking-tight">฿{p.price.toLocaleString()}</div>
                  </div>
                  <div className="btn-gold rounded-full px-4 py-2 text-[12px] inline-flex items-center gap-1.5 font-semibold">
                    {t("common.viewDetail")} <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {/* trailing breathing space */}
          <div className="shrink-0 w-2" />
        </div>
      </div>
      {/* Dots indicator (decorative; reflects count) */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {programs.map((p, i) => (
          <span key={p.id} className={`h-1.5 rounded-full transition-all ${i === 0 ? "w-8 bg-gradient-to-r from-gold to-coral shadow-[0_0_10px_rgba(244,166,74,0.6)]" : "w-2 bg-emerald-deep/20"}`} />
        ))}
      </div>
    </DashShell>
  );
}