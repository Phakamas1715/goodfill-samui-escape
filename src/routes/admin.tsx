import { createFileRoute } from "@tanstack/react-router";
import { Shell, Section, Eyebrow } from "@/components/Shell";
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
    <Shell>
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Admin Dashboard</Eyebrow>
            <h1 className="font-display text-4xl mt-3">ภาพรวมระบบ</h1>
            <p className="text-muted-foreground text-sm mt-2">วันที่ 9 มิถุนายน 2026 · ทุกตัวเลขอัปเดตล่าสุดเมื่อ 2 นาทีที่แล้ว</p>
          </div>
          <div className="flex gap-2">
            <button className="card-cream rounded-full px-4 py-2 text-sm">วันนี้</button>
            <button className="rounded-full px-4 py-2 text-sm bg-pale-mint text-emerald">7 วัน</button>
            <button className="rounded-full px-4 py-2 text-sm bg-cream/60 text-muted-foreground">30 วัน</button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {kpis.map((k) => (
            <div key={k.label} className="card-soft p-5">
              <div className="flex items-center justify-between">
                <k.icon className={k.tone} size={22} />
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground">{k.sub}</span>
              </div>
              <div className="font-display text-3xl mt-3 text-navy">{k.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 card-soft overflow-hidden">
            <div className="px-5 py-4 bg-emerald text-ivory flex items-center justify-between">
              <div className="font-medium">Booking ล่าสุด · Recent Bookings</div>
              <button className="text-xs pill bg-mint/30 text-ivory">Export</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs tracking-widest uppercase text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-normal">Code</th>
                    <th className="px-5 py-3 font-normal">ลูกค้า</th>
                    <th className="px-5 py-3 font-normal">โปรแกรม</th>
                    <th className="px-5 py-3 font-normal">วันที่</th>
                    <th className="px-5 py-3 font-normal text-right">ยอดรวม</th>
                    <th className="px-5 py-3 font-normal">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mint/30">
                  {bookings.map((b) => (
                    <tr key={b.code} className="hover:bg-cream/40">
                      <td className="px-5 py-3 text-emerald font-medium">{b.code}</td>
                      <td className="px-5 py-3">{b.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{b.program}</td>
                      <td className="px-5 py-3 text-muted-foreground">{b.date}</td>
                      <td className="px-5 py-3 text-right font-medium">{b.total}</td>
                      <td className="px-5 py-3"><span className={`pill ${b.tone}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-cream p-6">
            <div className="text-xs tracking-widest uppercase text-emerald mb-3">Wellness Personas</div>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Sleep Seeker", pct: 28 },
                { name: "Stress Calmer", pct: 22 },
                { name: "Detox Reset", pct: 18 },
                { name: "Energy Rebuilder", pct: 14 },
                { name: "Mindful Glow", pct: 10 },
                { name: "Body Reshape", pct: 8 },
              ].map((p) => (
                <li key={p.name}>
                  <div className="flex justify-between text-xs">
                    <span className="text-navy">{p.name}</span>
                    <span className="text-emerald">{p.pct}%</span>
                  </div>
                  <div className="h-2 mt-1 rounded-full bg-white overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald to-mint" style={{ width: `${p.pct * 3}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </Shell>
  );
}