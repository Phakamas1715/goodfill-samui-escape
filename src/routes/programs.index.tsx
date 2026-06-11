import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { DashShell } from "@/components/DashShell";
import { programs, personas, pick } from "@/lib/data";
import { useAppState } from "@/lib/state";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: [
      { title: "Wellness Packages — Goodfill Care Samui" },
      {
        name: "description",
        content:
          "แพ็คเกจ Wellness ที่เกาะสมุย 3–7 วัน — Recharge, Reset, Balance และ Transform ออกแบบโดยผู้เชี่ยวชาญ พร้อมที่พัก อาหารสุขภาพ และโปรแกรมฟื้นฟูครบวงจร",
      },
      { property: "og:title", content: "Wellness Packages — Goodfill Care Samui" },
      {
        property: "og:description",
        content:
          "เลือกแพ็คเกจฟื้นฟูสุขภาพที่เกาะสมุยที่เหมาะกับคุณ — 3 ถึง 7 วัน ดูแลโดยผู้เชี่ยวชาญตัวจริง",
      },
      { property: "og:url", content: "https://goodfillcare-samui.com/programs" },
    ],
    links: [{ rel: "canonical", href: "https://goodfillcare-samui.com/programs" }],
  }),
  component: ProgramsIndex,
});

function ProgramsIndex() {
  const { lang } = useI18n();
  const [state] = useAppState();
  const persona = state.persona ? personas[state.persona] : null;

  return (
    <DashShell
      bg="spa"
      kicker="Wellness Packages"
      title={lang === "th" ? "แพ็คเกจฟื้นฟูที่เกาะสมุย" : "Retreat packages in Koh Samui"}
      subtitle={
        lang === "th"
          ? "3–7 วัน ออกแบบโดยผู้เชี่ยวชาญ พร้อมที่พัก อาหาร และโปรแกรมครบวงจร"
          : "3–7 days, expert-designed — stay, meals, and a full restorative program."
      }
    >
      <div className="max-w-5xl mx-auto w-full px-4 md:px-0 pb-10">
        {persona && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/85 backdrop-blur border border-gold/40 px-4 py-2 text-xs text-navy shadow-sm">
            <Sparkles size={14} className="text-gold" />
            {lang === "th" ? "แนะนำสำหรับ" : "Recommended for"}{" "}
            <span className="font-semibold">{pick(persona.name, lang)}</span>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {programs.map((p, i) => {
            const matched = state.persona ? p.matches.includes(state.persona) : false;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                <Link
                  to="/programs/$id"
                  params={{ id: p.id }}
                  className="block bg-white/90 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition shadow-[0_12px_30px_-14px_rgba(12,35,64,0.35)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={p.image}
                      alt={pick(p.name, lang)}
                      loading="lazy"
                      className="size-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    {matched && (
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-gradient-to-r from-gold to-coral text-emerald-deep text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 shadow">
                        {lang === "th" ? "เหมาะกับคุณ" : "Best match"}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] tracking-widest text-gold uppercase">
                      {pick(p.duration, lang)} · {pick(p.venue, lang)}
                    </div>
                    <div className="font-display text-lg text-navy mt-0.5">
                      {pick(p.name, lang)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {pick(p.tagline, lang)}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm font-semibold text-navy">
                        ฿{p.price.toLocaleString()}
                        <span className="text-[10px] font-normal text-muted-foreground ml-1">
                          / {lang === "th" ? "ท่าน" : "person"}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald group-hover:gap-2 transition-all">
                        {lang === "th" ? "ดูรายละเอียด" : "View details"}
                        <ArrowRight size={14} className="text-gold" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashShell>
  );
}
