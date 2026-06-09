import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setupLineRichMenu, listLineRichMenus, deleteLineRichMenu } from "@/lib/line-richmenu.functions";
import { toast } from "sonner";
import { Sparkles, Trash2, RefreshCw, Image, Smartphone, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/line")({
  component: AdminLinePage,
  head: () => ({
    meta: [
      { title: "LINE Rich Menu | Goodfill Care Admin" },
      { name: "description", content: "จัดการ LINE Rich Menu สำหรับ Customer OA และ Partner OA" },
    ],
  }),
});

function ChannelPanel({ channel, title }: { channel: "customer" | "partner"; title: string }) {
  const setupFn = useServerFn(setupLineRichMenu);
  const listFn = useServerFn(listLineRichMenus);
  const delFn = useServerFn(deleteLineRichMenu);
  const qc = useQueryClient();
  const [previewMenu, setPreviewMenu] = useState<any | null>(null);

  const q = useQuery({
    queryKey: ["line", "richmenus", channel],
    queryFn: () => listFn({ data: { channel } }),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const setup = useMutation({
    mutationFn: () => setupFn({ data: { channel } }),
    onSuccess: (r) => {
      toast.success(`สร้าง Rich Menu สำเร็จ (${r.size.width}x${r.size.height})`);
      qc.invalidateQueries({ queryKey: ["line", "richmenus", channel] });
    },
    onError: (e: any) => toast.error(e?.message ?? "สร้างไม่สำเร็จ"),
  });

  const del = useMutation({
    mutationFn: (richMenuId: string) => delFn({ data: { channel, richMenuId } }),
    onSuccess: () => {
      toast.success("ลบ Rich Menu เรียบร้อย");
      qc.invalidateQueries({ queryKey: ["line", "richmenus", channel] });
    },
    onError: (e: any) => toast.error(e?.message ?? "ลบไม่สำเร็จ"),
  });

  const menus = q.data ?? [];
  const defaultMenu = menus.find((m: any) => m.isDefault);
  const otherMenus = menus.filter((m: any) => !m.isDefault);

  return (
    <div className="card-cream rounded-2xl p-5 shadow-md hover:shadow-lg transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald/10 text-emerald text-[9px] font-semibold uppercase tracking-wider mb-2">
            <Smartphone size={10} />
            {channel}
          </div>
          <h2 className="font-display text-xl md:text-2xl text-navy">{title}</h2>
        </div>
        <button
          onClick={() => setup.mutate()}
          disabled={setup.isPending}
          className="btn-gold rounded-full px-4 py-2.5 text-sm inline-flex items-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg transition"
        >
          <Sparkles size={14} />
          {setup.isPending
            ? channel === "customer"
              ? "กำลังสร้าง..."
              : "Creating..."
            : channel === "customer"
              ? "สร้าง / อัปเดต Rich Menu"
              : "Create / Update Rich Menu"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        {channel === "customer"
          ? "AI จะ generate รูปและตั้งค่าเป็น default rich menu ของช่องทางนี้ทันที"
          : "AI will generate and set as default rich menu for this channel"}
      </p>

      {/* Default Menu Section */}
      {defaultMenu && (
        <div className="mb-4 p-3 bg-emerald/5 rounded-xl border border-emerald/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald" />
              <span className="text-xs font-semibold text-emerald">
                {channel === "customer" ? "Default Rich Menu" : "Default Rich Menu"}
              </span>
            </div>
            <button
              onClick={() => setPreviewMenu(previewMenu?.richMenuId === defaultMenu.richMenuId ? null : defaultMenu)}
              className="text-gold text-[11px] inline-flex items-center gap-1 hover:underline"
            >
              <Eye size={12} />{" "}
              {previewMenu?.richMenuId === defaultMenu.richMenuId
                ? channel === "customer"
                  ? "ซ่อน"
                  : "Hide"
                : channel === "customer"
                  ? "ดูตัวอย่าง"
                  : "Preview"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-navy text-sm">{defaultMenu.name}</div>
              <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{defaultMenu.richMenuId}</div>
            </div>
            <button
              onClick={() => del.mutate(defaultMenu.richMenuId)}
              disabled={del.isPending}
              className="text-red-500 inline-flex items-center gap-1 text-[11px] hover:text-red-700 transition"
            >
              <Trash2 size={12} /> {channel === "customer" ? "ลบ" : "Delete"}
            </button>
          </div>
        </div>
      )}

      {/* Other Menus Section */}
      {otherMenus.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
            <Image size={12} />
            {channel === "customer" ? "Rich Menus อื่นๆ" : "Other Rich Menus"}
          </div>
          <div className="space-y-2">
            {otherMenus.map((m: any) => (
              <div
                key={m.richMenuId}
                className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-xs border border-mint/30 hover:shadow-sm transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-navy truncate">{m.name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground truncate">{m.richMenuId}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMenu(previewMenu?.richMenuId === m.richMenuId ? null : m)}
                    className="text-gold text-[11px] hover:underline"
                  >
                    {previewMenu?.richMenuId === m.richMenuId
                      ? channel === "customer"
                        ? "ซ่อน"
                        : "Hide"
                      : channel === "customer"
                        ? "ดู"
                        : "View"}
                  </button>
                  <button
                    onClick={() => del.mutate(m.richMenuId)}
                    disabled={del.isPending}
                    className="text-red-500 inline-flex items-center gap-1 text-[11px] hover:text-red-700 transition"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading & Empty States */}
      {q.isLoading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw size={12} className="animate-spin" />
            {channel === "customer" ? "กำลังโหลด..." : "Loading..."}
          </div>
        </div>
      )}

      {q.isError && (
        <div className="bg-red-50 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle size={14} className="text-red-500" />
          <span className="text-xs text-red-600">{(q.error as Error).message}</span>
        </div>
      )}

      {menus.length === 0 && !q.isLoading && !q.isError && (
        <div className="text-center py-6">
          <Image size={32} className="mx-auto text-muted-foreground/30 mb-2" />
          <div className="text-xs text-muted-foreground">
            {channel === "customer" ? "ยังไม่มี Rich Menu" : "No Rich Menu yet"}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {channel === "customer" ? "คลิกปุ่มด้านบนเพื่อสร้างด้วย AI" : "Click the button above to create with AI"}
          </p>
        </div>
      )}

      {/* Refresh Button Footer */}
      <div className="mt-4 pt-3 border-t border-mint/30 flex justify-end">
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ["line", "richmenus", channel] })}
          className="text-emerald text-[11px] inline-flex items-center gap-1 hover:underline"
          disabled={q.isFetching}
        >
          <RefreshCw size={12} className={q.isFetching ? "animate-spin" : ""} />
          {q.isFetching
            ? channel === "customer"
              ? "กำลังโหลด..."
              : "Refreshing..."
            : channel === "customer"
              ? "รีเฟรช"
              : "Refresh"}
        </button>
      </div>

      {/* Preview Modal */}
      {previewMenu && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setPreviewMenu(null)}
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg text-navy">Preview: {previewMenu.name}</h3>
              <button onClick={() => setPreviewMenu(null)} className="text-muted-foreground hover:text-navy">
                ✕
              </button>
            </div>
            <div className="bg-gray-100 rounded-xl p-3 text-center">
              <div className="text-xs text-muted-foreground mb-2">
                {previewMenu.size?.width}x{previewMenu.size?.height}
              </div>
              {previewMenu.imageUrl ? (
                <img
                  src={previewMenu.imageUrl}
                  alt={previewMenu.name}
                  className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                  style={{ maxHeight: "400px" }}
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-emerald/20 to-gold/20 rounded-lg flex items-center justify-center">
                  <Image size={32} className="text-muted-foreground/50" />
                </div>
              )}
            </div>
            <div className="mt-3 text-[10px] text-muted-foreground text-center">
              Rich Menu ID: {previewMenu.richMenuId}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminLinePage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl md:text-4xl text-navy">LINE Rich Menu</h1>
        <p className="text-sm text-muted-foreground mt-1">
          จัดการเมนูล่างของแชต LINE สำหรับ Customer OA และ Partner OA
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChannelPanel channel="customer" title="Customer OA" />
        <ChannelPanel channel="partner" title="Partner OA" />
      </div>

      <div className="text-center text-[10px] text-muted-foreground pt-4">
        Rich Menu จะแสดงใต้ช่องแชท LINE เมื่อผู้ใช้เพิ่มเพื่อน
      </div>
    </div>
  );
}
