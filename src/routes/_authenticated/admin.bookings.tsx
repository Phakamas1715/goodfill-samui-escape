import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listBookings, updateBookingStatus } from "@/lib/admin.functions";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/bookings")({ component: BookingsPage });

const STATUSES = ["pending", "accepted", "rejected", "completed", "redeemed", "cancelled"] as const;

function BookingsPage() {
  const fetchFn = useServerFn(listBookings);
  const updateFn = useServerFn(updateBookingStatus);
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const q = useQuery({ queryKey: ["admin", "bookings"], queryFn: () => fetchFn() });
  const mutate = useMutation({
    mutationFn: (input: { id: string; status: any }) => updateFn({ data: input }),
    onSuccess: () => {
      toast.success("อัปเดตสถานะแล้ว");
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
    onError: (e: any) => toast.error(e.message ?? "ไม่สำเร็จ"),
  });

  const list = (q.data ?? []).filter((b: any) => filter === "all" || b.status === filter);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-navy">Bookings</h1>
          <p className="text-sm text-muted-foreground">{list.length} รายการ</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setFilter("all")} className={`text-xs px-3 py-1.5 rounded-full ${filter === "all" ? "bg-emerald text-ivory" : "bg-cream"}`}>ทั้งหมด</button>
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded-full ${filter === s ? "bg-emerald text-ivory" : "bg-cream"}`}>{s}</button>
          ))}
        </div>
      </header>

      <div className="card-cream rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-emerald text-ivory text-left">
              <tr>
                <th className="px-3 py-2 font-normal">Code</th>
                <th className="px-3 py-2 font-normal">โปรแกรม</th>
                <th className="px-3 py-2 font-normal">วันที่</th>
                <th className="px-3 py-2 font-normal">แผนอาหาร</th>
                <th className="px-3 py-2 font-normal">หมายเหตุ</th>
                <th className="px-3 py-2 font-normal">LINE Push</th>
                <th className="px-3 py-2 font-normal">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mint/20">
              {list.map((b: any) => (
                <tr key={b.id} className="hover:bg-cream/30 align-top">
                  <td className="px-3 py-2 text-emerald font-medium">{b.booking_code}</td>
                  <td className="px-3 py-2 max-w-[180px]">
                    <div className="truncate font-medium text-navy">{b.program_name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{b.program_venue}</div>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{b.booking_date}</td>
                  <td className="px-3 py-2 text-[10px]">
                    <div className="font-medium">{b.dietary_plan ?? "—"}</div>
                    <div className="text-muted-foreground">{b.dietary_notes ?? ""}</div>
                  </td>
                  <td className="px-3 py-2 text-[10px] max-w-[160px] truncate">{b.partner_notes ?? "—"}</td>
                  <td className="px-3 py-2 text-[10px]">
                    <div className={b.customer_push?.ok ? "text-emerald" : "text-red-500"}>C: {b.customer_push?.ok ? "✓" : "✗"}</div>
                    <div className={b.partner_push?.ok ? "text-emerald" : "text-red-500"}>P: {b.partner_push?.ok ? "✓" : "✗"}</div>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={b.status}
                      onChange={(e) => mutate.mutate({ id: b.id, status: e.target.value })}
                      className="text-[11px] bg-pale-mint border-0 rounded-full px-2 py-1"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {list.length === 0 && !q.isLoading && (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">ไม่พบรายการ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}