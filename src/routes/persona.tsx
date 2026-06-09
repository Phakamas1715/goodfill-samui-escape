import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { DashShell, DashCard } from "@/components/DashShell";
import { personas, programsForPersona, pick } from "@/lib/data";
import { useAppState } from "@/lib/state";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/persona")({
  head: () => ({
    meta: [
      { title: "Wellness Persona ของคุณ — Goodfill Care" },
      { name: "description", content: "ผลลัพธ์จาก Wellness Quest พร้อมโปรแกรมที่จับคู่เฉพาะคุณ" },
    ],
  }),
  component: PersonaPage,
});

function PersonaPage() {
  const { t, lang } = useI18n();
  const [state] = useAppState();
  const persona = state.persona ? personas[state.persona] : null;
  const secondary =
    state.secondaryPersona && state.secondaryPersona !== state.persona
      ? personas[state.secondaryPersona]
      : null;

  if (!persona) {
    return (
      <DashShell bg="yoga" host="welcome" kicker={t("persona.empty.kicker")} title={t("persona.empty.title")} subtitle={t("persona.empty.subtitle")}>
        <DashCard className="text-center">
          <Link to="/quest" className="btn-gold rounded-full px-6 py-3 inline-flex items-center gap-2 text-sm">
            {t("common.startQuest")} <ArrowRight size={16} />
          </Link>
        </DashCard>
      </DashShell>
    );
  }

  const recommended = programsForPersona(persona.id);

  return (
    <DashShell bg="meditation" host="wai" kicker={t("persona.kicker")} title={pick(persona.name, lang)} subtitle={pick(persona.thaiName, lang)}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <DashCard className={`bg-gradient-to-br ${persona.color}`}>
          <p className="text-sm md:text-base text-navy">{pick(persona.tagline, lang)}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{pick(persona.description, lang)}</p>
          <div className="flex items-center gap-1.5 text-gold text-[10px] tracking-[0.25em] uppercase mt-3">
            <Sparkles size={12} /> {t("persona.pillars")}
          </div>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-1.5">
            {persona.pillars.map((p) => (
              <div key={p.th} className="rounded-xl bg-white/70 border border-white/60 p-2 text-center">
                <div className="text-[11px] font-medium text-navy">{pick(p, lang)}</div>
              </div>
            ))}
          </div>
        </DashCard>

        {secondary && (
          <DashCard className="mt-3">
            <div className="text-[10px] tracking-[0.25em] uppercase text-gold">{t("persona.secondary")}</div>
            <div className="font-display text-lg text-navy mt-0.5">{pick(secondary.name, lang)}</div>
            <div className="text-xs text-muted-foreground">{pick(secondary.thaiName, lang)} · {pick(secondary.tagline, lang)}</div>
          </DashCard>
        )}

        <div className="mt-3">
          <div className="text-[11px] tracking-widest uppercase text-gold mb-2">{t("persona.recommended")}</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {recommended.map((p) => (
              <Link
                key={p.id}
                to="/programs/$id"
                params={{ id: p.id }}
                className="bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition shadow-sm"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={p.image} alt={pick(p.name, lang)} loading="lazy" className="size-full object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="p-3">
                  <div className="text-[10px] tracking-widest text-gold uppercase">{pick(p.duration, lang)}</div>
                  <div className="font-display text-base text-navy mt-0.5 line-clamp-1">{pick(p.name, lang)}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-navy">฿{p.price.toLocaleString()}</div>
                    <ArrowRight size={14} className="text-gold" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </DashShell>
  );
}