import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listPrograms, upsertProgram, deleteProgram } from "@/lib/admin.functions";
import {
  uploadProgramImage,
  generateProgramImage,
  deleteProgramImage,
} from "@/lib/program-images.functions";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, X, Sparkles, Upload, ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/programs")({ component: ProgramsAdmin });

type ProgramImage = { path: string; url: string; alt?: string | null };

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
  images: ProgramImage[];
};

function ProgramsAdmin() {
  const fetchFn = useServerFn(listPrograms);
  const upsertFn = useServerFn(upsertProgram);
  const deleteFn = useServerFn(deleteProgram);
  const uploadFn = useServerFn(uploadProgramImage);
  const genFn = useServerFn(generateProgramImage);
  const delImgFn = useServerFn(deleteProgramImage);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<ProgramRow> | null>(null);
  const [images, setImages] = useState<ProgramImage[]>([]);
  const [slugInput, setSlugInput] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [upBusy, setUpBusy] = useState(false);

  function startEdit(p: Partial<ProgramRow> | null) {
    setEditing(p);
    setImages((p?.images ?? []) as ProgramImage[]);
    setSlugInput(p?.slug ?? "");
    setAiPrompt("");
  }

  const q = useQuery({ queryKey: ["admin", "programs"], queryFn: () => fetchFn() });
  const save = useMutation({
    mutationFn: (input: any) => upsertFn({ data: input }),
    onSuccess: () => {
      toast.success("บันทึกแล้ว");
      startEdit(null);
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

  async function onUploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!slugInput) {
      toast.error("กรุณาใส่ slug ก่อนอัพโหลด");
      return;
    }
    setUpBusy(true);
    try {
      for (const file of Array.from(files)) {
        const b64 = await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result));
          r.onerror = reject;
          r.readAsDataURL(file);
        });
        const res = await uploadFn({
          data: { base64: b64, mime: file.type || "image/png", slug: slugInput, alt: file.name },
        });
        setImages((s) => [...s, res]);
      }
      toast.success("อัพโหลดสำเร็จ");
    } catch (e: any) {
      toast.error(e.message ?? "อัพโหลดไม่สำเร็จ");
    } finally {
      setUpBusy(false);
    }
  }

  async function onGenerateAI() {
    if (!aiPrompt.trim()) {
      toast.error("กรุณาใส่คำสั่งสำหรับ AI");
      return;
    }
    if (!slugInput) {
      toast.error("กรุณาใส่ slug ก่อน");
      return;
    }
    setAiBusy(true);
    try {
      const res = await genFn({ data: { prompt: aiPrompt, slug: slugInput } });
      setImages((s) => [...s, res]);
      toast.success("สร้างรูปสำเร็จ");
    } catch (e: any) {
      toast.error(e.message ?? "สร้างรูปไม่สำเร็จ");
    } finally {
      setAiBusy(false);
    }
  }

  async function onRemoveImage(idx: number) {
    const img = images[idx];
    setImages((s) => s.filter((_, i) => i !== idx));
    try {
      await delImgFn({ data: { path: img.path } });
    } catch {
      // best-effort cleanup
    }
  }

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
      image_url: images[0]?.url ?? (String(fd.get("image_url") || "") || null),
      sort_order: Number(fd.get("sort_order") || 0),
      is_published: fd.get("is_published") === "on",
      images,
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
          onClick={() => startEdit({ currency: "THB", sort_order: 0, is_published: true, price: 0, images: [] })}
          className="btn-gold rounded-full px-4 py-2 text-sm flex items-center gap-1"
        >
          <Plus size={16} /> เพิ่มโปรแกรม
        </button>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {(q.data ?? []).map((p: any) => (
          <div key={p.id} className="card-cream rounded-2xl p-4">
            {(p.images?.[0]?.url || p.image_url) && (
              <div className="aspect-[16/10] -mx-4 -mt-4 mb-3 overflow-hidden rounded-t-2xl bg-cream">
                <img
                  src={p.images?.[0]?.url ?? p.image_url}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <div className="text-[10px] uppercase text-muted-foreground">{p.slug}</div>
                <div className="font-display text-lg text-navy truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.duration}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(p)} className="p-1.5 rounded-full hover:bg-cream"><Edit2 size={14} /></button>
                <button onClick={() => confirm(`ลบ ${p.name}?`) && del.mutate(p.id)} className="p-1.5 rounded-full hover:bg-red-100 text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-emerald font-medium">฿{Number(p.price).toLocaleString()}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                  <ImageIcon size={10} /> {p.images?.length ?? 0}
                </span>
                <span className={`pill text-[9px] ${p.is_published ? "bg-pale-mint text-emerald" : "bg-cream text-muted-foreground"}`}>
                  {p.is_published ? "เผยแพร่" : "ซ่อน"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => startEdit(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={onSubmit} className="bg-ivory rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl text-navy">{editing.id ? "แก้ไขโปรแกรม" : "เพิ่มโปรแกรม"}</h2>
              <button type="button" onClick={() => startEdit(null)}><X size={18} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <label className="block">
                <span className="text-xs text-muted-foreground">Slug *</span>
                <input
                  name="slug"
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value)}
                  className="mt-1 w-full bg-cream/50 rounded-lg px-3 py-2 text-sm border border-mint/30"
                />
              </label>
              {[
                { name: "name", label: "ชื่อโปรแกรม *", val: editing.name ?? "" },
                { name: "tagline", label: "Tagline", val: editing.tagline ?? "" },
                { name: "duration", label: "ระยะเวลา *", val: editing.duration ?? "" },
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

              {/* Image gallery editor */}
              <div className="pt-3 border-t border-mint/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium">รูปภาพ ({images.length})</span>
                  <span className="text-[10px] text-muted-foreground">รูปแรกเป็น cover</span>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {images.map((img, i) => (
                      <div key={img.path} className="relative aspect-square rounded-lg overflow-hidden bg-cream group">
                        <img src={img.url} alt={img.alt ?? ""} className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute top-1 left-1 bg-gold text-navy text-[9px] px-1.5 py-0.5 rounded">COVER</span>
                        )}
                        <button
                          type="button"
                          onClick={() => onRemoveImage(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <label className="cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-dashed border-mint/60 px-3 py-3 text-xs text-emerald hover:bg-cream/40">
                    <Upload size={14} />
                    {upBusy ? "กำลังอัพโหลด…" : "อัพโหลด"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={upBusy}
                      onChange={(e) => onUploadFiles(e.target.files)}
                      className="hidden"
                    />
                  </label>
                  <div className="rounded-lg border border-dashed border-gold/60 p-2 space-y-1.5 bg-gold/5">
                    <div className="flex items-center gap-1 text-xs text-gold font-medium">
                      <Sparkles size={12} /> AI Generate
                    </div>
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="เช่น villa สมุย พระอาทิตย์ตก..."
                      className="w-full bg-white/70 rounded px-2 py-1 text-[11px] border border-mint/30"
                    />
                    <button
                      type="button"
                      onClick={onGenerateAI}
                      disabled={aiBusy}
                      className="w-full bg-gold text-navy rounded px-2 py-1 text-[11px] font-medium disabled:opacity-50"
                    >
                      {aiBusy ? "กำลังสร้าง…" : "สร้างรูป"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => startEdit(null)} className="text-sm px-4 py-2 rounded-full bg-cream">ยกเลิก</button>
              <button type="submit" disabled={save.isPending} className="btn-gold rounded-full px-4 py-2 text-sm">{save.isPending ? "กำลังบันทึก…" : "บันทึก"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}