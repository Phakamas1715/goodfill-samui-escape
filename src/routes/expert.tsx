import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashShell, DashCard } from "@/components/DashShell";
import { CheckCircle2, AlertCircle, Clock, FileQuestion, X, Sparkles, User, Calendar, ClipboardList } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/expert")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
  },
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
  pending: { label: "รอตรวจสอบ", tone: "bg-amber-100 text-amber-700", icon: Clock },
  review: { label: "กำลังรีวิว", tone: "bg-sky-100 text-sky-700", icon: FileQuestion },
  approved: { label: "อนุมัติแล้ว", tone: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  adjust: { label: "ขอปรับ", tone: "bg-orange-100 text-orange-700", icon: AlertCircle },
};

function ExpertPage() {
  const [active, setActive] = useState(cases[0]);
  
  return (
    <DashShell 
      bg="food" 
      kicker="Expert Review Board" 
      title="บอร์ดรีวิวผู้เชี่ยวชาญ" 
      subtitle="ตรวจ meal plan · activity plan · อนุมัติเคส"
    >
      <div className="grid lg:grid-cols-[340px,1fr] gap-4 md:gap-5">
        {/* Queue Section — larger */}
        <DashCard className="p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-deep/10 to-transparent px-4 py-3 border-b border-mint/30">
            <div className="flex items-center justify-between">
              <div className="text-[11px] md:text-xs tracking-widest uppercase text-emerald font-semibold flex items-center gap-2">
                <ClipboardList size={14} /> คิวรอตรวจสอบ
              </div>
              <div className="bg-gold/20 text-gold text-xs font-bold px-2 py-0.5 rounded-full">
                {cases.length} เคส
              </div>
            </div>
          </div>
          
          <ul className="divide-y divide-mint/20 max-h-[60vh] overflow-y-auto">
            {cases.map((c) => {
              const s = statusMap[c.status];
              const isActive = c.id === active.id;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setActive(c)}
                    className={`w-full text-left p-4 transition-all duration-200 ${
                      isActive 
                        ? "bg-pale-mint/60 ring-2 ring-emerald/40 shadow-md" 
                        : "hover:bg-cream/40 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] md:text-xs font-mono text-muted-foreground bg-white/50 px-2 py-0.5 rounded">
                        {c.id}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${s.tone}`}>
                        <s.icon size={10} />
                        {s.label}
                      </span>
                    </div>
                    
                    <div className="font-semibold text-navy text-base md:text-lg mb-1">
                      {c.name}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] md:text-xs text-emerald font-medium bg-emerald/10 px-2 py-0.5 rounded-full">
                        {c.persona}
                      </span>
                    </div>
                    
                    <div className="text-[11px] md:text-xs text-muted-foreground truncate">
                      {c.program}
                    </div>
                    
                    <div className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock size={10} /> {c.time}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </DashCard>

        {/* Detail Section — larger */}
        <DashCard className="p-5 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-mint/30">
            <div className="flex-1">
              <div className="text-[11px] md:text-xs font-mono text-muted-foreground mb-1">
                {active.id}
              </div>
              <h2 className="font-display text-2xl md:text-3xl text-navy leading-tight">
                {active.name}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald/10 text-emerald text-[11px] md:text-xs font-medium">
                  <User size={12} /> {active.persona}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/10 text-gold text-[11px] md:text-xs font-medium">
                  <Calendar size={12} /> {active.program}
                </span>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold ${statusMap[active.status].tone}`}>
              {statusMap[active.status].icon && <statusMap[active.status].icon size={14} />}
              {statusMap[active.status].label}
            </span>
          </div>

          {/* Plans Grid — larger */}
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            <Panel title="🍽️ Meal Plan · แผนอาหาร">
              <Row label="🌅 เช้า (Breakfast)" val="Detox green juice + chia bowl" />
              <Row label="☀️ กลางวัน (Lunch)" val="Steamed fish, quinoa, salad" />
              <Row label="🌙 เย็น (Dinner)" val="Mushroom broth, brown rice" />
              <Row label="🔥 kcal/day" val="~1,650" highlight />
            </Panel>
            
            <Panel title="🧘 Activity Plan · กิจกรรม">
              <Row label="🌅 เช้า" val="Sunrise yoga 60'" />
              <Row label="💆 สาย" val="Lymphatic massage 60'" />
              <Row label="🌳 บ่าย" val="Forest bathing walk" />
              <Row label="🎵 เย็น" val="Sound healing 45'" />
            </Panel>
          </div>

          {/* Expert Notes — larger */}
          <div className="mt-5 bg-gradient-to-r from-gold/5 to-transparent rounded-xl p-4 border-l-4 border-gold">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-gold" />
              <div className="text-[11px] md:text-xs tracking-widest uppercase text-gold font-semibold">
                Expert Notes
              </div>
            </div>
            <p className="text-sm md:text-base text-navy/85 leading-relaxed">
              แนะนำเพิ่ม Breathwork วันที่ 2 ช่วยเรื่องการนอน · ลดคาเฟอีนเหลือเช้าวันเดียว
            </p>
          </div>

          {/* Action Buttons — larger */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-mint/30">
            <button className="btn-emerald rounded-full px-5 py-2.5 text-sm md:text-base inline-flex items-center gap-2 font-semibold shadow-md hover:shadow-lg transition-all">
              <CheckCircle2 size={16} /> อนุมัติ
            </button>
            <button className="card-cream rounded-full px-5 py-2.5 text-sm md:text-base inline-flex items-center gap-2 text-gold font-semibold hover:shadow-md transition-all">
              <AlertCircle size={16} /> ขอปรับ
            </button>
            <button className="rounded-full px-5 py-2.5 text-sm md:text-base inline-flex items-center gap-2 bg-sky-50 text-sky-700 font-semibold hover:bg-sky-100 transition-all">
              <FileQuestion size={16} /> ขอข้อมูล
            </button>
            <button className="rounded-full px-5 py-2.5 text-sm md:text-base inline-flex items-center gap-2 bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition-all">
              <X size={16} /> ไม่แนะนำ
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-5 grid grid-cols-3 gap-3 pt-4 border-t border-mint/30">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">รวมวัน</div>
              <div className="font-display text-xl text-gold">5</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">มื้ออาหาร</div>
              <div className="font-display text-xl text-gold">15</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">กิจกรรม</div>
              <div className="font-display text-xl text-gold">12</div>
            </div>
          </div>
        </DashCard>
      </div>
    </DashShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/80 rounded-xl p-4 md:p-5 border border-mint/40 shadow-sm hover:shadow-md transition-all">
      <div className="text-[11px] md:text-xs tracking-widest uppercase text-emerald font-semibold mb-3">
        {title}
      </div>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function Row({ label, val, highlight }: { label: string; val: string; highlight?: boolean }) {
  return (
    <li className="flex justify-between gap-3 py-1.5 border-b border-mint/20 last:border-0">
      <span className="text-xs md:text-sm text-muted-foreground font-medium">{label}</span>
      <span className={`text-xs md:text-sm text-right ${highlight ? "text-gold font-semibold" : "text-navy/80"}`}>
        {val}
      </span>
    </li>
  );
}