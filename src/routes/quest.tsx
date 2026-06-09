import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { DashShell } from "@/components/DashShell";
import { questions, scorePersona } from "@/lib/data";
import { useAppState } from "@/lib/state";

export const Route = createFileRoute("/quest")({
  head: () => ({
    meta: [
      { title: "Wellness Quest — Goodfill Care" },
      { name: "description", content: "ตอบ 8 ข้อ ค้นพบ Wellness Persona ของคุณ พร้อมรับ 300 Calm Credits" },
    ],
  }),
  component: Quest,
});

function Quest() {
  const navigate = useNavigate();
  const [state, setState] = useAppState();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(state.questAnswers ?? {});

  const q = questions[step];
  const progress = ((step + (answers[q.id] != null ? 1 : 0)) / questions.length) * 100;
  const selected = answers[q.id];

  const persona = useMemo(() => scorePersona(answers), [answers]);

  function choose(idx: number) {
    setAnswers((a) => ({ ...a, [q.id]: idx }));
  }

  function next() {
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
    } else {
      setState((s) => ({
        ...s,
        questAnswers: answers,
        persona,
        credits: s.persona ? s.credits : s.credits + 300,
      }));
      navigate({ to: "/persona" });
    }
  }

  return (
    <DashShell
      bg="yoga"
      host="fitness"
      kicker={`Wellness Quest · ${step + 1}/${questions.length}`}
      title={q.question}
      subtitle={`+300 Calm Credits เมื่อทำเสร็จ`}
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
            <div className="text-4xl md:text-5xl">{q.emoji}</div>
            <div className="mt-3 grid gap-2">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => choose(idx)}
                  className={`bg-white/85 backdrop-blur-md border rounded-2xl p-3 md:p-4 text-left flex items-center justify-between gap-3 transition group shadow-sm ${
                    selected === idx ? "border-gold ring-2 ring-gold/30 bg-gold/5" : "border-white/60 hover:bg-pale-mint/40"
                  }`}
                >
                  <span className="text-sm text-navy">{opt.label}</span>
                  <span
                    className={`size-6 rounded-full grid place-items-center transition shrink-0 ${
                      selected === idx
                        ? "bg-gold text-emerald-deep"
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
            <ArrowLeft size={14} /> ย้อนกลับ
          </button>
          <button
            onClick={next}
            disabled={selected == null}
            className="btn-gold rounded-full px-5 py-2.5 inline-flex items-center gap-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === questions.length - 1 ? "ดูผลลัพธ์" : "ถัดไป"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </DashShell>
  );
}