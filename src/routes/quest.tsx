import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { Shell, Eyebrow } from "@/components/Shell";
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
    <Shell>
      <div className="mx-auto max-w-3xl px-5 md:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between text-xs tracking-[0.25em] uppercase text-muted-foreground">
          <span>Wellness Quest</span>
          <span>{step + 1} / {questions.length}</span>
        </div>
        <div className="mt-3 h-[2px] bg-white/10 rounded-full overflow-hidden">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="mt-12 md:mt-20"
          >
            <div className="text-6xl md:text-7xl">{q.emoji}</div>
            <h1 className="font-display text-3xl md:text-4xl mt-6 leading-snug">
              {q.question}
            </h1>
            <div className="mt-10 grid gap-3">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => choose(idx)}
                  className={`glass rounded-2xl p-5 text-left flex items-center justify-between gap-4 transition group hover:bg-white/5 ${
                    selected === idx ? "border-gold/60 bg-gold/5" : ""
                  }`}
                >
                  <span className="text-sm md:text-base">{opt.label}</span>
                  <span
                    className={`size-7 rounded-full grid place-items-center transition ${
                      selected === idx
                        ? "bg-gold text-emerald-deep"
                        : "border border-white/20 text-transparent group-hover:border-white/40"
                    }`}
                  >
                    <Check size={14} />
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-2 disabled:opacity-30"
          >
            <ArrowLeft size={16} /> ย้อนกลับ
          </button>
          <button
            onClick={next}
            disabled={selected == null}
            className="btn-gold rounded-full px-7 py-3 inline-flex items-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === questions.length - 1 ? "ดูผลลัพธ์" : "ถัดไป"}
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-16 text-center">
          <Eyebrow>+300 Calm Credits</Eyebrow>
          <p className="text-xs text-muted-foreground mt-3">รับฟรีเมื่อทำแบบประเมินเสร็จ · ใช้เป็นส่วนลดในการจองโปรแกรม</p>
        </div>
      </div>
    </Shell>
  );
}