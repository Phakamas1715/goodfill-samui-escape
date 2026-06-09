import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DashShell } from "@/components/DashShell";
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
    <DashShell
      bg="villa"
      host="gift"
      kicker="Personalized Programs"
      title="แพ็คเกจที่เกาะสมุย"
      subtitle={persona ? `แนะนำสำหรับ ${persona.name}` : "เลือกระยะเวลาที่เหมาะกับคุณ"}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {programs.map((p) => (
            <Link
              key={p.id}
              to="/programs/$id"
              params={{ id: p.id }}
              className="bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition flex flex-col shadow-sm"
            >
              <div className="aspect-[16/9] overflow-hidden relative">
                <img src={p.image} alt={p.name} loading="lazy" className="size-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur rounded-full px-2.5 py-0.5 text-[10px] tracking-widest uppercase text-gold">
                  {p.duration}
                </div>
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="font-display text-base md:text-lg text-navy line-clamp-1">{p.name}</div>
                <div className="text-[11px] text-muted-foreground line-clamp-1">{p.tagline}</div>
                <div className="text-[10px] text-muted-foreground mt-1">📍 {p.venue}</div>
                <ul className="mt-2 space-y-0.5 text-[11px] flex-1">
                  {p.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex items-start gap-1.5 text-navy/70">
                      <span className="text-gold mt-0.5">✦</span> {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex items-center justify-between pt-2 border-t border-mint/30">
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground">เริ่มต้น</div>
                    <div className="font-display text-base text-navy">฿{p.price.toLocaleString()}</div>
                  </div>
                  <div className="size-8 rounded-full bg-gold/15 grid place-items-center text-gold group-hover:bg-gold group-hover:text-emerald-deep transition">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </DashShell>
  );
}