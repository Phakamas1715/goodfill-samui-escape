import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Section, Eyebrow } from "@/components/Shell";
import { QrCode, Calendar, Utensils, Activity, MessageSquare, BarChart3, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Partner LIFF — Goodfill Care" },
      { name: "description", content: "เมนูสำหรับพาร์ทเนอร์ — คิววันนี้ สแกน QR อาหาร กิจกรรม รีวิว และรายงาน" },
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
  { time: "09:00", name: "คุณนภัทร S.", service: "Sunrise Yoga", status: "กำลังให้บริการ", tone: "bg-pale-mint text-emerald" },
  { time: "10:30", name: "คุณ Anna L.", service: "Signature Massage 90'", status: "ยืนยันแล้ว", tone: "bg-cream text-gold" },
  { time: "13:00", name: "คุณวีระ J.", service: "Detox Juice Day", status: "รอเช็คอิน", tone: "bg-pale-mint text-emerald" },
  { time: "16:00", name: "คุณ Mei C.", service: "Sound Healing", status: "รอลูกค้า", tone: "bg-cream text-gold" },
];

function PartnerPage() {
  return (
    <Shell>
      <Section>
        <div className="grid lg:grid-cols-[420px,1fr] gap-8 items-start">
          {/* LINE LIFF phone */}
          <div className="mx-auto w-full max-w-[400px]">
            <div className="rounded-[2.5rem] bg-emerald-deep p-3 shadow-[0_30px_60px_-20px_rgba(0,63,58,0.45)]">
              <div className="rounded-[2rem] bg-ivory overflow-hidden">
                {/* Header */}
                <div className="bg-emerald text-ivory px-5 py-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] tracking-[0.25em] uppercase opacity-80">LINE Partner</div>
                    <div className="font-display text-lg leading-tight">Bo Phut Beach Villa</div>
                  </div>
                  <div className="size-9 rounded-full bg-mint/30 grid place-items-center text-xs">BP</div>
                </div>
                {/* Rich menu */}
                <div className="grid grid-cols-3 gap-px bg-mint/40">
                  {menu.map((m) => (
                    <button key={m.en} className="bg-ivory aspect-square flex flex-col items-center justify-center gap-1.5 hover:bg-pale-mint transition relative">
                      <m.icon className="text-emerald" size={22} />
                      <div className="text-[11px] font-medium text-navy">{m.th}</div>
                      <div className="text-[9px] text-muted-foreground">{m.en}</div>
                      {m.count && <span className="absolute top-2 right-3 pill bg-gold text-emerald-deep px-1.5 py-0">{m.count}</span>}
                    </button>
                  ))}
                </div>
                {/* Chat area */}
                <div className="p-4 space-y-2 bg-cream/40">
                  <div className="text-[10px] text-muted-foreground text-center">วันนี้</div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 text-xs max-w-[80%] shadow-sm">
                    มีลูกค้าเช็คอิน 3 ราย กรุณาสแกน QR เพื่อเริ่มบริการ
                  </div>
                  <div className="bg-emerald text-ivory rounded-2xl rounded-tr-sm px-3 py-2 text-xs max-w-[80%] ml-auto">
                    รับทราบครับ
                  </div>
                </div>
                <div className="h-1.5 w-32 bg-navy/30 rounded-full mx-auto my-2" />
              </div>
            </div>
          </div>

          {/* Partner board */}
          <div>
            <Eyebrow>Partner Board · LIFF</Eyebrow>
            <h1 className="font-display text-4xl mt-3">คิวบริการวันนี้</h1>
            <p className="text-muted-foreground mt-2 text-sm">Today's service queue · จัดการคิว สแกน QR และรายงานผลตรงจาก LINE</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                { l: "คิววันนี้", v: "8", s: "Today" },
                { l: "เสร็จแล้ว", v: "3", s: "Done" },
                { l: "รอเช็คอิน", v: "2", s: "Waiting" },
                { l: "Calm Credits", v: "240", s: "Issued" },
              ].map((s) => (
                <div key={s.l} className="card-soft p-4">
                  <div className="text-[10px] tracking-widest uppercase text-muted-foreground">{s.s}</div>
                  <div className="font-display text-3xl gold-text mt-1">{s.v}</div>
                  <div className="text-xs text-emerald-deep mt-1">{s.l}</div>
                </div>
              ))}
            </div>

            <div className="card-soft mt-6 overflow-hidden">
              <div className="px-5 py-4 bg-emerald text-ivory flex items-center justify-between">
                <div className="font-medium">Today Queue · คิววันนี้</div>
                <button className="text-xs pill bg-mint/30 text-ivory">+ เพิ่มคิว</button>
              </div>
              <ul className="divide-y divide-mint/40">
                {queue.map((q) => (
                  <li key={q.time} className="px-5 py-4 flex items-center gap-4">
                    <div className="font-display text-lg text-emerald w-14">{q.time}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-navy">{q.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{q.service}</div>
                    </div>
                    <span className={`pill ${q.tone}`}>{q.status}</span>
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex gap-3">
              <Link to="/admin" className="btn-emerald rounded-full px-5 py-3 text-sm">ไปหน้า Admin</Link>
              <Link to="/expert" className="card-cream rounded-full px-5 py-3 text-sm">Expert Board</Link>
            </div>
          </div>
        </div>
      </Section>
    </Shell>
  );
}