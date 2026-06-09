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
      kicker={t("programs.kicker")}
      title={t("programs.title")}
      subtitle={persona ? `${t("programs.subtitleFor")} ${pick(persona.name, lang)}` : t("programs.subtitlePick")}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs md:text-sm tracking-[0.25em] uppercase gold-text font-semibold">
          {t("common.swipeHint")}
        </div>
        <div className="text-xs md:text-sm text-white/70 font-medium">
          {programs.length} {t("programs.count")}
        </div>
      </div>

      <div className="-mx-5 md:-mx-8 px-5 md:px-8 overflow-x-auto snap-x snap-mandatory scrollbar-none [-webkit-overflow-scrolling:touch]">
        <div className="flex gap-5 md:gap-7 pb-6 pt-3">
          {programs.map((p, i) => (
            <Link
              key={p.id}
              to="/programs/$id"
              params={{ id: p.id }}
              className="snap-center shrink-0 w-[88vw] sm:w-[65vw] md:w-[480px] lg:w-[520px] card-glass overflow-hidden group flex flex-col rounded-[2rem] md:rounded-[2.25rem] shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Section — larger */}
              <div className="p-3 md:p-4">
                <div className="aspect-[16/10] overflow-hidden relative rounded-[1.5rem] md:rounded-[1.75rem] shadow-lg">
                  <img
                    src={p.image}
                    alt={pick(p.name, lang)}
                    loading="lazy"
                    className="size-full object-cover group-hover:scale-110 transition duration-[1200ms] ease-out"
                  />
                  {/* Stronger gradient for text contrast over photo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/95 via-emerald-deep/40 to-transparent" />

                  {/* Duration badge — larger */}
                  <div className="absolute top-4 left-4 chip-glass text-sm md:text-base px-3 py-1.5 rounded-full font-semibold backdrop-blur-md bg-black/30 text-white border border-white/30">
                    {pick(p.duration, lang)}
                  </div>

                  {/* Program number badge — larger */}
                  <div className="absolute top-4 right-4 size-10 md:size-12 grid place-items-center rounded-xl text-sm md:text-base font-bold text-emerald-deep shadow-lg bg-gradient-to-br from-gold-soft to-coral rotate-3">
                    {i + 1}
                  </div>

                  {/* Title overlay — bigger text */}
                  <div className="absolute inset-x-5 bottom-5 text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                    <div className="font-display text-2xl md:text-3xl lg:text-4xl leading-[1.15] line-clamp-2 tracking-tight font-semibold">
                      {pick(p.name, lang)}
                    </div>
                    <div className="text-sm md:text-base text-white/95 line-clamp-2 mt-2 font-medium">
                      {pick(p.tagline, lang)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section — larger spacing and fonts */}
              <div className="px-5 md:px-6 pb-6 md:pb-7 pt-2 flex-1 flex flex-col">
                {/* Venue */}
                <div className="flex items-center gap-2 text-sm md:text-base text-emerald-deep/90 font-medium">
                  <MapPin size={16} className="text-gold" />
                  <span className="line-clamp-1">{pick(p.venue, lang)}</span>
                </div>

                {/* Highlights — bigger text and spacing */}
                <ul className="mt-4 space-y-2 flex-1">
                  {p.highlights.slice(0, 3).map((h) => (
                    <li key={h.th} className="flex items-start gap-2.5 text-sm md:text-base text-emerald-deep/90">
                      <span className="mt-1.5 size-2 rounded-full bg-gradient-to-br from-gold to-coral shadow-[0_0_10px_rgba(244,166,74,0.6)] shrink-0" />
                      <span className="line-clamp-2 leading-relaxed">{pick(h, lang)}</span>
                    </li>
                  ))}
                </ul>

                {/* Price & CTA — bigger */}
                <div className="mt-5 flex items-center justify-between pt-5 border-t border-mint/50">
                  <div>
                    <div className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-white/70 font-semibold">
                      {t("common.startFrom")}
                    </div>
                    <div className="font-display text-3xl md:text-4xl text-emerald-deep tracking-tight font-bold">
                      ฿{p.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="btn-gold rounded-full px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base inline-flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all">
                    {t("common.viewDetail")} <ArrowRight size={16} strokeWidth={2} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {/* trailing breathing space */}
          <div className="shrink-0 w-3" />
        </div>
      </div>

      {/* Dots indicator — larger */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {programs.map((p, i) => (
          <span
            key={p.id}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === 0
                ? "w-10 bg-gradient-to-r from-gold to-coral shadow-[0_0_12px_rgba(244,166,74,0.7)]"
                : "w-2.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </DashShell>
  );
}
