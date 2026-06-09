import { createFileRoute } from "@tanstack/react-router";
import { DashShell, DashCard } from "@/components/DashShell";
import { CheckCircle2, AlertCircle, Clock, FileQuestion, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/expert")({
  head: () => ({
    meta: [
      { title: "Expert Review Board — Goodfill Care" },
      { name: "description", content: "บอร์ดรีวิวสำหรับผู้เชี่ยวชาญ — ตรวจสอบ meal plan, activity plan และอนุมัติเคส" },
    ],
  }),
  component: ExpertPage,
});

const cases = [
  { id: "GF-2025-0091", name: "คุณนภัทร ส.", persona: "Sleep Seeker", program: "Mindful Balance · 5D4N", status: "pending", time: "วันนี้ 09:12" },
  { id: "GF-2025-0090", name: "คุณ Anna L.", persona: "Detox Reset", program: "Full Transformation · 7D6N", status: "review", time: "เมื่อ 24 นาที" },
  { id: "GF-2025-0089", name: "คุณวีระ จ.", persona: "Energy Rebuilder", program: "The Samui Reset · 3D2N", status: "approved", time: "เมื่อ 2 ชม." },
  { id: "GF-2025-0088", name: "คุณ Mei C.", persona: "Mindful Glow", program: "Mindful Balance · 5D4N", status: "adjust", time: "เมื่อ 4 ชม." },
];

const statusMap: Record<string, { label: string; tone: string; icon: typeof Clock }> = {
  pending: { label: "รอตรวจสอบ", tone: "bg-cream text-gold", icon: Clock },
  review: { label: "กำลังรีวิว", tone: "bg-pale-mint text-emerald", icon: FileQuestion },
  approved: { label: "อนุมัติแล้ว", tone: "bg-pale-mint text-emerald", icon: CheckCircle2 },
  adjust: { label: "ขอปรับ", tone: "bg-cream text-gold", icon: AlertCircle },
};

function ExpertPage() {
  const [active, setActive] = useState(cases[0]);
  return (
    <DashShell bg="food" host="wai" kicker="Expert Review Board" title="บอร์ดรีวิวผู้เชี่ยวชาญ" subtitle="ตรวจ meal plan · activity plan · อนุมัติเคส">
      <div className="grid lg:grid-cols-[300px,1fr] gap-3">
          {/* Queue */}
          <DashCard className="!p-2">
            <div className="px-2 py-1 text-[10px] tracking-widest uppercase text-muted-foreground">Queue · 4</div>
            <ul className="space-y-1">
              {cases.map((c) => {
                const s = statusMap[c.status];
                const isActive = c.id === active.id;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setActive(c)}
                      className={`w-full text-left rounded-xl p-2.5 transition ${isActive ? "bg-pale-mint ring-1 ring-emerald/30" : "hover:bg-cream/60"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] text-muted-foreground">{c.id}</div>
                        <span className={`pill ${s.tone} text-[9px]`}><s.icon size={9} />{s.label}</span>
                      </div>
                      <div className="font-medium text-navy mt-0.5 text-sm">{c.name}</div>
                      <div className="text-[10px] text-emerald">{c.persona}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{c.program}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </DashCard>

          {/* Detail */}
          <DashCard>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="text-[10px] text-muted-foreground">{active.id}</div>
                <h2 className="font-display text-lg text-navy">{active.name}</h2>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="pill bg-pale-mint text-emerald text-[10px]">{active.persona}</span>
                  <span className="pill bg-cream text-gold text-[10px]">{active.program}</span>
                </div>
              </div>
              <span className={`pill ${statusMap[active.status].tone} text-[10px]`}>{statusMap[active.status].label}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-2 mt-3">
              <Panel title="Meal Plan · แผนอาหาร">
                <Row label="เช้า" val="Detox green juice + chia bowl" />
                <Row label="กลางวัน" val="Steamed fish, quinoa, salad" />
                <Row label="เย็น" val="Mushroom broth, brown rice" />
                <Row label="kcal/day" val="~1,650" />
              </Panel>
              <Panel title="Activity Plan · กิจกรรม">
                <Row label="เช้า" val="Sunrise yoga 60'" />
                <Row label="สาย" val="Lymphatic massage 60'" />
                <Row label="บ่าย" val="Forest bathing walk" />
                <Row label="เย็น" val="Sound healing 45'" />
              </Panel>
            </div>

            <div className="card-cream mt-2 p-3 rounded-xl">
              <div className="text-[10px] tracking-widest uppercase text-emerald mb-1">Expert Notes</div>
              <p className="text-xs text-navy/80">แนะนำเพิ่ม Breathwork วันที่ 2 ช่วยเรื่องการนอน · ลดคาเฟอีนเหลือเช้าวันเดียว</p>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              <button className="btn-emerald rounded-full px-3 py-2 text-xs inline-flex items-center gap-1"><CheckCircle2 size={12} /> อนุมัติ</button>
              <button className="card-cream rounded-full px-3 py-2 text-xs inline-flex items-center gap-1 text-gold"><AlertCircle size={12} /> ขอปรับ</button>
              <button className="rounded-full px-3 py-2 text-xs inline-flex items-center gap-1 bg-pale-mint text-emerald"><FileQuestion size={12} /> ขอข้อมูล</button>
              <button className="rounded-full px-3 py-2 text-xs inline-flex items-center gap-1 bg-red-50 text-red-700"><X size={12} /> ไม่แนะนำ</button>
            </div>
          </DashCard>
      </div>
    </DashShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-pale-mint/30 rounded-xl p-3 border border-mint/40">
      <div className="text-[10px] tracking-widest uppercase text-emerald mb-1.5">{title}</div>
      <ul className="space-y-1 text-xs">{children}</ul>
    </div>
  );
}

function Row({ label, val }: { label: string; val: string }) {
  return (
    <li className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-navy text-right text-[11px]">{val}</span>
    </li>
  );
}