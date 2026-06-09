import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Camera, Smile, QrCode, ArrowRight } from "lucide-react";
import { DashShell, DashCard } from "@/components/DashShell";
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
      <DashShell bg="villa" host="welcome" kicker="My Journey" title="ยังไม่มีการจอง" subtitle="เลือกโปรแกรมก่อนเริ่ม Journey">
        <DashCard className="text-center">
          <Link to="/programs" className="btn-gold rounded-full px-6 py-3 inline-flex items-center gap-2 text-sm">
            ดูโปรแกรม <ArrowRight size={16} />
          </Link>
        </DashCard>
      </DashShell>
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
    <DashShell
      bg="yoga"
      host="fitness"
      kicker="Phase 3 · Partner Experience"
      title="My Journey · วันนี้"
      subtitle={`เช็คอิน ${arrival.toLocaleDateString("th-TH", { day: "numeric", month: "short" })} · ${program.name}`}
    >
      <div className="grid lg:grid-cols-3 gap-3">
        <DashCard className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs tracking-widest text-gold uppercase">{program.name}</div>
                <div className="font-display text-xl mt-1 text-navy">{today.day}</div>
              </div>
              <div className="size-10 rounded-full bg-pale-mint grid place-items-center text-gold">
                ☀
              </div>
            </div>
            <ul className="mt-3 space-y-1.5">
              {today.items.map((i, idx) => (
                <li key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-pale-mint/40 transition">
                  <div className="size-6 rounded-full bg-pale-mint border border-mint grid place-items-center text-[10px] text-emerald mt-0.5 shrink-0">{idx + 1}</div>
                  <div className="text-sm text-navy/90">{i}</div>
                </li>
              ))}
            </ul>
        </DashCard>

        <div className="space-y-3">
          <DashCard>
            <div className="text-xs tracking-widest text-gold uppercase flex items-center gap-2">
              <QrCode size={14} /> Service QR
            </div>
            <p className="text-xs text-muted-foreground mt-1">แสดง QR ให้พาร์ทเนอร์</p>
              {!showQr ? (
                <button onClick={() => setShowQr(true)} className="btn-emerald rounded-full px-4 py-2 mt-3 text-xs w-full">เปิด QR</button>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-3 aspect-square rounded-xl bg-white p-3 grid place-items-center">
                  <div className="size-full grid grid-cols-8 grid-rows-8 gap-0.5">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="bg-emerald-deep" style={{ opacity: ((i * 37) % 7 < 4) ? 1 : 0 }} />
                    ))}
                  </div>
                </motion.div>
              )}
          </DashCard>

          <DashCard>
            <div className="text-xs tracking-widest text-gold uppercase flex items-center gap-2">
              <Smile size={14} /> Daily mood
            </div>
            <p className="text-xs text-muted-foreground mt-1">วันนี้รู้สึกอย่างไร? (+20)</p>
            <div className="flex justify-between mt-3 gap-1">
                {["😴", "😐", "🙂", "😊", "🤩"].map((e, i) => (
                  <button
                    key={i}
                    onClick={() => logCheckin(i + 1)}
                    className={`flex-1 aspect-square rounded-xl text-xl transition ${mood === i + 1 ? "bg-gold/20 ring-2 ring-gold" : "bg-pale-mint/40 hover:bg-pale-mint"}`}
                  >{e}</button>
                ))}
              </div>
            {mood && <p className="text-xs text-emerald mt-2">✓ +20 Calm Credits</p>}
          </DashCard>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div className="text-xs text-muted-foreground hidden sm:block"><Calendar size={12} className="inline mr-1" />เมื่อจบทริปแล้ว ดูสรุปผล</div>
        <Link to="/report" className="btn-gold rounded-full px-5 py-2.5 text-xs inline-flex items-center gap-2 ml-auto">
            <Camera size={14} /> ดู Final Report
          </Link>
      </div>
    </DashShell>
  );
}