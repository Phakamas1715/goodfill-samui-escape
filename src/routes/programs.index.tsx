import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { DashShell } from "@/components/DashShell";
import { programs, personas } from "@/lib/data";
import { useAppState } from "@/lib/state";

export const Route = createFileRoute("/programs/")({
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
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] tracking-[0.25em] uppercase text-gold">ปัดซ้าย-ขวาเพื่อดูแพ็คเกจ</div>
        <div className="text-[10px] text-muted-foreground">{programs.length} แพ็คเกจ</div>
      </div>
      <div className="-mx-5 md:-mx-8 px-5 md:px-8 overflow-x-auto snap-x snap-mandatory scrollbar-none [-webkit-overflow-scrolling:touch]">
        <div className="flex gap-3 md:gap-4 pb-2">
          {programs.map((p, i) => (
            <Link
              key={p.id}
              to="/programs/$id"
              params={{ id: p.id }}
              className="snap-center shrink-0 w-[82vw] sm:w-[60vw] md:w-[420px] lg:w-[460px] bg-white/90 backdrop-blur-md border border-white/70 rounded-3xl overflow-hidden group shadow-[0_18px_45px_-20px_rgba(11,30,30,0.5)] flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img src={p.image} alt={p.name} loading="lazy" className="size-full object-cover group-hover:scale-105 transition duration-700" />
                {/* Strong gradient for text contrast over photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/85 via-emerald-deep/30 to-transparent" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-full px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-emerald-deep font-semibold shadow">
                  {p.duration}
                </div>
                <div className="absolute top-3 right-3 bg-gold/95 backdrop-blur rounded-full size-7 grid place-items-center text-[10px] font-bold text-emerald-deep shadow">
                  {i + 1}
                </div>
                <div className="absolute inset-x-3 bottom-3 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                  <div className="font-display text-xl md:text-2xl leading-tight line-clamp-1">{p.name}</div>
                  <div className="text-[12px] text-white/95 line-clamp-1 mt-0.5">{p.tagline}</div>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 text-[11px] text-navy/80">
                  <MapPin size={12} className="text-gold" /> <span className="line-clamp-1">{p.venue}</span>
                </div>
                <ul className="mt-2.5 space-y-1 text-[12px] flex-1">
                  {p.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex items-start gap-1.5 text-navy/85">
                      <span className="text-gold mt-0.5 shrink-0">✦</span> <span className="line-clamp-1">{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between pt-3 border-t border-mint/40">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">เริ่มต้น</div>
                    <div className="font-display text-lg text-emerald-deep">฿{p.price.toLocaleString()}</div>
                  </div>
                  <div className="rounded-full bg-emerald-deep text-ivory px-3 py-1.5 text-[11px] inline-flex items-center gap-1 group-hover:bg-gold group-hover:text-emerald-deep transition">
                    ดูรายละเอียด <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {/* trailing breathing space */}
          <div className="shrink-0 w-2" />
        </div>
      </div>
      {/* Dots indicator (decorative; reflects count) */}
      <div className="mt-2 flex items-center justify-center gap-1.5">
        {programs.map((p, i) => (
          <span key={p.id} className={`h-1 rounded-full transition-all ${i === 0 ? "w-6 bg-gold" : "w-1.5 bg-white/60"}`} />
        ))}
      </div>
    </DashShell>
  );
}