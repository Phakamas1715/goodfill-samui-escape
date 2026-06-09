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
  const [state, setState] = useAppState();
  const persona = state.persona ? personas[state.persona] : null;
  const secondary =
    state.secondaryPersona && state.secondaryPersona !== state.persona
      ? personas[state.secondaryPersona]
      : null;

  const fetchInsight = useServerFn(getPersonaInsight);
  const [insight, setInsight] = useState<any>(state.aiInsight ?? null);
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
      // Persist so booking can auto-attach it as a partner-facing note.
      setState((s) => ({ ...s, aiInsight: result ?? null }));
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
    <DashShell compact bg="meditation" host="wai" highlight={pick(persona.tagline, lang)} kicker={t("persona.kicker")} title={pick(persona.name, lang)} subtitle={pick(persona.thaiName, lang)}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <DashCard className="p-4 md:p-5 bg-gradient-to-br from-emerald-deep/95 via-navy/95 to-emerald-deep/90 ring-1 ring-white/15 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]" variant="deep">
          <p className="text-sm md:text-base font-semibold text-ivory leading-snug drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] break-words">{pick(persona.tagline, lang)}</p>
          <p className="text-xs text-ivory/85 mt-1.5 leading-relaxed line-clamp-3">{pick(persona.description, lang)}</p>
          <div className="flex items-center gap-1.5 text-gold text-[10px] tracking-[0.25em] uppercase mt-3 font-semibold">
            <Sparkles size={12} /> {t("persona.pillars")}
          </div>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
            {persona.pillars.map((p, i) => {
              const gradients = [
                "from-amber-200/70 via-orange-300/65 to-rose-400/60",
                "from-emerald-200/70 via-teal-300/65 to-cyan-400/60",
                "from-fuchsia-300/65 via-pink-400/60 to-rose-400/60",
                "from-sky-200/70 via-indigo-300/65 to-violet-400/60",
              ];
              const emojis = ["✨", "🌿", "🧘", "🌊"];
              return (
                <div
                  key={p.th}
                  className={`relative overflow-hidden rounded-xl p-2.5 text-center bg-gradient-to-br ${gradients[i % 4]} shadow-[0_8px_22px_-10px_rgba(0,0,0,0.45)] ring-1 ring-white/40`}
                >
                  <div className="text-base leading-none mb-1">{emojis[i % 4]}</div>
                  <div className="text-[11px] md:text-xs font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">
                    {pick(p, lang)}
                  </div>
                </div>
              );
            })}
          </div>
        </DashCard>

        {/* AI Insight — powered by AI */}
        <DashCard className="mt-3 bg-gradient-to-br from-emerald-deep/95 to-navy/95 text-ivory" variant="deep">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Wand2 size={14} className="text-gold" />
              <div className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold">
                {lang === "th" ? "บทวิเคราะห์เชิงลึก · AI" : "Deep Insight · AI"}
              </div>
            </div>
            <button
              onClick={runAI}
              disabled={loadingAI}
              className="btn-gold rounded-full px-4 py-2 text-xs md:text-sm font-bold inline-flex items-center gap-1.5 disabled:opacity-60 shadow-[0_0_24px_rgba(244,166,74,0.55)] ring-1 ring-gold/60 animate-pulse"
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
                ? "กดวิเคราะห์เพื่อให้ AI สรุปจุดแข็ง จุดโฟกัส และ ritual ประจำวันที่เหมาะกับคุณ — ผู้เชี่ยวชาญใช้ข้อมูลนี้วางแผนได้ทันที"
                : "Tap analyze to let AI summarise strengths, focus, and daily ritual matched to your persona — used by experts to fine-tune your plan."}
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