import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Shell, Section, Eyebrow } from "@/components/Shell";
import { personas, programsForPersona } from "@/lib/data";
import { useAppState } from "@/lib/state";

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
  const [state] = useAppState();
  const persona = state.persona ? personas[state.persona] : null;

  if (!persona) {
    return (
      <Shell>
        <Section className="text-center">
          <Eyebrow>ยังไม่มีผลลัพธ์</Eyebrow>
          <h1 className="font-display text-4xl mt-4">เริ่มทำแบบประเมินก่อน</h1>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            ตอบ 8 ข้อสั้นๆ เพื่อค้นพบ Wellness Persona ของคุณ
          </p>
          <Link to="/quest" className="btn-gold rounded-full px-7 py-3 inline-flex items-center gap-2 mt-8">
            เริ่มแบบประเมิน <ArrowRight size={16} />
          </Link>
        </Section>
      </Shell>
    );
  }

  const recommended = programsForPersona(persona.id);

  return (
    <Shell>
      <Section>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center">
            <Eyebrow>Your Wellness Persona</Eyebrow>
            <h1 className="font-display text-5xl md:text-7xl mt-5">
              <em className="gold-text not-italic">{persona.name}</em>
            </h1>
            <p className="font-display italic text-xl text-muted-foreground mt-3">{persona.thaiName}</p>
            <p className="text-lg mt-6 max-w-xl mx-auto">{persona.tagline}</p>
            <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">{persona.description}</p>
          </div>

          <div className={`mt-12 glass rounded-[2rem] p-8 md:p-10 bg-gradient-to-br ${persona.color}`}>
            <div className="flex items-center gap-2 text-gold text-xs tracking-[0.25em] uppercase">
              <Sparkles size={14} /> 4 Wellness Pillars
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {persona.pillars.map((p) => (
                <div key={p} className="rounded-2xl border border-white/10 bg-background/30 p-4 text-center">
                  <div className="text-sm font-medium">{p}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 glass rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs tracking-widest uppercase text-gold">Calm Credits</div>
              <div className="font-display text-3xl mt-1">{state.credits}</div>
            </div>
            <div className="text-sm text-muted-foreground text-right max-w-xs">
              ใช้เป็นส่วนลดในการจองโปรแกรมที่จับคู่กับคุณด้านล่าง
            </div>
          </div>
        </motion.div>

        <div className="mt-20">
          <Eyebrow>โปรแกรมที่แนะนำสำหรับคุณ</Eyebrow>
          <h2 className="font-display text-3xl md:text-4xl mt-3">เลือกระยะเวลาที่ใช่</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {recommended.map((p) => (
              <Link
                key={p.id}
                to="/programs/$id"
                params={{ id: p.id }}
                className="glass rounded-3xl overflow-hidden group hover:bg-white/5 transition"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.image} alt={p.name} loading="lazy" className="size-full object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="p-5">
                  <div className="text-xs tracking-widest text-gold uppercase">{p.duration}</div>
                  <div className="font-display text-xl mt-1">{p.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.tagline}</div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">฿{p.price.toLocaleString()}</div>
                    <ArrowRight size={16} className="text-gold" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </Shell>
  );
}