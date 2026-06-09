import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listBookings, listPrograms } from "@/lib/admin.functions";
import { Calendar, Package, TrendingUp, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const fetchBookings = useServerFn(listBookings);
  const fetchPrograms = useServerFn(listPrograms);
  const bookings = useQuery({ queryKey: ["admin", "bookings"], queryFn: () => fetchBookings() });
  const programs = useQuery({ queryKey: ["admin", "programs"], queryFn: () => fetchPrograms() });

  const today = new Date().toISOString().slice(0, 10);
  const list = bookings.data ?? [];
  const todayCount = list.filter((b: any) => b.booking_date?.slice(0, 10) === today).length;
  const pendingCount = list.filter((b: any) => b.status === "pending").length;
  const revenue = list.reduce((s: number, b: any) => s + Number(b.program_price || 0), 0);

  const kpis = [
    { icon: Calendar, label: "จองทั้งหมด", value: list.length, sub: `วันนี้ ${todayCount}` },
    { icon: AlertCircle, label: "รอดำเนินการ", value: pendingCount, sub: "pending status" },
    { icon: Package, label: "โปรแกรม", value: programs.data?.length ?? 0, sub: "ทั้งหมดในระบบ" },
    { icon: TrendingUp, label: "ยอดรวม", value: `฿${revenue.toLocaleString()}`, sub: "ทุก booking" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-navy">ภาพรวมระบบ</h1>
        <p className="text-sm text-muted-foreground">Dashboard · realtime</p>
      </header>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="card-cream rounded-2xl p-4">
            <k.icon className="text-emerald" size={20} />
            <div className="font-display text-2xl text-navy mt-2">{k.value}</div>
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className="text-[10px] text-emerald mt-1">{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="card-cream rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 bg-emerald text-ivory font-medium text-sm">Recent Bookings</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-cream/40 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-normal">Code</th>
                <th className="px-3 py-2 font-normal">โปรแกรม</th>
                <th className="px-3 py-2 font-normal">วันที่</th>
                <th className="px-3 py-2 font-normal">แผน</th>
                <th className="px-3 py-2 font-normal text-right">ราคา</th>
                <th className="px-3 py-2 font-normal">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mint/20">
              {list.slice(0, 10).map((b: any) => (
                <tr key={b.id} className="hover:bg-cream/30">
                  <td className="px-3 py-2 text-emerald font-medium">{b.booking_code}</td>
                  <td className="px-3 py-2 max-w-[200px] truncate">{b.program_name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{b.booking_date}</td>
                  <td className="px-3 py-2 text-[10px]">{b.dietary_plan ?? "—"}</td>
                  <td className="px-3 py-2 text-right">฿{Number(b.program_price).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <span className="pill bg-pale-mint text-emerald text-[9px]">{b.status}</span>
                  </td>
                </tr>
              ))}
              {list.length === 0 && !bookings.isLoading && (
                <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">ยังไม่มี booking</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}