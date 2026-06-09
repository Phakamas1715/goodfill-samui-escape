import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { DashShell, DashCard } from "@/components/DashShell";
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
  const secondary =
    state.secondaryPersona && state.secondaryPersona !== state.persona
      ? personas[state.secondaryPersona]
      : null;

  if (!persona) {
    return (
      <DashShell bg="yoga" host="welcome" kicker="Wellness Persona" title="ยังไม่มีผลลัพธ์" subtitle="ตอบ 8 ข้อสั้นๆ เพื่อค้นพบ persona">
        <DashCard className="text-center">
          <Link to="/quest" className="btn-gold rounded-full px-6 py-3 inline-flex items-center gap-2 text-sm">
            เริ่มแบบประเมิน <ArrowRight size={16} />
          </Link>
        </DashCard>
      </DashShell>
    );
  }

  const recommended = programsForPersona(persona.id);

  return (
    <DashShell bg="meditation" host="wai" kicker="Your Wellness Persona" title={persona.name} subtitle={persona.thaiName}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <DashCard className={`bg-gradient-to-br ${persona.color}`}>
          <p className="text-sm md:text-base text-navy">{persona.tagline}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{persona.description}</p>
          <div className="flex items-center gap-1.5 text-gold text-[10px] tracking-[0.25em] uppercase mt-3">
            <Sparkles size={12} /> 4 Wellness Pillars
          </div>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-1.5">
            {persona.pillars.map((p) => (
              <div key={p} className="rounded-xl bg-white/70 border border-white/60 p-2 text-center">
                <div className="text-[11px] font-medium text-navy">{p}</div>
              </div>
            ))}
          </div>
        </DashCard>

        {secondary && (
          <DashCard className="mt-3">
            <div className="text-[10px] tracking-[0.25em] uppercase text-gold">Persona รอง</div>
            <div className="font-display text-lg text-navy mt-0.5">{secondary.name}</div>
            <div className="text-xs text-muted-foreground">{secondary.thaiName} · {secondary.tagline}</div>
          </DashCard>
        )}

        <div className="mt-3">
          <div className="text-[11px] tracking-widest uppercase text-gold mb-2">โปรแกรมที่แนะนำ</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {recommended.map((p) => (
              <Link
                key={p.id}
                to="/programs/$id"
                params={{ id: p.id }}
                className="bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition shadow-sm"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={p.image} alt={p.name} loading="lazy" className="size-full object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="p-3">
                  <div className="text-[10px] tracking-widest text-gold uppercase">{p.duration}</div>
                  <div className="font-display text-base text-navy mt-0.5 line-clamp-1">{p.name}</div>
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