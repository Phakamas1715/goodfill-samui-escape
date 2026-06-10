import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { DashShell, DashCard } from "@/components/DashShell";
import {
  QrCode,
  Calendar,
  Utensils,
  Activity,
  MessageSquare,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyRoles } from "@/lib/admin.functions";

export const Route = createFileRoute("/partner")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });
    const roles = await getMyRoles();
    if (!roles.includes("partner") && !roles.includes("admin")) {
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [
      { title: "Partner LIFF — Goodfill Care" },
      {
        name: "description",
        content:
          "ศูนย์ปฏิบัติการสำหรับพาร์ทเนอร์ Goodfill Care — คิววันนี้, สแกน QR ของแขก, ยืนยันอาหาร/บริการ, รีวิวลูกค้า และรายงานรายได้ ผ่าน LINE LIFF",
      },
      { property: "og:title", content: "Partner LIFF — เครื่องมือพาร์ทเนอร์ Goodfill Care" },
      {
        property: "og:description",
        content:
          "คิวบริการรายวัน, QR check-in, ยืนยันมื้ออาหาร และรายงาน — เปิดผ่าน LINE OA สำหรับวิลล่าและสปาพาร์ทเนอร์",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PartnerPage,
});

const menu = [
  { icon: Calendar, th: "คิววันนี้", en: "Today Queue", count: "8" },
  { icon: QrCode, th: "สแกน QR", en: "Scan QR", count: "" },
  { icon: Utensils, th: "อาหาร", en: "Portion", count: "3" },
  { icon: Activity, th: "กิจกรรม", en: "Service Plan", count: "5" },
  { icon: MessageSquare, th: "รีวิวลูกค้า", en: "Reviews", count: "12" },
  { icon: BarChart3, th: "รายงาน", en: "Report", count: "" },
] as const;

const queue = [
  {
    time: "09:00",
    name: "คุณนภัทร S.",
    service: "Sunrise Yoga",
    status: "กำลังให้บริการ",
    tone: "bg-pale-mint text-emerald",
  },
  {
    time: "10:30",
    name: "คุณ Anna L.",
    service: "Signature Massage 90'",
    status: "ยืนยันแล้ว",
    tone: "bg-cream text-gold",
  },
  {
    time: "13:00",
    name: "คุณวีระ J.",
    service: "Detox Juice Day",
    status: "รอเช็คอิน",
    tone: "bg-pale-mint text-emerald",
  },
  {
    time: "16:00",
    name: "คุณ Mei C.",
    service: "Sound Healing",
    status: "รอลูกค้า",
    tone: "bg-cream text-gold",
  },
];

function PartnerPage() {
  return (
    <DashShell
      bg="villa"
      host="welcome"
      kicker="Partner LIFF"
      title="คิวบริการวันนี้"
      subtitle="Bo Phut Beach Villa · LINE Partner"
    >
      <div className="grid lg:grid-cols-[1fr,300px] gap-3 items-start">
        {/* Partner board */}
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2">
            {[
              { l: "คิววันนี้", v: "8", s: "Today" },
              { l: "เสร็จแล้ว", v: "3", s: "Done" },
              { l: "รอเช็คอิน", v: "2", s: "Waiting" },
              { l: "Credits", v: "240", s: "Issued" },
            ].map((s) => (
              <DashCard key={s.l} className="!p-3">
                <div className="text-[9px] tracking-widest uppercase text-muted-foreground">
                  {s.s}
                </div>
                <div className="font-display text-xl md:text-2xl gold-text mt-0.5">{s.v}</div>
                <div className="text-[10px] text-emerald-deep">{s.l}</div>
              </DashCard>
            ))}
          </div>

          <DashCard className="!p-0 overflow-hidden">
            <div className="px-4 py-3 bg-emerald text-ivory flex items-center justify-between">
              <div className="font-medium text-sm">Today Queue</div>
              <button className="text-[10px] pill bg-mint/30 text-ivory">+ เพิ่มคิว</button>
            </div>
            <ul className="divide-y divide-mint/40">
              {queue.map((q) => (
                <li key={q.time} className="px-4 py-2.5 flex items-center gap-3">
                  <div className="font-display text-base text-emerald w-12 shrink-0">{q.time}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-navy text-sm truncate">{q.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{q.service}</div>
                  </div>
                  <span className={`pill ${q.tone} hidden sm:inline-flex`}>{q.status}</span>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </li>
              ))}
            </ul>
          </DashCard>

          <div className="flex gap-2">
            <Link to="/admin" className="btn-emerald rounded-full px-4 py-2 text-xs">
              → Admin
            </Link>
            <Link to="/expert" className="card-cream rounded-full px-4 py-2 text-xs">
              → Expert
            </Link>
          </div>
        </div>

        {/* Quick action grid — button-first */}
        <DashCard className="!p-3">
          <div className="text-[10px] tracking-widest uppercase text-gold mb-2">Quick Actions</div>
          <div className="grid grid-cols-3 gap-1.5">
            {menu.map((m) => (
              <button
                key={m.en}
                className="bg-pale-mint/40 hover:bg-pale-mint aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition relative"
              >
                <m.icon className="text-emerald" size={18} />
                <div className="text-[9px] font-medium text-navy">{m.th}</div>
                {m.count && (
                  <span className="absolute top-1 right-1 pill bg-gold text-emerald-deep px-1 py-0 text-[9px]">
                    {m.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </DashCard>
      </div>
    </DashShell>
  );
}
