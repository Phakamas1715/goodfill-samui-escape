import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { DashShell } from "@/components/DashShell";
import { questions, scorePersonaTop2, pick } from "@/lib/data";
import { useAppState } from "@/lib/state";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/quest")({
  head: () => ({
    meta: [
      { title: "Wellness Quest — Goodfill Care" },
      { name: "description", content: "ตอบ 8 ข้อสั้น ๆ เพื่อค้นพบ Wellness Persona ของคุณ — Sleep Seeker, Energy Rebuilder, Detox Reset หรือ Mindful Glow พร้อมรับ 300 Calm Credits ทันที" },
      { property: "og:title", content: "Wellness Quest — ค้นพบ Persona ของคุณใน 8 ข้อ" },
      { property: "og:description", content: "แบบประเมินสั้น ๆ เพื่อจับคู่คุณกับโปรแกรม Wellness ที่เกาะสมุยที่เหมาะกับร่างกายและจิตใจคุณที่สุด" },
      { property: "og:url", content: "https://goodfillcare-samui.com/quest" },
    ],
    links: [
      { rel: "canonical", href: "https://goodfillcare-samui.com/quest" },
    ],
  }),
  component: Quest,
});

function Quest() {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const [state, setState] = useAppState();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(state.questAnswers ?? {});

  const q = questions[step];
  const progress = ((step + (answers[q.id] != null ? 1 : 0)) / questions.length) * 100;
  const selected = answers[q.id];

  const [persona, secondaryPersona] = useMemo(() => scorePersonaTop2(answers), [answers]);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function finishWith(finalAnswers: Record<number, number>) {
    const [p, sp] = scorePersonaTop2(finalAnswers);
    setState((s) => ({
      ...s,
      questAnswers: finalAnswers,
      persona: p,
      secondaryPersona: sp,
      credits: s.persona ? s.credits : s.credits + 300,
    }));
    navigate({ to: "/persona" });
  }

  function choose(idx: number) {
    const nextAnswers = { ...answers, [q.id]: idx };
    setAnswers(nextAnswers);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      if (step < questions.length - 1) {
        setStep((s) => s + 1);
      } else {
        finishWith(nextAnswers);
      }
    }, 380);
  }

  function next() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
    } else {
      finishWith(answers);
    }
  }

  return (
    <DashShell
      bg="yoga"
      host="fitness"
      kicker={`Wellness Quest · ${step + 1}/${questions.length}`}
      title={pick(q.question, lang)}
      subtitle={t("quest.subtitle")}
    >
      <div className="max-w-2xl mx-auto w-full">
        <div className="h-1 bg-white/60 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald to-gold"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <div className="text-3xl md:text-4xl">{q.emoji}</div>
            <div className="mt-3 grid gap-2">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => choose(idx)}
                  className={`backdrop-blur-md border-2 rounded-2xl px-3 py-2.5 md:px-4 md:py-3 text-left flex items-center justify-between gap-3 transition-all duration-200 group shadow-sm ${
                    selected === idx
                      ? "border-emerald bg-emerald text-white shadow-md scale-[1.015]"
                      : "bg-white/85 border-white/60 text-navy hover:bg-pale-mint/40 hover:border-emerald/40"
                  }`}
                >
                  <span className={`text-[13px] md:text-sm font-medium leading-snug break-words flex-1 min-w-0 ${selected === idx ? "text-white" : "text-navy"}`}>
                    {pick(opt.label, lang)}
                  </span>
                  <span
                    className={`size-5 md:size-6 rounded-full grid place-items-center transition shrink-0 ${
                      selected === idx
                        ? "bg-gold text-emerald-deep scale-110"
                        : "border border-mint text-transparent group-hover:border-emerald/60"
                    }`}
                  >
                    <Check size={12} />
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-xs text-muted-foreground hover:text-foreground transition flex items-center gap-1.5 disabled:opacity-30"
          >
            <ArrowLeft size={14} /> {t("common.back")}
          </button>
          <button
            onClick={next}
            disabled={selected == null}
            className={`rounded-full px-5 py-2.5 inline-flex items-center gap-1.5 text-xs font-semibold transition-all ${
              selected == null
                ? "bg-muted text-muted-foreground/60 cursor-not-allowed"
                : "btn-gold shadow-lg hover:scale-[1.03]"
            }`}
          >
            {step === questions.length - 1 ? t("common.viewResult") : t("common.next")}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </DashShell>
  );
}