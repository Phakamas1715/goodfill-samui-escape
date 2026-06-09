import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listBookings, updateBookingStatus } from "@/lib/admin.functions";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  component: BookingsPage,
  head: () => ({
    meta: [
      { title: "Admin — Bookings | Goodfill Care" },
      { name: "description", content: "จัดการการจองทั้งหมดของ Goodfill Care" },
    ],
  }),
});

const STATUSES = ["pending", "accepted", "rejected", "completed", "redeemed", "cancelled"] as const;

const STATUS_LABELS: Record<string, { th: string; en: string; color: string }> = {
  pending: { th: "รอดำเนินการ", en: "Pending", color: "bg-amber-100 text-amber-700" },
  accepted: { th: "ยอมรับแล้ว", en: "Accepted", color: "bg-emerald-100 text-emerald-700" },
  rejected: { th: "ปฏิเสธแล้ว", en: "Rejected", color: "bg-red-100 text-red-700" },
  completed: { th: "เสร็จสิ้น", en: "Completed", color: "bg-blue-100 text-blue-700" },
  redeemed: { th: "ใช้แล้ว", en: "Redeemed", color: "bg-purple-100 text-purple-700" },
  cancelled: { th: "ยกเลิกแล้ว", en: "Cancelled", color: "bg-gray-100 text-gray-700" },
};

