import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Camera, Smile, QrCode, ArrowRight } from "lucide-react";
import { Shell, Section, Eyebrow } from "@/components/Shell";
import { programs } from "@/lib/data";
import { useAppState } from "@/lib/state";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "My Journey — Goodfill Care" },
      { name: "description", content: "ตารางวันของคุณที่เกาะสมุย พร้อม daily check-in" },
    ],
  }),
  component: JourneyPage,
});

function JourneyPage() {
  const [state, setState] = useAppState();
  const program = programs.find((p) => p.id === state.bookedProgramId);
  const [mood, setMood] = useState<number | null>(null);
  const [showQr, setShowQr] = useState(false);

  if (!program) {
    return (
      <Shell>
        <Section className="text-center">
          <Eyebrow>ยังไม่มีการจอง</Eyebrow>
          <h1 className="font-display text-4xl mt-4">เลือกโปรแกรมก่อนเริ่ม Journey</h1>
          <Link to="/programs" className="btn-gold rounded-full px-7 py-3 inline-flex items-center gap-2 mt-8">
            ดูโปรแกรม <ArrowRight size={16} />
          </Link>
        </Section>
      </Shell>
    );
  }

  const today = program.schedule[1] ?? program.schedule[0];
  const arrival = new Date(state.bookingDate ?? Date.now());

  function logCheckin(m: number) {
    setMood(m);
    setState((s) => ({
      ...s,
      checkins: [
        ...s.checkins,
        { date: new Date().toISOString(), mood: m },
      ],
      credits: s.credits + 20,
    }));
  }

  return (
    <Shell>
      <Section>
        <Eyebrow>Phase 3 · Partner Experience</Eyebrow>
        <div className="flex flex-wrap items-end justify-between gap-4 mt-3">
          <h1 className="font-display text-4xl md:text-5xl">
            สวัสดีคุณ <em className="gold-text not-italic">guest</em>
          </h1>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar size={14} /> เช็คอิน {arrival.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mt-12">
          <div className="lg:col-span-2 glass rounded-3xl p-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs tracking-widest text-gold uppercase">{program.name}</div>
                <div className="font-display text-2xl mt-1">{today.day}</div>
              </div>
              <div className="size-12 rounded-full bg-emerald/20 grid place-items-center text-gold">
                ☀
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {today.items.map((i, idx) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition">
                  <div className="size-7 rounded-full border border-gold/40 grid place-items-center text-xs text-gold mt-0.5">{idx + 1}</div>
                  <div className="text-sm">{i}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <div className="glass rounded-3xl p-6">
              <div className="text-xs tracking-widest text-gold uppercase flex items-center gap-2">
                <QrCode size={14} /> Service QR
              </div>
              <p className="text-sm text-muted-foreground mt-2">แสดง QR ให้พาร์ทเนอร์เพื่อรับบริการ</p>
              {!showQr ? (
                <button onClick={() => setShowQr(true)} className="btn-emerald rounded-full px-5 py-2 mt-4 text-sm">เปิด QR</button>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 aspect-square rounded-2xl bg-white p-4 grid place-items-center">
                  <div className="size-full grid grid-cols-8 grid-rows-8 gap-0.5">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="bg-emerald-deep" style={{ opacity: ((i * 37) % 7 < 4) ? 1 : 0 }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="glass rounded-3xl p-6">
              <div className="text-xs tracking-widest text-gold uppercase flex items-center gap-2">
                <Smile size={14} /> Daily mood
              </div>
              <p className="text-sm text-muted-foreground mt-2">วันนี้คุณรู้สึกอย่างไร? (+20 credits)</p>
              <div className="flex justify-between mt-4 gap-1">
                {["😴", "😐", "🙂", "😊", "🤩"].map((e, i) => (
                  <button
                    key={i}
                    onClick={() => logCheckin(i + 1)}
                    className={`flex-1 aspect-square rounded-xl text-2xl transition ${mood === i + 1 ? "bg-gold/20 border border-gold/60" : "hover:bg-white/5"}`}
                  >{e}</button>
                ))}
              </div>
              {mood && <p className="text-sm text-emerald mt-3">✓ บันทึกแล้ว · +20 Calm Credits</p>}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">เมื่อจบทริปแล้ว ดูสรุปผลของคุณ</div>
          <Link to="/report" className="btn-gold rounded-full px-6 py-3 text-sm inline-flex items-center gap-2">
            <Camera size={14} /> ดู Final Report
          </Link>
        </div>
      </Section>
    </Shell>
  );
}