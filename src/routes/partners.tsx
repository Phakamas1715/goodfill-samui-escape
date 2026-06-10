import { createFileRoute, Link } from "@tanstack/react-router";
import { DashShell, DashCard } from "@/components/DashShell";
import { partnerGroups, outreachOrder } from "@/lib/partners";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import {
  ChevronRight,
  Sparkles,
  Hotel,
  Utensils,
  Activity,
  Stethoscope,
  Plane,
  Gift,
} from "lucide-react";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Target Partners — Goodfill Care" },
      {
        name: "description",
        content:
          "รายชื่อพาร์ทเนอร์เป้าหมายของ Goodfill Care บนเกาะสมุย — รีสอร์ท สปา ร้านอาหารสุขภาพ คลินิก และทัวร์ Wellness",
      },
    ],
  }),
  component: PartnersPage,
});

const groupIcon = {
  A: Sparkles,
  B: Hotel,
  C: Utensils,
  D: Activity,
  E: Stethoscope,
  F: Plane,
  G: Gift,
} as const;

function PartnersPage() {
  const { lang } = useI18n();
  const [active, setActive] = useState<(typeof partnerGroups)[number]["id"]>("A");
  const group = partnerGroups.find((g) => g.id === active)!;

  return (
    <DashShell
      bg="villa"
      host="wai"
      kicker={lang === "th" ? "พาร์ทเนอร์เป้าหมาย" : "Target Partners"}
      title={lang === "th" ? "เครือข่ายที่เรากำลังทาบทาม" : "Network we are courting"}
      subtitle={
        lang === "th"
          ? "Prospect list — ยังไม่ใช่พาร์ทเนอร์ที่ตกลงแล้ว"
          : "Prospect list — not yet signed partners"
      }
    >
      <div className="flex flex-col lg:grid lg:grid-cols-[220px,1fr] gap-3 lg:h-full lg:min-h-0">
        {/* GROUP RAIL — chips on mobile, vertical list on desktop */}
        <DashCard className="!p-2 lg:overflow-y-auto">
          <div className="hidden lg:block text-[10px] tracking-[0.25em] uppercase text-gold px-2 py-1.5">
            Groups
          </div>
          <div className="flex lg:flex-col gap-1.5 lg:gap-1 overflow-x-auto lg:overflow-visible -mx-1 px-1 lg:mx-0 lg:px-0 scrollbar-thin">
            {partnerGroups.map((g) => {
              const Icon = groupIcon[g.id];
              const on = g.id === active;
              return (
                <button
                  key={g.id}
                  onClick={() => setActive(g.id)}
                  className={`flex items-center gap-2 lg:gap-2.5 px-2.5 py-2 rounded-xl text-left transition shrink-0 lg:shrink ${
                    on ? "bg-emerald text-ivory shadow-md" : "hover:bg-pale-mint text-navy"
                  }`}
                >
                  <span
                    className={`size-7 grid place-items-center rounded-lg font-display text-sm shrink-0 ${
                      on ? "bg-white/20 text-ivory" : "bg-pale-mint text-emerald"
                    }`}
                  >
                    {g.id}
                  </span>
                  <span className="flex-1 min-w-0 hidden lg:block">
                    <span className="block text-xs font-medium leading-tight truncate">
                      {g.title[lang]}
                    </span>
                    <span
                      className={`block text-[10px] leading-tight truncate ${on ? "text-ivory/75" : "text-muted-foreground"}`}
                    >
                      {g.partners.length} prospects
                    </span>
                  </span>
                  <span className="lg:hidden text-xs font-medium pr-1 whitespace-nowrap">
                    {g.title[lang]}
                  </span>
                  <Icon size={14} className={`hidden lg:inline ${on ? "text-ivory/80" : "text-emerald/60"}`} />
                </button>
              );
            })}
          </div>
        </DashCard>

        {/* DETAIL */}
        <div className="flex flex-col gap-3 min-h-0">
          <DashCard className="!p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] tracking-[0.28em] uppercase text-gold">
                  Group {group.id}
                </div>
                <h2 className="font-display text-xl md:text-2xl text-navy mt-0.5 truncate">
                  {group.title[lang]}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">{group.intent[lang]}</p>
              </div>
              <span className="pill bg-pale-mint text-emerald shrink-0">
                {group.partners.length}
              </span>
            </div>
          </DashCard>

          <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1">
            <div className="grid sm:grid-cols-2 gap-2">
              {group.partners.map((p) => (
                <div
                  key={p.name}
                  className="bg-white/85 backdrop-blur-md rounded-xl border border-white/60 p-3 shadow-sm flex items-start gap-2.5"
                >
                  <span className="size-8 rounded-lg bg-pale-mint border border-mint/60 text-emerald grid place-items-center shrink-0 mt-0.5">
                    <ChevronRight size={14} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-navy leading-tight">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                      {p.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {active === "A" && (
              <DashCard className="!p-4 mt-3">
                <div className="text-[10px] tracking-[0.28em] uppercase text-gold mb-2">
                  {lang === "th" ? "ลำดับทาบทาม" : "Outreach order"}
                </div>
                <ol className="space-y-1.5">
                  {outreachOrder.map((line, i) => (
                    <li key={line} className="flex items-start gap-2 text-xs text-navy/85">
                      <span className="size-5 rounded-md bg-emerald text-ivory grid place-items-center font-display text-[10px] shrink-0">
                        {i + 1}
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ol>
              </DashCard>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/partner" className="btn-emerald rounded-full px-4 py-2 text-xs">
              → Partner LIFF
            </Link>
            <Link to="/admin" className="card-cream rounded-full px-4 py-2 text-xs">
              → Admin
            </Link>
            <Link
              to="/"
              className="rounded-full px-4 py-2 text-xs bg-white/70 border border-mint/40"
            >
              ← {lang === "th" ? "กลับหน้าแรก" : "Back home"}
            </Link>
          </div>
        </div>
      </div>
    </DashShell>
  );
}
