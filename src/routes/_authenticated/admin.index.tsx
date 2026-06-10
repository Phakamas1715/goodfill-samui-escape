import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listBookings, listPrograms } from "@/lib/admin.functions";
import {
  Calendar,
  Package,
  TrendingUp,
  AlertCircle,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Goodfill Care" },
      { name: "description", content: "ภาพรวมระบบ Goodfill Care" },
    ],
  }),
});

const STATUS_LABELS: Record<string, { th: string; en: string; color: string }> = {
  pending: { th: "รอดำเนินการ", en: "Pending", color: "bg-amber-100 text-amber-700" },
  accepted: { th: "ยอมรับแล้ว", en: "Accepted", color: "bg-emerald-100 text-emerald-700" },
  rejected: { th: "ปฏิเสธแล้ว", en: "Rejected", color: "bg-red-100 text-red-700" },
  completed: { th: "เสร็จสิ้น", en: "Completed", color: "bg-blue-100 text-blue-700" },
  redeemed: { th: "ใช้แล้ว", en: "Redeemed", color: "bg-purple-100 text-purple-700" },
  cancelled: { th: "ยกเลิกแล้ว", en: "Cancelled", color: "bg-gray-100 text-gray-700" },
};

function AdminDashboard() {
  const fetchBookings = useServerFn(listBookings);
  const fetchPrograms = useServerFn(listPrograms);
  const bookings = useQuery({ queryKey: ["admin", "bookings"], queryFn: () => fetchBookings() });
  const programs = useQuery({ queryKey: ["admin", "programs"], queryFn: () => fetchPrograms() });

  const today = new Date().toISOString().slice(0, 10);
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  const thisWeekStr = thisWeekStart.toISOString().slice(0, 10);

  const list = bookings.data ?? [];

  const todayCount = list.filter((b: any) => b.booking_date?.slice(0, 10) === today).length;
  const thisWeekCount = list.filter((b: any) => b.booking_date?.slice(0, 10) >= thisWeekStr).length;
  const pendingCount = list.filter((b: any) => b.status === "pending").length;
  const acceptedCount = list.filter((b: any) => b.status === "accepted").length;
  const completedCount = list.filter((b: any) => b.status === "completed").length;
  const revenue = list.reduce((s: number, b: any) => s + Number(b.program_price || 0), 0);
  const thisWeekRevenue = list
    .filter((b: any) => b.booking_date?.slice(0, 10) >= thisWeekStr)
    .reduce((s: number, b: any) => s + Number(b.program_price || 0), 0);

  // Status distribution for chart
  const statusDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    list.forEach((b: any) => {
      dist[b.status] = (dist[b.status] || 0) + 1;
    });
    return dist;
  }, [list]);

  // Recent bookings (last 5)
  const recentBookings = [...list]
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const kpis = [
    {
      icon: Calendar,
      label: "การจองทั้งหมด",
      value: list.length,
      sub: `วันนี้ +${todayCount}`,
      trend: todayCount,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: AlertCircle,
      label: "รอดำเนินการ",
      value: pendingCount,
      sub: "pending status",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: Package,
      label: "โปรแกรมทั้งหมด",
      value: programs.data?.length ?? 0,
      sub: "ในระบบ",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: TrendingUp,
      label: "ยอดรวมสัปดาห์นี้",
      value: `฿${thisWeekRevenue.toLocaleString()}`,
      sub: `รวมทั้งสิ้น ${thisWeekCount} การจอง`,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-navy">ภาพรวมระบบ</h1>
          <p className="text-sm text-muted-foreground mt-1">Dashboard แบบ real-time</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/bookings"
            className="text-sm bg-white border border-mint/40 rounded-xl px-4 py-2 text-navy hover:bg-cream transition flex items-center gap-2"
          >
            <Eye size={14} />
            จัดการการจอง
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`${k.bg} rounded-2xl p-4 shadow-sm hover:shadow-md transition`}
          >
            <div className="flex items-center justify-between">
              <k.icon className={`${k.color}`} size={22} />
              {k.trend !== undefined && k.trend > 0 && (
                <span className="text-[10px] font-medium text-emerald bg-white/60 px-1.5 py-0.5 rounded-full">
                  +{k.trend}
                </span>
              )}
            </div>
            <div className="font-display text-2xl md:text-3xl text-navy mt-2 font-bold">
              {k.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
            <div className="text-[10px] text-navy/60 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-navy">{acceptedCount}</div>
          <div className="text-[10px] text-emerald">ยอมรับแล้ว</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-navy">{completedCount}</div>
          <div className="text-[10px] text-blue-600">เสร็จสิ้น</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-navy">{revenue.toLocaleString()}</div>
          <div className="text-[10px] text-gold">ยอดรวม (บาท)</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-navy">{list.length}</div>
          <div className="text-[10px] text-muted-foreground">การจองทั้งหมด</div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="card-cream rounded-2xl p-4 shadow-sm">
        <h2 className="font-semibold text-navy mb-3 flex items-center gap-2">
          <Users size={16} className="text-gold" />
          สถานะการจอง
        </h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusDistribution).map(([status, count]) => (
            <div key={status} className="flex items-center gap-2">
              <span
                className={`pill text-[10px] font-medium ${STATUS_LABELS[status]?.color || "bg-gray-100"}`}
              >
                {STATUS_LABELS[status]?.th || status}
              </span>
              <span className="text-sm font-semibold text-navy">{count}</span>
            </div>
          ))}
          {Object.keys(statusDistribution).length === 0 && (
            <span className="text-xs text-muted-foreground">ไม่มีข้อมูล</span>
          )}
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="card-cream rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-gradient-to-r from-emerald-deep to-emerald text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span className="font-medium text-sm">การจองล่าสุด</span>
          </div>
          <Link
            to="/admin/bookings"
            className="text-[11px] text-white/80 hover:text-white transition"
          >
            ดูทั้งหมด →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-cream/40 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-normal">รหัส</th>
                <th className="px-4 py-2 font-normal">โปรแกรม</th>
                <th className="px-4 py-2 font-normal">ลูกค้า</th>
                <th className="px-4 py-2 font-normal">วันที่จอง</th>
                <th className="px-4 py-2 font-normal text-right">ราคา</th>
                <th className="px-4 py-2 font-normal">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mint/20">
              {recentBookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-cream/30 transition">
                  <td className="px-4 py-2.5 font-mono text-[11px] font-semibold text-emerald">
                    {b.booking_code}
                  </td>
                  <td className="px-4 py-2.5 max-w-[180px] truncate text-navy">{b.program_name}</td>
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-navy">{b.customer_name || "-"}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {b.customer_email || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground text-[11px]">
                    {b.booking_date ? new Date(b.booking_date).toLocaleDateString("th-TH") : "-"}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-navy">
                    ฿{Number(b.program_price).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_LABELS[b.status]?.color || "bg-gray-100"}`}
                    >
                      {STATUS_LABELS[b.status]?.th || b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && !bookings.isLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar size={24} className="text-muted-foreground/50" />
                      <p className="text-sm">ยังไม่มีรายการจอง</p>
                    </div>
                  </td>
                </tr>
              )}
              {bookings.isLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="text-center text-[10px] text-muted-foreground pt-2">
        อัปเดตล่าสุด: {new Date().toLocaleString("th-TH")}
      </div>
    </div>
  );
}
