import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Wand2, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { DashShell, DashCard } from "@/components/DashShell";
import { personas, programsForPersona, pick } from "@/lib/data";
import { useAppState } from "@/lib/state";
import { useI18n } from "@/lib/i18n";
import { getPersonaInsight } from "@/lib/ai-insights.functions";

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

  const fetchInsight = useServerFn(getPersonaInsight);
  const [insight, setInsight] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  async function runAI() {
    if (!persona) return;
    setLoadingAI(true);
    setAiError(null);
    try {
      const answersAsNumberMap: Record<string, number> = {};
      Object.entries(state.questAnswers ?? {}).forEach(([k, v]) => {
        answersAsNumberMap[String(k)] = Number(v);
      });
      const result = await fetchInsight({
        data: {
          personaId: persona.id,
          personaName: typeof persona.name === "string" ? persona.name : (persona.name as any).en ?? persona.id,
          answers: answersAsNumberMap,
          lang,
        },
      });
      setInsight(result);
    } catch (e: any) {
      setAiError(e?.message ?? "AI error");
    } finally {
      setLoadingAI(false);
    }
  }

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
    <DashShell bg="meditation" host="wai" highlight={pick(persona.tagline, lang)} kicker={t("persona.kicker")} title={pick(persona.name, lang)} subtitle={pick(persona.thaiName, lang)}>
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

        {/* AI Insight — powered by Z.AI */}
        <DashCard className="mt-3 bg-gradient-to-br from-emerald-deep/95 to-navy/95 text-ivory" variant="deep">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Wand2 size={14} className="text-gold" />
              <div className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold">
                {lang === "th" ? "บทวิเคราะห์เชิงลึก · Z.AI" : "Deep Insight · Z.AI"}
              </div>
            </div>
            <button
              onClick={runAI}
              disabled={loadingAI}
              className="btn-gold rounded-full px-3 py-1.5 text-[11px] font-semibold inline-flex items-center gap-1.5 disabled:opacity-60"
            >
              {loadingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              {loadingAI
                ? lang === "th" ? "กำลังวิเคราะห์…" : "Analyzing…"
                : insight ? lang === "th" ? "วิเคราะห์ใหม่" : "Re-analyze"
                : lang === "th" ? "วิเคราะห์ด้วย AI" : "Analyze with AI"}
            </button>
          </div>
          {aiError && <p className="text-xs text-coral mt-2">{aiError}</p>}
          {insight && (
            <div className="mt-3 space-y-2 text-sm">
              {insight.summary && <p className="text-ivory/95 leading-relaxed">{insight.summary}</p>}
              <div className="grid sm:grid-cols-2 gap-2 mt-2">
                {insight.strengths?.length > 0 && (
                  <div className="rounded-xl bg-white/10 border border-white/15 p-2.5">
                    <div className="text-[10px] tracking-widest text-gold uppercase mb-1">{lang === "th" ? "จุดแข็ง" : "Strengths"}</div>
                    <ul className="text-[12px] space-y-0.5 text-ivory/90">
                      {insight.strengths.slice(0,3).map((s: string, i: number) => <li key={i}>· {s}</li>)}
                    </ul>
                  </div>
                )}
                {insight.focusAreas?.length > 0 && (
                  <div className="rounded-xl bg-white/10 border border-white/15 p-2.5">
                    <div className="text-[10px] tracking-widest text-gold uppercase mb-1">{lang === "th" ? "จุดที่ต้องโฟกัส" : "Focus"}</div>
                    <ul className="text-[12px] space-y-0.5 text-ivory/90">
                      {insight.focusAreas.slice(0,3).map((s: string, i: number) => <li key={i}>· {s}</li>)}
                    </ul>
                  </div>
                )}
                {insight.dailyRitual?.length > 0 && (
                  <div className="rounded-xl bg-white/10 border border-white/15 p-2.5">
                    <div className="text-[10px] tracking-widest text-gold uppercase mb-1">{lang === "th" ? "Ritual ประจำวัน" : "Daily Ritual"}</div>
                    <ul className="text-[12px] space-y-0.5 text-ivory/90">
                      {insight.dailyRitual.slice(0,3).map((s: string, i: number) => <li key={i}>· {s}</li>)}
                    </ul>
                  </div>
                )}
                {insight.avoid?.length > 0 && (
                  <div className="rounded-xl bg-white/10 border border-white/15 p-2.5">
                    <div className="text-[10px] tracking-widest text-coral uppercase mb-1">{lang === "th" ? "ควรหลีกเลี่ยง" : "Avoid"}</div>
                    <ul className="text-[12px] space-y-0.5 text-ivory/90">
                      {insight.avoid.slice(0,3).map((s: string, i: number) => <li key={i}>· {s}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          {!insight && !loadingAI && !aiError && (
            <p className="text-[11px] text-ivory/70 mt-2 leading-relaxed">
              {lang === "th"
                ? "กดวิเคราะห์เพื่อให้ Z.AI สรุปจุดแข็ง จุดโฟกัส และ ritual ประจำวันที่เหมาะกับคุณ — ผู้เชี่ยวชาญใช้ข้อมูลนี้วางแผนได้ทันที"
                : "Tap analyze to let Z.AI summarise strengths, focus, and daily ritual matched to your persona — used by experts to fine-tune your plan."}
            </p>
          )}
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