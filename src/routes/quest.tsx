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
      {
        name: "description",
        content:
          "ตอบ 8 ข้อสั้น ๆ เพื่อค้นพบ Wellness Persona ของคุณ — Sleep Seeker, Energy Rebuilder, Detox Reset หรือ Mindful Glow พร้อมรับ 300 Calm Credits ทันที",
      },
      { property: "og:title", content: "Wellness Quest — ค้นพบ Persona ของคุณใน 8 ข้อ" },
      {
        property: "og:description",
        content:
          "แบบประเมินสั้น ๆ เพื่อจับคู่คุณกับโปรแกรม Wellness ที่เกาะสมุยที่เหมาะกับร่างกายและจิตใจคุณที่สุด",
      },
      { property: "og:url", content: "https://goodfillcare-samui.com/quest" },
    ],
    links: [{ rel: "canonical", href: "https://goodfillcare-samui.com/quest" }],
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
      kicker={`Wellness Quest · ${step + 1}/${questions.length}`}
      title={pick(q.question, lang)}
      subtitle={t("quest.subtitle")}
    >
      <div className="max-w-3xl mx-auto w-full px-4 md:px-0">
        {/* Progress Bar */}
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="mt-8"
          >
            {/* Emoji */}
            <div className="text-6xl md:text-7xl mb-5 drop-shadow-lg">{q.emoji}</div>

            {/* Question Text - เพิ่มให้เห็นชัดเจน */}
            <div className="text-white text-xl md:text-2xl font-medium mb-6 drop-shadow-md">
              {pick(q.question, lang)}
            </div>

            {/* Option Cards */}
            <div className="mt-2 grid gap-4">
              {q.options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => choose(idx)}
                  whileHover={{ scale: selected === idx ? 1 : 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`group backdrop-blur-md border-2 rounded-2xl px-5 py-4 md:px-6 md:py-5 text-left flex items-center justify-between gap-4 transition-all duration-200 shadow-md ${
                    selected === idx
                      ? "border-emerald bg-gradient-to-r from-emerald to-emerald/90 text-white shadow-xl scale-[1.01]"
                      : "bg-white/90 border-white/30 text-navy hover:bg-white/95 hover:border-emerald/40 hover:shadow-lg"
                  }`}
                >
                  <span
                    className={`text-base md:text-lg font-medium leading-relaxed break-words flex-1 min-w-0 ${
                      selected === idx ? "text-white" : "text-navy"
                    }`}
                  >
                    {pick(opt.label, lang)}
                  </span>
                  <motion.span
                    animate={selected === idx ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className={`size-7 md:size-8 rounded-full grid place-items-center transition-all duration-200 shrink-0 ${
                      selected === idx
                        ? "bg-gold text-emerald-deep scale-110 shadow-md"
                        : "border-2 border-mint/50 text-transparent group-hover:border-emerald/60 group-hover:scale-105"
                    }`}
                  >
                    <Check size={16} strokeWidth={2.5} />
                  </motion.span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-10 flex items-center justify-between">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm md:text-base text-white/70 hover:text-white transition flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
          >
            <ArrowLeft size={18} /> {t("common.back")}
          </motion.button>
          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={next}
            disabled={selected == null}
            className={`rounded-full px-6 py-3 md:px-8 md:py-3.5 inline-flex items-center gap-2 text-sm md:text-base font-semibold transition-all duration-200 ${
              selected == null
                ? "bg-white/10 text-white/40 cursor-not-allowed backdrop-blur-sm"
                : "btn-gold shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {step === questions.length - 1 ? t("common.viewResult") : t("common.next")}
            <ArrowRight size={18} />
          </motion.button>
        </div>

        {/* Progress Indicator Text */}
        <div className="mt-6 text-center">
          <span className="text-white/40 text-xs tracking-wider">
            {step + 1} / {questions.length}
          </span>
        </div>

        {/* Calm Credits Badge */}
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 backdrop-blur-sm border border-gold/30">
            <span className="text-gold text-xs">✨</span>
            <span className="text-gold-soft text-[10px] font-medium tracking-wide">
              +300 Calm Credits เมื่อทำเสร็จ
            </span>
          </div>
        </div>
      </div>
    </DashShell>
  );
}
