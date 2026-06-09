import { createFileRoute } from "@tanstack/react-router";
import { Shell, Section, Eyebrow } from "@/components/Shell";
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
    <Shell>
      <Section>
        <Eyebrow>Expert Review Board</Eyebrow>
        <h1 className="font-display text-4xl mt-3">บอร์ดรีวิวผู้เชี่ยวชาญ</h1>
        <p className="text-muted-foreground text-sm mt-2">ตรวจ meal plan · activity plan · อนุมัติเคสและส่งกลับลูกค้า</p>

        <div className="grid lg:grid-cols-[340px,1fr] gap-6 mt-8">
          {/* Queue */}
          <div className="card-soft p-3">
            <div className="px-3 py-2 text-xs tracking-widest uppercase text-muted-foreground">Review Queue · 4 cases</div>
            <ul className="space-y-1">
              {cases.map((c) => {
                const s = statusMap[c.status];
                const isActive = c.id === active.id;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setActive(c)}
                      className={`w-full text-left rounded-2xl p-3 transition ${isActive ? "bg-pale-mint" : "hover:bg-cream/60"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">{c.id}</div>
                        <span className={`pill ${s.tone}`}><s.icon size={11} />{s.label}</span>
                      </div>
                      <div className="font-medium text-navy mt-1">{c.name}</div>
                      <div className="text-xs text-emerald mt-0.5">{c.persona}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">{c.program} · {c.time}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Detail */}
          <div className="card-soft p-6">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="text-xs text-muted-foreground">{active.id}</div>
                <h2 className="font-display text-2xl text-navy mt-1">{active.name}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="pill bg-pale-mint text-emerald">{active.persona}</span>
                  <span className="pill bg-cream text-gold">{active.program}</span>
                </div>
              </div>
              <span className={`pill ${statusMap[active.status].tone}`}>{statusMap[active.status].label}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Panel title="Meal Plan Review · แผนอาหาร">
                <Row label="เช้า" val="Detox green juice + chia bowl" />
                <Row label="กลางวัน" val="Steamed fish, quinoa, salad" />
                <Row label="เย็น" val="Mushroom broth, brown rice" />
                <Row label="แคลอรี่/วัน" val="~1,650 kcal" />
              </Panel>
              <Panel title="Activity Plan Review · แผนกิจกรรม">
                <Row label="เช้า" val="Sunrise yoga 60'" />
                <Row label="สาย" val="Lymphatic massage 60'" />
                <Row label="บ่าย" val="Forest bathing walk" />
                <Row label="เย็น" val="Sound healing 45'" />
              </Panel>
            </div>

            <div className="card-cream mt-4 p-4">
              <div className="text-xs tracking-widest uppercase text-emerald mb-2">Expert Notes</div>
              <p className="text-sm text-navy/80">แนะนำเพิ่ม Breathwork ช่วงเย็นวันที่ 2 เพื่อช่วยเรื่องการนอน — และปรับปริมาณคาเฟอีนเหลือเช้าวันเดียว</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <button className="btn-emerald rounded-full px-5 py-2.5 text-sm inline-flex items-center gap-2"><CheckCircle2 size={16} /> อนุมัติ · Approve</button>
              <button className="card-cream rounded-full px-5 py-2.5 text-sm inline-flex items-center gap-2 text-gold"><AlertCircle size={16} /> ขอปรับ · Adjust</button>
              <button className="rounded-full px-5 py-2.5 text-sm inline-flex items-center gap-2 bg-pale-mint text-emerald"><FileQuestion size={16} /> ขอข้อมูลเพิ่ม</button>
              <button className="rounded-full px-5 py-2.5 text-sm inline-flex items-center gap-2 bg-red-50 text-red-700"><X size={16} /> ไม่แนะนำ</button>
            </div>

            <div className="mt-6">
              <div className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Decision History</div>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-3"><span className="text-emerald">✓</span><span>2025-06-08 09:30 — Dr. Pim อนุมัติแผนเบื้องต้น</span></li>
                <li className="flex gap-3"><span className="text-gold">!</span><span>2025-06-07 15:12 — Coach Tle ขอข้อมูล HRV</span></li>
                <li className="flex gap-3 text-muted-foreground"><span>•</span><span>2025-06-06 11:00 — สร้างเคสจากแบบประเมิน</span></li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </Shell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-cream p-4">
      <div className="text-xs tracking-widest uppercase text-emerald mb-3">{title}</div>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function Row({ label, val }: { label: string; val: string }) {
  return (
    <li className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-navy text-right">{val}</span>
    </li>
  );
}