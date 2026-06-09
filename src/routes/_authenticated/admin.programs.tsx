import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listPrograms, upsertProgram, deleteProgram } from "@/lib/admin.functions";
import { uploadProgramImage, generateProgramImage, deleteProgramImage } from "@/lib/program-images.functions";
import { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Sparkles,
  Upload,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/programs")({
  component: ProgramsAdmin,
  head: () => ({
    meta: [
      { title: "Programs Management | Goodfill Care Admin" },
      { name: "description", content: "จัดการโปรแกรม wellness ทั้งหมด" },
    ],
  }),
});

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

  const q = useQuery({
    queryKey: ["admin", "programs"],
    queryFn: () => fetchFn(),
    refetchInterval: 30000,
  });

  const save = useMutation({
    mutationFn: (input: any) => upsertFn({ data: input }),
    onSuccess: () => {
      toast.success("บันทึกโปรแกรมสำเร็จ");
      startEdit(null);
      qc.invalidateQueries({ queryKey: ["admin", "programs"] });
    },
    onError: (e: any) => toast.error(e.message ?? "บันทึกไม่สำเร็จ"),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("ลบโปรแกรมสำเร็จ");
      qc.invalidateQueries({ queryKey: ["admin", "programs"] });
    },
    onError: (e: any) => toast.error(e.message ?? "ลบไม่สำเร็จ"),
  });

  async function onUploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!slugInput) {
      toast.error("กรุณาใส่ slug ก่อนอัพโหลดรูป");
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
      toast.success(`อัพโหลดรูป ${files.length} รูปสำเร็จ`);
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
      toast.success("สร้างรูปด้วย AI สำเร็จ");
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
      toast.success("ลบรูปสำเร็จ");
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
      name_en: String(fd.get("name_en") || "") || null,
      name_th: String(fd.get("name_th") || "") || null,
      tagline: String(fd.get("tagline") || "") || null,
      tagline_en: String(fd.get("tagline_en") || "") || null,
      tagline_th: String(fd.get("tagline_th") || "") || null,
      description: String(fd.get("description") || "") || null,
      description_en: String(fd.get("description_en") || "") || null,
      description_th: String(fd.get("description_th") || "") || null,
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

  const programs = q.data ?? [];
  const publishedCount = programs.filter((p: any) => p.is_published).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-navy">จัดการโปรแกรม</h1>
          <p className="text-sm text-muted-foreground mt-1">
            ทั้งหมด {programs.length} โปรแกรม • เผยแพร่แล้ว {publishedCount} โปรแกรม
          </p>
        </div>
        <button
          onClick={() =>
            startEdit({ currency: "THB", sort_order: programs.length, is_published: true, price: 0, images: [] })
          }
          className="btn-emerald rounded-full px-5 py-2.5 text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition"
        >
          <Plus size={16} /> เพิ่มโปรแกรมใหม่
        </button>
      </header>

      {/* Programs Grid */}
      {q.isLoading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Sparkles size={20} className="animate-spin" />
            กำลังโหลดโปรแกรม...
          </div>
        </div>
      )}

      {q.isError && (
        <div className="bg-red-50 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <div>
            <p className="text-sm font-medium text-red-700">เกิดข้อผิดพลาด</p>
            <p className="text-xs text-red-600">{(q.error as Error).message}</p>
          </div>
        </div>
      )}

      {!q.isLoading && !q.isError && programs.length === 0 && (
        <div className="text-center py-12 bg-cream/30 rounded-2xl">
          <Package size={48} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">ยังไม่มีโปรแกรม</p>
          <button
            onClick={() => startEdit({ currency: "THB", sort_order: 0, is_published: true, price: 0, images: [] })}
            className="mt-3 btn-gold rounded-full px-4 py-2 text-sm inline-flex items-center gap-1"
          >
            <Plus size={14} /> เพิ่มโปรแกรมแรก
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((p: any) => (
          <div key={p.id} className="card-cream rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
            {/* Image */}
            {(p.images?.[0]?.url || p.image_url) && (
              <div className="aspect-[16/9] overflow-hidden bg-cream">
                <img
                  src={p.images?.[0]?.url ?? p.image_url}
                  alt={p.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-mono text-muted-foreground bg-cream/50 px-1.5 py-0.5 rounded">
                      {p.slug}
                    </span>
                    {p.is_published ? (
                      <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald bg-emerald/10 px-1.5 py-0.5 rounded-full">
                        <Globe size={8} /> เผยแพร่
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[9px] text-muted-foreground bg-cream px-1.5 py-0.5 rounded-full">
                        <EyeOff size={8} /> ซ่อน
                      </span>
                    )}
                  </div>
                  <div className="font-display text-lg text-navy truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.duration}</div>
                  <div className="text-emerald font-semibold text-sm mt-1">฿{Number(p.price).toLocaleString()}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(p)}
                    className="p-2 rounded-full hover:bg-cream transition"
                    title="แก้ไข"
                  >
                    <Edit2 size={14} className="text-navy" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`ยืนยันลบโปรแกรม "${p.name}"?`)) {
                        del.mutate(p.id);
                      }
                    }}
                    className="p-2 rounded-full hover:bg-red-100 transition"
                    title="ลบ"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>

              {/* Image count */}
              {(p.images?.length > 0 || p.image_url) && (
                <div className="mt-3 pt-2 border-t border-mint/30 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <ImageIcon size={10} />
                  <span>รูปภาพ {p.images?.length || 1} รูป</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => startEdit(null)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={onSubmit}
            className="bg-ivory rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-display text-2xl text-navy">{editing.id ? "แก้ไขโปรแกรม" : "เพิ่มโปรแกรมใหม่"}</h2>
              <button
                type="button"
                onClick={() => startEdit(null)}
                className="p-1 hover:bg-cream rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-muted-foreground font-medium">Slug *</span>
                  <input
                    name="slug"
                    value={slugInput}
                    onChange={(e) => setSlugInput(e.target.value)}
                    className="mt-1 w-full bg-cream/50 rounded-xl px-3 py-2.5 text-sm border border-mint/30 focus:outline-none focus:ring-2 focus:ring-emerald/40"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted-foreground font-medium">ชื่อโปรแกรม *</span>
                  <input
                    name="name"
                    defaultValue={editing.name ?? ""}
                    className="mt-1 w-full bg-cream/50 rounded-xl px-3 py-2.5 text-sm border border-mint/30 focus:outline-none focus:ring-2 focus:ring-emerald/40"
                    required
                  />
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-muted-foreground font-medium">Tagline</span>
                  <input
                    name="tagline"
                    defaultValue={editing.tagline ?? ""}
                    className="mt-1 w-full bg-cream/50 rounded-xl px-3 py-2.5 text-sm border border-mint/30"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted-foreground font-medium">ระยะเวลา *</span>
                  <input
                    name="duration"
                    defaultValue={editing.duration ?? ""}
                    className="mt-1 w-full bg-cream/50 rounded-xl px-3 py-2.5 text-sm border border-mint/30"
                    required
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs text-muted-foreground font-medium">รายละเอียด</span>
                <textarea
                  name="description"
                  defaultValue={editing.description ?? ""}
                  rows={3}
                  className="mt-1 w-full bg-cream/50 rounded-xl px-3 py-2.5 text-sm border border-mint/30"
                />
              </label>

              {/* Price & Sort */}
              <div className="grid grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-xs text-muted-foreground font-medium">ราคา *</span>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={editing.price ?? 0}
                    className="mt-1 w-full bg-cream/50 rounded-xl px-3 py-2.5 text-sm"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted-foreground font-medium">สกุลเงิน</span>
                  <input
                    name="currency"
                    defaultValue={editing.currency ?? "THB"}
                    className="mt-1 w-full bg-cream/50 rounded-xl px-3 py-2.5 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted-foreground font-medium">ลำดับ</span>
                  <input
                    type="number"
                    name="sort_order"
                    defaultValue={editing.sort_order ?? 0}
                    className="mt-1 w-full bg-cream/50 rounded-xl px-3 py-2.5 text-sm"
                  />
                </label>
              </div>

              {/* Published Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={editing.is_published ?? true}
                  className="w-4 h-4 accent-emerald"
                />
                <span className="text-sm text-navy">เผยแพร่โปรแกรม</span>
              </label>

              {/* Image Gallery Editor */}
              <div className="pt-4 border-t border-mint/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground font-medium">รูปภาพ ({images.length})</span>
                  <span className="text-[10px] text-muted-foreground">รูปแรกเป็นรูปปก</span>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {images.map((img, i) => (
                      <div
                        key={img.path}
                        className="relative aspect-square rounded-xl overflow-hidden bg-cream group shadow-sm"
                      >
                        <img src={img.url} alt={img.alt ?? ""} className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute top-1 left-1 bg-gold text-navy text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                            COVER
                          </span>
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

                <div className="grid grid-cols-2 gap-3">
                  {/* Upload */}
                  <label className="cursor-pointer flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-mint/50 px-4 py-4 text-xs text-emerald hover:bg-cream/40 transition">
                    <Upload size={18} />
                    {upBusy ? "กำลังอัพโหลด..." : "อัพโหลดรูปภาพ"}
                    <span className="text-[10px] text-muted-foreground">JPEG, PNG สูงสุด 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={upBusy}
                      onChange={(e) => onUploadFiles(e.target.files)}
                      className="hidden"
                    />
                  </label>

                  {/* AI Generate */}
                  <div className="rounded-xl border-2 border-gold/40 p-3 space-y-2 bg-gold/5">
                    <div className="flex items-center gap-1.5 text-xs text-gold font-medium">
                      <Sparkles size={14} /> AI Generate
                    </div>
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="เช่น villa สมุย พระอาทิตย์ตก..."
                      className="w-full bg-white/90 rounded-lg px-2 py-1.5 text-[11px] border border-mint/30 focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                    <button
                      type="button"
                      onClick={onGenerateAI}
                      disabled={aiBusy}
                      className="w-full bg-gold text-navy rounded-lg px-2 py-1.5 text-[11px] font-medium disabled:opacity-50 hover:bg-gold/90 transition"
                    >
                      {aiBusy ? "กำลังสร้าง..." : "สร้างรูปด้วย AI"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-mint/30">
              <button
                type="button"
                onClick={() => startEdit(null)}
                className="text-sm px-5 py-2.5 rounded-full bg-cream hover:bg-cream/80 transition"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={save.isPending}
                className="btn-emerald rounded-full px-6 py-2.5 text-sm font-semibold shadow-md disabled:opacity-50"
              >
                {save.isPending ? "กำลังบันทึก..." : "บันทึกโปรแกรม"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// Missing Package icon
function Package(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 8h16M4 8v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M4 8 7 4h10l3 4" />
      <path d="M12 12v4" />
      <path d="M8 12v4" />
      <path d="M16 12v4" />
    </svg>
  );
}