function BookingsPage() {
  const fetchFn = useServerFn(listBookings);
  const updateFn = useServerFn(updateBookingStatus);
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"created_at" | "booking_code">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: () => fetchFn(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const mutate = useMutation({
    mutationFn: (input: { id: string; status: any }) => updateFn({ data: input }),
    onSuccess: (_, variables) => {
      const statusLabel = STATUS_LABELS[variables.status]?.th || variables.status;
      toast.success(`อัปเดตสถานะเป็น "${statusLabel}" แล้ว`);
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
    onError: (e: any) => toast.error(e.message ?? "อัปเดตสถานะไม่สำเร็จ"),
  });

  // Filter and search
  const filteredList = useMemo(() => {
    let list = q.data ?? [];

    // Apply status filter
    if (filter !== "all") {
      list = list.filter((b: any) => b.status === filter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(
        (b: any) =>
          b.booking_code?.toLowerCase().includes(query) ||
          b.program_name?.toLowerCase().includes(query) ||
          b.customer_name?.toLowerCase().includes(query) ||
          b.customer_email?.toLowerCase().includes(query) ||
          b.booking_code?.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    list = [...list].sort((a: any, b: any) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "created_at") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return list;
  }, [q.data, filter, searchQuery, sortField, sortOrder]);

  const stats = {
    total: q.data?.length || 0,
    pending: q.data?.filter((b: any) => b.status === "pending").length || 0,
    accepted: q.data?.filter((b: any) => b.status === "accepted").length || 0,
    completed: q.data?.filter((b: any) => b.status === "completed").length || 0,
  };

  const toggleSort = (field: "created_at" | "booking_code") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-navy">จัดการการจอง</h1>
          <p className="text-sm text-muted-foreground mt-1">ดูและอัปเดตสถานะการจองทั้งหมด</p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-2">
          <div className="bg-white rounded-xl px-3 py-2 shadow-sm text-center min-w-[70px]">
            <div className="text-2xl font-bold text-navy">{stats.total}</div>
            <div className="text-[10px] text-muted-foreground">ทั้งหมด</div>
          </div>
          <div className="bg-amber-50 rounded-xl px-3 py-2 shadow-sm text-center min-w-[70px]">
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <div className="text-[10px] text-amber-600">รอดำเนินการ</div>
          </div>
          <div className="bg-emerald-50 rounded-xl px-3 py-2 shadow-sm text-center min-w-[70px]">
            <div className="text-2xl font-bold text-emerald-600">{stats.accepted}</div>
            <div className="text-[10px] text-emerald-600">ยอมรับแล้ว</div>
          </div>
          <div className="bg-blue-50 rounded-xl px-3 py-2 shadow-sm text-center min-w-[70px]">
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <div className="text-[10px] text-blue-600">เสร็จสิ้น</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ค้นหาด้วย รหัส, โปรแกรม, ชื่อลูกค้า, อีเมล..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-mint/40 bg-white focus:outline-none focus:ring-2 focus:ring-emerald/40 text-sm"
          />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`text-xs px-3 py-2 rounded-full transition ${
              filter === "all"
                ? "bg-emerald text-white shadow-md"
                : "bg-white border border-mint/40 text-navy hover:bg-cream"
            }`}
          >
            ทั้งหมด
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-2 rounded-full transition ${
                filter === s
                  ? `${STATUS_LABELS[s].color} shadow-md`
                  : "bg-white border border-mint/40 text-navy hover:bg-cream"
              }`}
            >
              {STATUS_LABELS[s].th}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card-cream rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-emerald-deep to-emerald text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">
                  <button
                    onClick={() => toggleSort("booking_code")}
                    className="flex items-center gap-1 hover:opacity-80"
                  >
                    รหัส
                    {sortField === "booking_code" &&
                      (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold">ลูกค้า</th>
                <th className="px-4 py-3 text-left font-semibold">โปรแกรม</th>
                <th className="px-4 py-3 text-left font-semibold">
                  <button onClick={() => toggleSort("created_at")} className="flex items-center gap-1 hover:opacity-80">
                    วันที่จอง
                    {sortField === "created_at" &&
                      (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold">แผนอาหาร</th>
                <th className="px-4 py-3 text-left font-semibold">Push</th>
                <th className="px-4 py-3 text-left font-semibold">สถานะ</th>
                <th className="px-4 py-3 text-left font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mint/20">
              {filteredList.map((b: any) => (
                <>
                  <tr key={b.id} className="hover:bg-cream/30 transition">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-emerald">{b.booking_code}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-navy">{b.customer_name || "-"}</div>
                      <div className="text-[11px] text-muted-foreground">{b.customer_email || "-"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-navy">{b.program_name}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPin size={10} /> {b.program_venue}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {b.booking_date ? new Date(b.booking_date).toLocaleDateString("th-TH") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium">{b.dietary_plan ?? "—"}</div>
                      {b.dietary_notes && (
                        <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                          {b.dietary_notes}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span title={b.customer_push?.ok ? "ส่งถึงลูกค้าแล้ว" : "ส่งไม่สำเร็จ"}>
                          {b.customer_push?.ok ? (
                            <CheckCircle size={14} className="text-emerald" />
                          ) : (
                            <XCircle size={14} className="text-red-400" />
                          )}
                        </span>
                        <span title={b.partner_push?.ok ? "ส่งถึงพาร์ทเนอร์แล้ว" : "ส่งไม่สำเร็จ"}>
                          {b.partner_push?.ok ? (
                            <CheckCircle size={14} className="text-emerald" />
                          ) : (
                            <XCircle size={14} className="text-red-400" />
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={b.status}
                        onChange={(e) => mutate.mutate({ id: b.id, status: e.target.value })}
                        className={`text-xs rounded-full px-3 py-1.5 border-0 font-medium cursor-pointer ${STATUS_LABELS[b.status]?.color || "bg-gray-100"}`}
                        disabled={mutate.isPending}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="text-navy">
                            {STATUS_LABELS[s].th}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpandedRow(expandedRow === b.id ? null : b.id)}
                        className="text-gold hover:text-gold-dark transition"
                      >
                        {expandedRow === b.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Row - Additional Details */}
                  {expandedRow === b.id && (
                    <tr className="bg-cream/20">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-semibold text-navy mb-2 flex items-center gap-2">
                              <User size={14} /> ข้อมูลลูกค้า
                            </h4>
                            <div className="space-y-1 text-xs">
                              <p>
                                <span className="text-muted-foreground">ชื่อ:</span> {b.customer_name || "-"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">อีเมล:</span> {b.customer_email || "-"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">เบอร์โทร:</span> {b.customer_phone || "-"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Persona:</span> {b.persona || "-"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-navy mb-2 flex items-center gap-2">
                              <Calendar size={14} /> รายละเอียดการจอง
                            </h4>
                            <div className="space-y-1 text-xs">
                              <p>
                                <span className="text-muted-foreground">วันที่เดินทาง:</span> {b.booking_date || "-"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">ระยะเวลา:</span> {b.program_duration || "-"} วัน
                              </p>
                              <p>
                                <span className="text-muted-foreground">ราคา:</span>{" "}
                                {b.program_price?.toLocaleString() || "-"} บาท
                              </p>
                              <p>
                                <span className="text-muted-foreground">หมายเหตุ:</span> {b.partner_notes || "—"}
                              </p>
                            </div>
                          </div>
                          {b.meal_plan && b.meal_plan.length > 0 && (
                            <div className="md:col-span-2">
                              <h4 className="font-semibold text-navy mb-2 flex items-center gap-2">
                                <span>🍽️</span> บันทึกแผนอาหาร
                              </h4>
                              <div className="bg-white/50 rounded-lg p-2 max-h-32 overflow-y-auto">
                                {b.meal_plan.map((note: string, idx: number) => (
                                  <p key={idx} className="text-xs text-muted-foreground py-0.5">
                                    • {note}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filteredList.length === 0 && !q.isLoading && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={32} className="text-muted-foreground/50" />
                      <p>ไม่พบรายการจอง</p>
                      {searchQuery && <p className="text-xs">ลองเปลี่ยนคำค้นหา หรือเคลียร์ตัวกรอง</p>}
                    </div>
                  </td>
                </tr>
              )}
              {q.isLoading && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-muted-foreground pt-2">
        รายการทั้งหมด {filteredList.length} รายการ
      </div>
    </div>
  );
}
