import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, Wand2, Loader2, Send, CheckCircle2, TrendingUp, Award, Clock } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashShell, DashCard } from "@/components/DashShell";
import { personas, programsForPersona, pick } from "@/lib/data";
import { useAppState } from "@/lib/state";
import { useI18n } from "@/lib/i18n";
import { getPersonaInsight } from "@/lib/ai-insights.functions";
import { sendPersonaSummary } from "@/lib/handoff.functions";

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
    state.secondaryPersona && state.secondaryPersona !== state.persona ? personas[state.secondaryPersona] : null;

  const fetchInsight = useServerFn(getPersonaInsight);
  const sendToChat = useServerFn(sendPersonaSummary);
  const navigate = useNavigate();
  const [insight, setInsight] = useState<any>(state.aiInsight ?? null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [sendingChat, setSendingChat] = useState(false);

  const calmingMessages = [
    { th: "กำลังวิเคราะห์ข้อมูล...", en: "Analyzing data..." },
    { th: "AI กำลังประมวลผล...", en: "AI is processing..." },
    { th: "เตรียมคำแนะนำเฉพาะบุคคล...", en: "Preparing recommendations..." },
    { th: "ใกล้เสร็จแล้ว!", en: "Almost there!" },
  ];
  const [calmingIdx, setCalmingIdx] = useState(0);

  useEffect(() => {
    if (!loadingAI) return;
    setCalmingIdx(0);
    const id = setInterval(() => setCalmingIdx((i) => i + 1), 2000);
    return () => clearInterval(id);
  }, [loadingAI]);

  async function handleSendToChat() {
    if (!persona) return;
    setSendingChat(true);
    try {
      const rec = recommended[0];
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const result = await sendToChat({
        data: {
          personaId: persona.id,
          personaName: pick(persona.name, lang),
          personaThai: pick(persona.thaiName, lang),
          tagline: pick(persona.tagline, lang),
          pillars: persona.pillars.map((p) => pick(p, lang)),
          summary: insight?.summary ?? "",
          strengths: insight?.strengths ?? [],
          focusAreas: insight?.focusAreas ?? [],
          dailyRitual: insight?.dailyRitual ?? [],
          avoid: insight?.avoid ?? [],
          recommended: rec
            ? {
                id: rec.id,
                name: pick(rec.name, lang),
                price: rec.price,
                url: `${origin}/programs/${rec.id}`,
              }
            : undefined,
          lang,
        },
      });
      if (result.anyOk) {
        const channels = [result.line.ok ? "LINE" : null, result.telegram.ok ? "Telegram" : null]
          .filter(Boolean)
          .join(" + ");
        toast.success(lang === "th" ? `ส่งผลวิเคราะห์เข้า ${channels} เรียบร้อย` : `Sent to your ${channels}`);
      } else {
        toast.info(lang === "th" ? "ยังไม่ได้เชื่อมบัญชีแชต" : "No chat account linked");
      }
    } catch (e: any) {
      const msg = String(e?.message ?? e ?? "");
      if (msg.includes("Unauthorized") || msg.includes("401")) {
        toast.info(lang === "th" ? "กรุณาเข้าสู่ระบบก่อน" : "Please sign in first");
        navigate({ to: "/login", search: { redirect: "/persona" } as any });
      } else {
        toast.error(lang === "th" ? "ส่งไม่สำเร็จ" : "Send failed");
      }
    } finally {
      setSendingChat(false);
    }
  }

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
          personaName: typeof persona.name === "string" ? persona.name : ((persona.name as any).en ?? persona.id),
          answers: answersAsNumberMap,
          lang,
        },
      });
      setInsight(result);
      setState((s) => ({ ...s, aiInsight: result ?? null }));
    } catch (e: any) {
      setAiError(e?.message ?? "AI error");
    } finally {
      setLoadingAI(false);
    }
  }

  if (!persona) {
    return (
      <DashShell
        bg="yoga"
        kicker={t("persona.empty.kicker")}
        title={t("persona.empty.title")}
        subtitle={t("persona.empty.subtitle")}
      >
        <DashCard className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="size-16 rounded-full bg-mint/10 flex items-center justify-center">
              <Sparkles className="size-8 text-gold/40" />
            </div>
            <p className="text-muted-foreground text-sm">ยังไม่มีผลลัพธ์ Persona</p>
            <Link to="/quest" className="btn-gold rounded-full px-6 py-2.5 inline-flex items-center gap-2 text-sm">
              {t("common.startQuest")} <ArrowRight size={14} />
            </Link>
          </div>
        </DashCard>
      </DashShell>
    );
  }

  const recommended = programsForPersona(persona.id);

  return (
    <DashShell
      compact
      bg="meditation"
      highlight={pick(persona.tagline, lang)}
      kicker={t("persona.kicker")}
      title={pick(persona.name, lang)}
      subtitle={pick(persona.thaiName, lang)}
    >
      <div className="space-y-5">
        {/* Main Persona Card */}
        <div className="bg-gradient-to-br from-emerald-deep via-navy to-emerald-deep rounded-xl overflow-hidden shadow-xl">
          <div className="p-5 md:p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="size-14 rounded-xl bg-white/10 flex items-center justify-center text-3xl">
                {(persona as any).emoji || "✨"}
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gold/15 text-gold text-[9px] font-medium mb-1">
                  <CheckCircle2 size={10} /> Wellness Persona
                </div>
                <h1 className="font-display text-xl md:text-2xl text-white">{pick(persona.name, lang)}</h1>
                <p className="text-gold/70 text-xs">{pick(persona.thaiName, lang)}</p>
              </div>
            </div>

            {/* Tagline & Description */}
            <div className="space-y-2 mb-4">
              <p className="text-white/90 text-sm leading-relaxed">{pick(persona.tagline, lang)}</p>
              <p className="text-white/50 text-xs leading-relaxed">{pick(persona.description, lang)}</p>
            </div>

            {/* Pillars */}
            <div className="pt-3 border-t border-white/10">
              <div className="text-[9px] text-gold/60 uppercase tracking-wider mb-2">{t("persona.pillars")}</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {persona.pillars.map((p) => (
                  <div key={p.th} className="px-2 py-1.5 rounded-lg bg-white/5 text-center">
                    <span className="text-[10px] text-white/60">{pick(p, lang)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-white rounded-xl shadow-sm border border-mint/20 overflow-hidden">
          <div className="p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Wand2 size={14} className="text-gold" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-gold uppercase tracking-wider">AI Insight</div>
                  <div className="text-[9px] text-muted-foreground">
                    {lang === "th" ? "วิเคราะห์จากแบบประเมิน" : "Powered by AI"}
                  </div>
                </div>
              </div>
              <button
                onClick={runAI}
                disabled={loadingAI}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy/5 hover:bg-navy/10 text-navy text-xs font-medium transition disabled:opacity-50"
              >
                {loadingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                {loadingAI
                  ? lang === "th"
                    ? "กำลังวิเคราะห์"
                    : "Analyzing"
                  : insight
                    ? lang === "th"
                      ? "วิเคราะห์ใหม่"
                      : "Re-analyze"
                    : lang === "th"
                      ? "เริ่มวิเคราะห์"
                      : "Analyze"}
              </button>
            </div>

            {/* Error */}
            {aiError && <div className="mb-3 p-2 bg-coral/10 rounded-lg text-coral text-xs text-center">{aiError}</div>}

            {/* Loading */}
            {loadingAI && !insight && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-mint/20 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gold rounded-full animate-pulse" />
                  </div>
                  <div className="h-1.5 bg-mint/20 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gold rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={calmingIdx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] text-muted-foreground italic"
                    >
                      {lang === "th" ? calmingMessages[calmingIdx % 4].th : calmingMessages[calmingIdx % 4].en}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Insight Content */}
            {insight && (
              <div className="space-y-4">
                {insight.summary && (
                  <div className="p-3 bg-mint/5 rounded-lg">
                    <p className="text-sm text-navy/80 leading-relaxed">{insight.summary}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-3">
                  {insight.strengths?.length > 0 && (
                    <div className="p-3 bg-emerald/5 rounded-lg border border-emerald/15">
                      <div className="flex items-center gap-1.5 mb-2">
                        <TrendingUp size={12} className="text-emerald" />
                        <span className="text-[9px] text-emerald uppercase tracking-wider font-medium">
                          {lang === "th" ? "จุดแข็ง" : "Strengths"}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {insight.strengths.slice(0, 3).map((s: string, i: number) => (
                          <li key={i} className="text-xs text-navy/70 flex items-start gap-1.5">
                            <span className="text-emerald text-[10px] mt-0.5">◆</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {insight.focusAreas?.length > 0 && (
                    <div className="p-3 bg-gold/5 rounded-lg border border-gold/15">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Target size={12} className="text-gold" />
                        <span className="text-[9px] text-gold uppercase tracking-wider font-medium">
                          {lang === "th" ? "จุดพัฒนา" : "Focus Areas"}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {insight.focusAreas.slice(0, 3).map((s: string, i: number) => (
                          <li key={i} className="text-xs text-navy/70 flex items-start gap-1.5">
                            <span className="text-gold text-[10px] mt-0.5">◆</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {insight.dailyRitual?.length > 0 && (
                    <div className="p-3 bg-sky/5 rounded-lg border border-sky/15">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sun size={12} className="text-sky-500" />
                        <span className="text-[9px] text-sky-500 uppercase tracking-wider font-medium">
                          {lang === "th" ? "กิจกรรมแนะนำ" : "Daily Ritual"}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {insight.dailyRitual.slice(0, 3).map((s: string, i: number) => (
                          <li key={i} className="text-xs text-navy/70 flex items-start gap-1.5">
                            <span className="text-sky-500 text-[10px] mt-0.5">◆</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {insight.avoid?.length > 0 && (
                    <div className="p-3 bg-coral/5 rounded-lg border border-coral/15">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertCircle size={12} className="text-coral" />
                        <span className="text-[9px] text-coral uppercase tracking-wider font-medium">
                          {lang === "th" ? "ควรหลีกเลี่ยง" : "Avoid"}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {insight.avoid.slice(0, 3).map((s: string, i: number) => (
                          <li key={i} className="text-xs text-navy/70 flex items-start gap-1.5">
                            <span className="text-coral text-[10px] mt-0.5">◆</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  {recommended[0] && (
                    <Link
                      to="/programs/$id"
                      params={{ id: recommended[0].id }}
                      className="block w-full py-2.5 px-4 rounded-lg bg-navy text-white text-center text-sm font-medium hover:bg-navy/90 transition text-center"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Award size={14} />
                        <span>
                          {lang === "th"
                            ? `แพ็กเกจแนะนำ: ${pick(recommended[0].name, lang)}`
                            : `Recommended: ${pick(recommended[0].name, lang)}`}
                        </span>
                        <ArrowRight size={14} />
                      </div>
                      <div className="flex items-center justify-center gap-3 mt-1 text-[10px] text-white/60">
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {pick(recommended[0].duration, lang)}
                        </span>
                        <span>฿{recommended[0].price.toLocaleString()}</span>
                      </div>
                    </Link>
                  )}

                  <button
                    onClick={handleSendToChat}
                    disabled={sendingChat}
                    className="w-full py-2 rounded-lg border border-mint/30 text-navy/70 text-xs font-medium flex items-center justify-center gap-2 hover:bg-mint/5 transition disabled:opacity-50"
                  >
                    {sendingChat ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Send size={12} className="text-gold" />
                    )}
                    {sendingChat
                      ? lang === "th"
                        ? "กำลังส่ง..."
                        : "Sending..."
                      : lang === "th"
                        ? "ส่งไปยัง LINE / Telegram"
                        : "Send to LINE / Telegram"}
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!insight && !loadingAI && !aiError && (
              <div className="text-center py-2">
                <p className="text-[10px] text-muted-foreground">
                  {lang === "th" ? 'คลิก "เริ่มวิเคราะห์" เพื่อรับคำแนะนำจาก AI' : 'Click "Analyze" to get AI insights'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Persona */}
        {secondary && (
          <div className="bg-white rounded-xl shadow-sm border border-mint/20 p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-mint/10 flex items-center justify-center text-lg">
                {(secondary as any).emoji || "✨"}
              </div>
              <div>
                <div className="text-[9px] text-gold/60 uppercase tracking-wider">{t("persona.secondary")}</div>
                <div className="text-sm font-medium text-navy">{pick(secondary.name, lang)}</div>
                <div className="text-[10px] text-muted-foreground">
                  {pick(secondary.thaiName, lang)} · {pick(secondary.tagline, lang)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Programs */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-6 bg-gold/40" />
            <span className="text-[10px] font-semibold text-gold uppercase tracking-wider">
              {t("persona.recommended")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommended.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Link
                  to="/programs/$id"
                  params={{ id: p.id }}
                  className="block bg-white rounded-xl border border-mint/20 overflow-hidden hover:shadow-md transition-all duration-300 group"
                >
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img
                      src={p.image}
                      alt={pick(p.name, lang)}
                      loading="lazy"
                      className="size-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-[9px] text-gold uppercase tracking-wider">{pick(p.duration, lang)}</div>
                    <div className="font-medium text-sm text-navy mt-0.5 line-clamp-1">{pick(p.name, lang)}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-navy">฿{p.price.toLocaleString()}</span>
                      <ArrowRight
                        size={12}
                        className="text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashShell>
  );
}

// Missing imports
import { Target, AlertCircle, Sun } from "lucide-react";
