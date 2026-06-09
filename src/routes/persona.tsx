import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, Wand2, Loader2, Send } from "lucide-react";
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
    state.secondaryPersona && state.secondaryPersona !== state.persona
      ? personas[state.secondaryPersona]
      : null;

  const fetchInsight = useServerFn(getPersonaInsight);
  const sendToChat = useServerFn(sendPersonaSummary);
  const navigate = useNavigate();
  const [insight, setInsight] = useState<any>(state.aiInsight ?? null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [sendingChat, setSendingChat] = useState(false);
  const calmingMessagesTh = [
    "หายใจเข้าลึกๆ ปล่อยลมหายใจช้าๆ…",
    "AI กำลังฟังเสียงภายในของคุณ…",
    "กำลังเรียบเรียง ritual ที่เหมาะกับจังหวะชีวิตคุณ…",
    "อีกสักครู่ ผู้เชี่ยวชาญในระบบกำลังจับคู่แพ็กเกจให้คุณ…",
  ];
  const calmingMessagesEn = [
    "Breathe in deeply, exhale slowly…",
    "AI is listening to your inner rhythm…",
    "Composing a ritual tuned to your pace…",
    "Matching the right specialists to your persona…",
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
        const channels = [
          result.line.ok ? "LINE" : null,
          result.telegram.ok ? "Telegram" : null,
        ].filter(Boolean).join(" + ");
        toast.success(
          lang === "th"
            ? `ส่งผลวิเคราะห์เข้า ${channels} ของคุณแล้ว ✓`
            : `Sent to your ${channels} ✓`,
          {
            description:
              lang === "th"
                ? "เปิดแอปเพื่อคุยต่อกับผู้ช่วย Goodfill ได้ทันที"
                : "Open the app to continue with the Goodfill assistant.",
          },
        );
      } else {
        toast.message(
          lang === "th" ? "ยังไม่ได้เชื่อมบัญชีแชต" : "No chat account linked yet",
          {
            description:
              lang === "th"
                ? "เชื่อม LINE หรือ Telegram กับโปรไฟล์ของคุณก่อน เพื่อรับผลวิเคราะห์เข้าแชต"
                : "Link your LINE or Telegram to receive the insight in chat.",
          },
        );
      }
    } catch (e: any) {
      const msg = String(e?.message ?? e ?? "");
      if (msg.includes("Unauthorized") || msg.includes("401")) {
        toast.message(
          lang === "th" ? "กรุณาเข้าสู่ระบบก่อน" : "Please sign in first",
          {
            description:
              lang === "th"
                ? "เข้าสู่ระบบด้วย LINE เพื่อส่งผลวิเคราะห์เข้าแชตของคุณ"
                : "Sign in with LINE to send the insight to your chat.",
          },
        );
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
          {loadingAI && !insight && (
            <div className="mt-3 space-y-2">
              <div className="relative overflow-hidden rounded-xl bg-white/8 border border-white/12 p-3">
                <div className="h-3 w-2/3 rounded-full bg-white/12 mb-2 overflow-hidden relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                </div>
                <div className="h-2.5 w-11/12 rounded-full bg-white/10 mb-1.5 overflow-hidden relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.4s_ease-in-out_infinite] [animation-delay:0.2s] bg-gradient-to-r from-transparent via-fuchsia-300/30 to-transparent" />
                </div>
                <div className="h-2.5 w-4/5 rounded-full bg-white/10 overflow-hidden relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.4s_ease-in-out_infinite] [animation-delay:0.4s] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="relative overflow-hidden rounded-xl bg-white/8 border border-white/12 p-2.5 h-16">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-gold/25 via-50% to-transparent" style={{ animationDelay: `${i * 0.15}s` }} />
                    <div className="h-2 w-1/2 rounded-full bg-white/15 mb-1.5" />
                    <div className="h-2 w-3/4 rounded-full bg-white/10" />
                  </div>
                ))}
              </div>
              <div className="text-center min-h-[1.25rem] mt-1">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={calmingIdx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.6 }}
                    className="text-[11px] tracking-wide text-gold/90 italic"
                  >
                    {(lang === "th" ? calmingMessagesTh : calmingMessagesEn)[calmingIdx % 4]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          )}
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
              {recommended[0] && (
                <Link
                  to="/programs/$id"
                  params={{ id: recommended[0].id }}
                  className="mt-4 btn-gold rounded-full w-full px-4 py-3 inline-flex items-center justify-center gap-2 text-sm font-bold shadow-[0_0_24px_rgba(244,166,74,0.45)] ring-1 ring-gold/60"
                >
                  <Sparkles size={14} />
                  {lang === "th"
                    ? `จองแพ็กเกจที่เหมาะกับคุณ · ${pick(recommended[0].name, lang)}`
                    : `Book your matched package · ${pick(recommended[0].name, lang)}`}
                  <ArrowRight size={14} />
                </Link>
              )}
              <button
                onClick={handleSendToChat}
                disabled={sendingChat}
                className="mt-2 w-full rounded-full px-4 py-2.5 inline-flex items-center justify-center gap-2 text-xs font-semibold bg-white/10 hover:bg-white/15 ring-1 ring-white/25 text-ivory disabled:opacity-60 transition"
              >
                {sendingChat ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} className="text-gold" />}
                {sendingChat
                  ? lang === "th" ? "กำลังส่ง…" : "Sending…"
                  : lang === "th" ? "ส่งผลวิเคราะห์นี้เข้า LINE / Telegram ของฉัน" : "Send this insight to my LINE / Telegram"}
              </button>
              <p className="mt-2 text-[10px] text-ivory/70 text-center">
                {lang === "th"
                  ? "ระบบจะแนบโปรไฟล์ Persona + บทวิเคราะห์ AI ให้ผู้เชี่ยวชาญอัตโนมัติ"
                  : "We attach your persona + AI insight to the partner brief automatically."}
              </p>
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
          {/* Mobile: swipeable horizontal carousel · Desktop: grid */}
          <div className="sm:hidden -mx-4 px-4">
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {recommended.map((p) => (
                <Link
                  key={p.id}
                  to="/programs/$id"
                  params={{ id: p.id }}
                  className="snap-center shrink-0 w-[78%] bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)] active:scale-[0.98] transition"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={p.image} alt={pick(p.name, lang)} loading="lazy" className="size-full object-cover" />
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
            <div className="flex justify-center gap-1.5 mt-1">
              {recommended.map((_, i) => (
                <span key={i} className="h-1 w-5 rounded-full bg-gold/30" />
              ))}
            </div>
            <p className="text-center text-[10px] text-ivory/60 mt-1">
              {lang === "th" ? "← ปัดเพื่อดูเพิ่มเติม →" : "← swipe to explore →"}
            </p>
          </div>
          <div className="hidden sm:grid grid-cols-3 gap-2">
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