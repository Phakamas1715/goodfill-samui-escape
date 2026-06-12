import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Wand2,
  Loader2,
  Send,
  CheckCircle2,
  Heart,
  Zap,
  Moon,
  Sun,
  Coffee,
  Brain,
  Activity,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";
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

import { Shield } from "lucide-react";

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

  const calmingMessagesTh = [
    "กำลังวิเคราะห์ข้อมูลเชิงลึก...",
    "AI กำลังประมวลผลบุคลิกภาพของคุณ...",
    "เตรียมคำแนะนำเฉพาะบุคคล...",
    "ใกล้เสร็จแล้ว! กำลังจัดทำรายงาน...",
  ];
  const calmingMessagesEn = [
    "Analyzing your wellness data...",
    "AI is processing your personality...",
    "Preparing personalized recommendations...",
    "Almost there! Generating your report...",
  ];
  const [calmingIdx, setCalmingIdx] = useState(0);

  useEffect(() => {
    if (!loadingAI) return;
    setCalmingIdx(0);
    const id = setInterval(() => setCalmingIdx((i) => i + 1), 2200);
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
        toast.success(lang === "th" ? `ส่งผลวิเคราะห์เข้า ${channels} ของคุณแล้ว` : `Sent to your ${channels}`, {
          description:
            lang === "th"
              ? "เปิดแอปเพื่อคุยต่อกับผู้ช่วย Goodfill ได้ทันที"
              : "Open the app to continue with the Goodfill assistant.",
        });
      } else {
        toast.info(lang === "th" ? "ยังไม่ได้เชื่อมบัญชีแชต" : "No chat account linked yet", {
          description:
            lang === "th"
              ? "เชื่อม LINE หรือ Telegram กับโปรไฟล์ของคุณก่อน เพื่อรับผลวิเคราะห์เข้าแชต"
              : "Link your LINE or Telegram to receive the insight in chat.",
        });
      }
    } catch (e: any) {
      const msg = String(e?.message ?? e ?? "");
      if (msg.includes("Unauthorized") || msg.includes("401")) {
        toast.info(lang === "th" ? "กรุณาเข้าสู่ระบบก่อน" : "Please sign in first", {
          description:
            lang === "th"
              ? "เข้าสู่ระบบด้วย LINE เพื่อส่งผลวิเคราะห์เข้าแชตของคุณ"
              : "Sign in with LINE to send the insight to your chat.",
        });
        navigate({ to: "/login", search: { redirect: "/persona" } as any });
      } else {
        toast.error(lang === "th" ? "ส่งไม่สำเร็จ" : "Send failed", {
          description: msg.slice(0, 200),
        });
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
            <div className="size-16 rounded-full bg-mint/20 flex items-center justify-center">
              <Sparkles className="size-8 text-gold opacity-50" />
            </div>
            <p className="text-muted-foreground">ยังไม่มีผลลัพธ์ Persona</p>
            <Link
              to="/quest"
              className="btn-gold rounded-full px-6 py-3 inline-flex items-center gap-2 text-sm font-medium"
            >
              {t("common.startQuest")} <ArrowRight size={16} />
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        {/* Main Persona Card - Professional Style */}
        <div className="bg-gradient-to-br from-emerald-deep via-navy to-emerald-deep rounded-2xl p-6 shadow-2xl border border-white/10">
          <div className="flex items-start gap-5 mb-5">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center shadow-lg">
              <span className="text-4xl">{persona.emoji || "✨"}</span>
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gold/15 text-gold text-[10px] font-semibold tracking-wide mb-2">
                <CheckCircle2 size={10} />
                <span>WELLNESS PERSONA</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-white leading-tight">{pick(persona.name, lang)}</h1>
              <p className="text-gold/80 text-sm mt-1">{pick(persona.thaiName, lang)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-white/90 text-base leading-relaxed">{pick(persona.tagline, lang)}</p>
            <p className="text-white/60 text-sm leading-relaxed">{pick(persona.description, lang)}</p>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-6 bg-gold/50" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold">
                {t("persona.pillars")}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {persona.pillars.map((p, i) => (
                <div
                  key={p.th}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-center hover:bg-white/10 transition"
                >
                  <span className="text-[11px] md:text-xs font-medium text-white/80">{pick(p, lang)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insight Card - Professional Style */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-gold/15 flex items-center justify-center">
                <Wand2 size={14} className="text-gold" />
              </div>
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold">AI INSIGHT</div>
                <p className="text-[10px] text-white/40">
                  {lang === "th" ? "วิเคราะห์จากแบบประเมินของคุณ" : "Powered by AI"}
                </p>
              </div>
            </div>
            <button
              onClick={runAI}
              disabled={loadingAI}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold text-xs font-medium transition disabled:opacity-50"
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

          {aiError && (
            <div className="mt-3 p-3 bg-coral/10 rounded-lg border border-coral/20">
              <p className="text-xs text-coral">{aiError}</p>
            </div>
          )}

          {loadingAI && !insight && (
            <div className="mt-4 space-y-3">
              <div className="space-y-2">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-gold to-gold-soft rounded-full animate-pulse" />
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-gold to-gold-soft rounded-full animate-pulse" />
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-gold to-gold-soft rounded-full animate-pulse" />
                </div>
              </div>
              <div className="text-center pt-2">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={calmingIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] text-white/40 italic"
                  >
                    {(lang === "th" ? calmingMessagesTh : calmingMessagesEn)[calmingIdx % 4]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          )}

          {insight && (
            <div className="mt-3 space-y-4">
              {insight.summary && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-white/80 leading-relaxed">{insight.summary}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-3">
                {insight.strengths?.length > 0 && (
                  <div className="p-3 bg-emerald/5 rounded-lg border border-emerald/20">
                    <div className="flex items-center gap-1.5 mb-2">
                      <TrendingUp size={12} className="text-emerald" />
                      <span className="text-[10px] text-emerald uppercase tracking-wider font-semibold">
                        {lang === "th" ? "จุดแข็ง" : "Strengths"}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {insight.strengths.slice(0, 3).map((s: string, i: number) => (
                        <li key={i} className="text-xs text-white/70 flex items-start gap-1.5">
                          <span className="text-emerald text-[10px] mt-0.5">◆</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insight.focusAreas?.length > 0 && (
                  <div className="p-3 bg-gold/5 rounded-lg border border-gold/20">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Target size={12} className="text-gold" />
                      <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">
                        {lang === "th" ? "จุดที่ต้องพัฒนา" : "Focus Areas"}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {insight.focusAreas.slice(0, 3).map((s: string, i: number) => (
                        <li key={i} className="text-xs text-white/70 flex items-start gap-1.5">
                          <span className="text-gold text-[10px] mt-0.5">◆</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insight.dailyRitual?.length > 0 && (
                  <div className="p-3 bg-sky/5 rounded-lg border border-sky/20">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sun size={12} className="text-sky-400" />
                      <span className="text-[10px] text-sky-400 uppercase tracking-wider font-semibold">
                        {lang === "th" ? "กิจกรรมแนะนำ" : "Daily Ritual"}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {insight.dailyRitual.slice(0, 3).map((s: string, i: number) => (
                        <li key={i} className="text-xs text-white/70 flex items-start gap-1.5">
                          <span className="text-sky-400 text-[10px] mt-0.5">◆</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insight.avoid?.length > 0 && (
                  <div className="p-3 bg-coral/5 rounded-lg border border-coral/20">
                    <div className="flex items-center gap-1.5 mb-2">
                      <AlertCircle size={12} className="text-coral" />
                      <span className="text-[10px] text-coral uppercase tracking-wider font-semibold">
                        {lang === "th" ? "สิ่งที่ควรหลีกเลี่ยง" : "Avoid"}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {insight.avoid.slice(0, 3).map((s: string, i: number) => (
                        <li key={i} className="text-xs text-white/70 flex items-start gap-1.5">
                          <span className="text-coral text-[10px] mt-0.5">◆</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {recommended[0] && (
                <Link
                  to="/programs/$id"
                  params={{ id: recommended[0].id }}
                  className="block w-full mt-2 p-3 rounded-lg bg-gold/10 hover:bg-gold/20 border border-gold/30 transition text-center group"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Award size={14} className="text-gold" />
                    <span className="text-sm font-medium text-gold">
                      {lang === "th"
                        ? `แพ็กเกจแนะนำ: ${pick(recommended[0].name, lang)}`
                        : `Recommended: ${pick(recommended[0].name, lang)}`}
                    </span>
                    <ArrowRight size={14} className="text-gold group-hover:translate-x-1 transition" />
                  </div>
                  <div className="flex items-center justify-center gap-3 mt-1 text-[10px] text-white/50">
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
                className="w-full mt-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 text-xs font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
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
          )}

          {!insight && !loadingAI && !aiError && (
            <div className="mt-2 text-center">
              <p className="text-[10px] text-white/40">
                {lang === "th"
                  ? 'คลิก "เริ่มวิเคราะห์" เพื่อรับคำแนะนำเฉพาะบุคคลจาก AI'
                  : 'Click "Analyze" to get personalized AI insights'}
              </p>
            </div>
          )}
        </div>

        {/* Secondary Persona - Compact */}
        {secondary && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-sm">{secondary.emoji || "✨"}</span>
              </div>
              <div className="flex-1">
                <div className="text-[9px] text-white/40 uppercase tracking-wider">{t("persona.secondary")}</div>
                <div className="text-sm text-white/80 font-medium">{pick(secondary.name, lang)}</div>
                <div className="text-[10px] text-white/40">
                  {pick(secondary.thaiName, lang)} · {pick(secondary.tagline, lang)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Programs - Minimal */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-6 bg-gold/50" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold">
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
                  className="block bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-gold/30 transition-all duration-300 group"
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
                    <div className="text-[9px] tracking-wider text-gold uppercase">{pick(p.duration, lang)}</div>
                    <div className="font-display text-sm text-white/90 mt-0.5 line-clamp-1">{pick(p.name, lang)}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gold">฿{p.price.toLocaleString()}</span>
                      <ArrowRight
                        size={12}
                        className="text-white/40 group-hover:text-gold group-hover:translate-x-1 transition"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </DashShell>
  );
}

// Missing imports
import { Target, AlertCircle } from "lucide-react";
