import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setupLineRichMenu, listLineRichMenus, deleteLineRichMenu } from "@/lib/line-richmenu.functions";
import { toast } from "sonner";
import { Sparkles, Trash2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/line")({
  component: AdminLinePage,
});

function ChannelPanel({ channel, title }: { channel: "customer" | "partner"; title: string }) {
  const setupFn = useServerFn(setupLineRichMenu);
  const listFn = useServerFn(listLineRichMenus);
  const delFn = useServerFn(deleteLineRichMenu);
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["line", "richmenus", channel],
    queryFn: () => listFn({ data: { channel } }),
  });

  const setup = useMutation({
    mutationFn: () => setupFn({ data: { channel } }),
    onSuccess: (r) => {
      toast.success(`สร้าง Rich Menu สำเร็จ (${r.size.width}x${r.size.height})`);
      qc.invalidateQueries({ queryKey: ["line", "richmenus", channel] });
    },
    onError: (e: any) => toast.error(e?.message ?? "ผิดพลาด"),
  });

  const del = useMutation({
    mutationFn: (richMenuId: string) => delFn({ data: { channel, richMenuId } }),
    onSuccess: () => {
      toast.success("ลบแล้ว");
      qc.invalidateQueries({ queryKey: ["line", "richmenus", channel] });
    },
    onError: (e: any) => toast.error(e?.message ?? "ผิดพลาด"),
  });

  return (
    <div className="card-cream rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] tracking-widest uppercase text-emerald">{channel}</div>
          <h2 className="font-display text-xl text-navy">{title}</h2>
        </div>
        <button
          onClick={() => setup.mutate()}
          disabled={setup.isPending}
          className="btn-gold rounded-full px-4 py-2 text-sm inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Sparkles size={14} /> {setup.isPending ? "กำลังสร้าง…" : "สร้าง / อัปเดต Rich Menu (AI)"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        AI จะ generate รูปและตั้งค่าเป็น default rich menu ของ channel นี้ทันที
      </p>

      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-medium text-navy">Rich Menus ใน channel</span>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ["line", "richmenus", channel] })}
          className="text-emerald inline-flex items-center gap-1"
        >
          <RefreshCw size={12} /> refresh
        </button>
      </div>
      <div className="space-y-1.5">
        {q.isLoading && <div className="text-xs text-muted-foreground">กำลังโหลด…</div>}
        {q.isError && <div className="text-xs text-red-500">{(q.error as Error).message}</div>}
        {(q.data ?? []).length === 0 && !q.isLoading && (
          <div className="text-xs text-muted-foreground">ยังไม่มี rich menu</div>
        )}
        {(q.data ?? []).map((m: any) => (
          <div key={m.richMenuId} className="flex items-center justify-between bg-ivory rounded-lg px-3 py-2 text-xs">
            <div>
              <div className="font-medium text-navy">{m.name}</div>
              <div className="font-mono text-[10px] text-muted-foreground">{m.richMenuId}</div>
            </div>
            <button
              onClick={() => del.mutate(m.richMenuId)}
              className="text-red-500 inline-flex items-center gap-1"
            >
              <Trash2 size={12} /> ลบ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminLinePage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-3xl text-navy">LINE Rich Menu</h1>
        <p className="text-sm text-muted-foreground">
          จัดการเมนูล่างของแชต LINE สำหรับ Customer OA และ Partner OA
        </p>
      </header>
      <div className="grid lg:grid-cols-2 gap-4">
        <ChannelPanel channel="customer" title="Customer OA" />
        <ChannelPanel channel="partner" title="Partner OA" />
      </div>
    </div>
  );
}