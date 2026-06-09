import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Shell, Section, Eyebrow } from "@/components/Shell";
import { programs, personas } from "@/lib/data";
import { useAppState } from "@/lib/state";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Goodfill Care" },
      { name: "description", content: "แพ็คเกจ Wellness ที่เกาะสมุย 3-7 วัน เลือกตามเป้าหมายของคุณ" },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const [state] = useAppState();
  const persona = state.persona ? personas[state.persona] : null;

  return (
    <Shell>
      <Section>
        <div className="max-w-2xl">
          <Eyebrow>Personalized Programs</Eyebrow>
          <h1 className="font-display text-5xl md:text-6xl mt-4">
            แพ็คเกจที่เกาะสมุย
          </h1>
          <p className="mt-5 text-muted-foreground">
            เลือกระยะเวลาที่เหมาะกับคุณ — ทุกโปรแกรมออกแบบโดยทีมแพทย์ นักโภชนาการ
            และผู้เชี่ยวชาญด้านโยคะ สมาธิ
          </p>
          {persona && (
            <div className="mt-6 inline-flex items-center gap-3 glass rounded-full px-4 py-2 text-sm">
              <span className="size-2 rounded-full bg-gold" />
              คุณคือ <span className="text-gold">{persona.name}</span> — เราจัดลำดับโปรแกรมที่เหมาะกับคุณไว้ด้านบนแล้ว
            </div>
          )}
        </div>

        <div className="mt-14 grid lg:grid-cols-3 gap-5">
          {programs.map((p) => (
            <Link
              key={p.id}
              to="/programs/$id"
              params={{ id: p.id }}
              className="glass rounded-3xl overflow-hidden group hover:bg-white/5 transition flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={p.image} alt={p.name} loading="lazy" className="size-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[11px] tracking-widest uppercase text-gold">
                  {p.duration}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="font-display text-2xl">{p.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{p.tagline}</div>
                <div className="text-xs text-muted-foreground mt-3">📍 {p.venue}</div>
                <ul className="mt-5 space-y-2 text-sm flex-1">
                  {p.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-gold mt-0.5">✦</span> {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between pt-5 border-t border-white/10">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">เริ่มต้น</div>
                    <div className="font-display text-xl">฿{p.price.toLocaleString()}</div>
                  </div>
                  <div className="size-10 rounded-full bg-gold/10 grid place-items-center text-gold group-hover:bg-gold group-hover:text-emerald-deep transition">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </Shell>
  );
}