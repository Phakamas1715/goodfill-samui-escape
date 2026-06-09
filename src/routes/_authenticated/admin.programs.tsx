import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listPrograms, upsertProgram, deleteProgram } from "@/lib/admin.functions";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/programs")({ component: ProgramsAdmin });

type ProgramRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  duration: string;
  price: number;
  currency: string;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
};

function ProgramsAdmin() {
  const fetchFn = useServerFn(listPrograms);
  const upsertFn = useServerFn(upsertProgram);
  const deleteFn = useServerFn(deleteProgram);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<ProgramRow> | null>(null);

  const q = useQuery({ queryKey: ["admin", "programs"], queryFn: () => fetchFn() });
  const save = useMutation({
    mutationFn: (input: any) => upsertFn({ data: input }),
    onSuccess: () => {
      toast.success("บันทึกแล้ว");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin", "programs"] });
    },
    onError: (e: any) => toast.error(e.message ?? "ไม่สำเร็จ"),
  });
  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("ลบแล้ว");
      qc.invalidateQueries({ queryKey: ["admin", "programs"] });
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const fd = new FormData(e.currentTarget);
    const payload: any = {
      id: editing.id,
      slug: String(fd.get("slug") || ""),
      name: String(fd.get("name") || ""),
      tagline: String(fd.get("tagline") || "") || null,
      description: String(fd.get("description") || "") || null,
      duration: String(fd.get("duration") || ""),
      price: Number(fd.get("price") || 0),
      currency: String(fd.get("currency") || "THB"),
      image_url: String(fd.get("image_url") || "") || null,
      sort_order: Number(fd.get("sort_order") || 0),
      is_published: fd.get("is_published") === "on",
    };
    save.mutate(payload);
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-navy">Programs</h1>
          <p className="text-sm text-muted-foreground">{q.data?.length ?? 0} โปรแกรม</p>
        </div>
        <button
          onClick={() => setEditing({ currency: "THB", sort_order: 0, is_published: true, price: 0 })}
          className="btn-gold rounded-full px-4 py-2 text-sm flex items-center gap-1"
        >
          <Plus size={16} /> เพิ่มโปรแกรม
        </button>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {(q.data ?? []).map((p: any) => (
          <div key={p.id} className="card-cream rounded-2xl p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <div className="text-[10px] uppercase text-muted-foreground">{p.slug}</div>
                <div className="font-display text-lg text-navy truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.duration}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(p)} className="p-1.5 rounded-full hover:bg-cream"><Edit2 size={14} /></button>
                <button onClick={() => confirm(`ลบ ${p.name}?`) && del.mutate(p.id)} className="p-1.5 rounded-full hover:bg-red-100 text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-emerald font-medium">฿{Number(p.price).toLocaleString()}</span>
              <span className={`pill text-[9px] ${p.is_published ? "bg-pale-mint text-emerald" : "bg-cream text-muted-foreground"}`}>
                {p.is_published ? "เผยแพร่" : "ซ่อน"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={onSubmit} className="bg-ivory rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl text-navy">{editing.id ? "แก้ไขโปรแกรม" : "เพิ่มโปรแกรม"}</h2>
              <button type="button" onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { name: "slug", label: "Slug *", val: editing.slug ?? "" },
                { name: "name", label: "ชื่อโปรแกรม *", val: editing.name ?? "" },
                { name: "tagline", label: "Tagline", val: editing.tagline ?? "" },
                { name: "duration", label: "ระยะเวลา *", val: editing.duration ?? "" },
                { name: "image_url", label: "Image URL", val: editing.image_url ?? "" },
              ].map((f) => (
                <label key={f.name} className="block">
                  <span className="text-xs text-muted-foreground">{f.label}</span>
                  <input name={f.name} defaultValue={f.val as string} className="mt-1 w-full bg-cream/50 rounded-lg px-3 py-2 text-sm border border-mint/30" />
                </label>
              ))}
              <label className="block">
                <span className="text-xs text-muted-foreground">รายละเอียด</span>
                <textarea name="description" defaultValue={editing.description ?? ""} rows={3} className="mt-1 w-full bg-cream/50 rounded-lg px-3 py-2 text-sm border border-mint/30" />
              </label>
              <div className="grid grid-cols-3 gap-2">
                <label className="block">
                  <span className="text-xs text-muted-foreground">ราคา *</span>
                  <input type="number" step="0.01" name="price" defaultValue={editing.price ?? 0} className="mt-1 w-full bg-cream/50 rounded-lg px-3 py-2 text-sm" />
                </label>
                <label className="block">
                  <span className="text-xs text-muted-foreground">Currency</span>
                  <input name="currency" defaultValue={editing.currency ?? "THB"} className="mt-1 w-full bg-cream/50 rounded-lg px-3 py-2 text-sm" />
                </label>
                <label className="block">
                  <span className="text-xs text-muted-foreground">ลำดับ</span>
                  <input type="number" name="sort_order" defaultValue={editing.sort_order ?? 0} className="mt-1 w-full bg-cream/50 rounded-lg px-3 py-2 text-sm" />
                </label>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_published" defaultChecked={editing.is_published ?? true} />
                <span className="text-sm">เผยแพร่</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setEditing(null)} className="text-sm px-4 py-2 rounded-full bg-cream">ยกเลิก</button>
              <button type="submit" disabled={save.isPending} className="btn-gold rounded-full px-4 py-2 text-sm">{save.isPending ? "กำลังบันทึก…" : "บันทึก"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}