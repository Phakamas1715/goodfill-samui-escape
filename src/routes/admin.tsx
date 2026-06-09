import { createFileRoute } from "@tanstack/react-router";
import { DashShell, DashCard } from "@/components/DashShell";
import { TrendingUp, Users, QrCode, AlertTriangle, Sparkles, Calendar, Smile, Coins } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Goodfill Care" },
      { name: "description", content: "ภาพรวมระบบ — booking, revenue, expert review, QR redeemed, satisfaction" },
    ],
  }),
  component: AdminPage,
});

const kpis = [
  { icon: Calendar, label: "Booking วันนี้", value: "12", sub: "+3 จากเมื่อวาน", tone: "text-emerald" },
  { icon: TrendingUp, label: "รายได้วันนี้", value: "฿ 482,000", sub: "+18.4%", tone: "text-emerald" },
  { icon: Users, label: "Active Customers", value: "87", sub: "ใน 30 วัน", tone: "text-emerald" },
  { icon: Sparkles, label: "รอ Expert Review", value: "4", sub: "เคส pending", tone: "text-gold" },
  { icon: QrCode, label: "QR Redeemed", value: "56", sub: "วันนี้", tone: "text-emerald" },
  { icon: Smile, label: "Customer Satisfaction", value: "4.8", sub: "/ 5.0 · 1,204 reviews", tone: "text-emerald" },
  { icon: AlertTriangle, label: "Partner Issues", value: "2", sub: "ต้องแก้ไข", tone: "text-red-600" },
  { icon: Coins, label: "Calm Credits ออก", value: "12,480", sub: "เดือนนี้", tone: "text-gold" },
];

const bookings = [
  { code: "BK-2091", name: "Anna L.", program: "Full Transformation", date: "12 มิ.ย.", total: "฿128,000", status: "ยืนยันแล้ว", tone: "bg-pale-mint text-emerald" },
  { code: "BK-2090", name: "นภัทร ส.", program: "Mindful Balance", date: "10 มิ.ย.", total: "฿72,000", status: "รอ Expert", tone: "bg-cream text-gold" },
  { code: "BK-2089", name: "Mei C.", program: "Samui Reset", date: "9 มิ.ย.", total: "฿38,000", status: "เช็คอินแล้ว", tone: "bg-pale-mint text-emerald" },
  { code: "BK-2088", name: "วีระ จ.", program: "Mindful Balance", date: "8 มิ.ย.", total: "฿72,000", status: "เสร็จสิ้น", tone: "bg-cream text-emerald" },
];

function AdminPage() {
  return (
    <DashShell bg="beach" host="welcome" kicker="Admin Dashboard" title="ภาพรวมระบบ" subtitle="9 มิ.ย. 2026 · อัปเดต 2 นาทีก่อน">
      <div className="flex gap-1.5 mb-3">
        <button className="card-cream rounded-full px-3 py-1.5 text-[11px]">วันนี้</button>
        <button className="rounded-full px-3 py-1.5 text-[11px] bg-pale-mint text-emerald">7 วัน</button>
        <button className="rounded-full px-3 py-1.5 text-[11px] bg-cream/60 text-muted-foreground">30 วัน</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          {kpis.map((k) => (
            <DashCard key={k.label} className="!p-3">
              <div className="flex items-center justify-between">
                <k.icon className={k.tone} size={18} />
                <span className="text-[9px] tracking-widest uppercase text-muted-foreground truncate ml-1">{k.sub}</span>
              </div>
              <div className="font-display text-xl md:text-2xl mt-1 text-navy">{k.value}</div>
              <div className="text-[10px] text-muted-foreground">{k.label}</div>
            </DashCard>
          ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-3 mt-3">
          <DashCard className="lg:col-span-2 !p-0 overflow-hidden">
            <div className="px-4 py-2.5 bg-emerald text-ivory flex items-center justify-between">
              <div className="font-medium text-sm">Recent Bookings</div>
              <button className="text-[10px] pill bg-mint/30 text-ivory">Export</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-left text-[10px] tracking-widest uppercase text-muted-foreground bg-cream/30">
                  <tr>
                    <th className="px-3 py-2 font-normal">Code</th>
                    <th className="px-3 py-2 font-normal">ลูกค้า</th>
                    <th className="px-3 py-2 font-normal">โปรแกรม</th>
                    <th className="px-3 py-2 font-normal text-right">ยอด</th>
                    <th className="px-3 py-2 font-normal">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mint/30">
                  {bookings.map((b) => (
                    <tr key={b.code} className="hover:bg-cream/40">
                      <td className="px-3 py-2 text-emerald font-medium">{b.code}</td>
                      <td className="px-3 py-2">{b.name}</td>
                      <td className="px-3 py-2 text-muted-foreground truncate max-w-[120px]">{b.program}</td>
                      <td className="px-3 py-2 text-right font-medium">{b.total}</td>
                      <td className="px-3 py-2"><span className={`pill ${b.tone} text-[9px]`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashCard>

          <DashCard className="!p-3">
            <div className="text-[10px] tracking-widest uppercase text-emerald mb-2">Wellness Personas</div>
            <ul className="space-y-1.5 text-xs">
              {[
                { name: "Sleep Seeker", pct: 28 },
                { name: "Stress Calmer", pct: 22 },
                { name: "Detox Reset", pct: 18 },
                { name: "Energy Rebuilder", pct: 14 },
                { name: "Mindful Glow", pct: 10 },
                { name: "Body Reshape", pct: 8 },
              ].map((p) => (
                <li key={p.name}>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-navy">{p.name}</span>
                    <span className="text-emerald">{p.pct}%</span>
                  </div>
                  <div className="h-1.5 mt-0.5 rounded-full bg-pale-mint/40 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald to-mint" style={{ width: `${p.pct * 3}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </DashCard>
      </div>
    </DashShell>
  );
}