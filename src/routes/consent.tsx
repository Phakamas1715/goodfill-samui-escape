import { createFileRoute, Link } from "@tanstack/react-router";
import { DashShell } from "@/components/DashShell";
import { Shield, Lock, Heart, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/consent")({
  head: () => ({ meta: [{ title: "Consent · ความยินยอม — Goodfill Care" }] }),
  component: ConsentPage,
});

function ConsentPage() {
  const [ok, setOk] = useState({ data: false, health: false, marketing: false });
  const canContinue = ok.data && ok.health;

  return (
    <DashShell
      bg="meditation"
      kicker="Step 2 of 3"
      title="ความยินยอม · Consent"
      subtitle="เพื่อมอบประสบการณ์ wellness ที่เหมาะสมที่สุด"
    >
      <div className="max-w-2xl mx-auto w-full px-4 md:px-0">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-1 w-12 rounded-full bg-gold/60" />
          <div className="h-1 w-12 rounded-full bg-gold" />
          <div className="h-1 w-12 rounded-full bg-mint/30" />
        </div>

        <div className="space-y-3 md:space-y-4">
          <Item
            icon={Shield}
            title="การเก็บข้อมูลส่วนตัว · Personal Data"
            required
            checked={ok.data}
            onChange={(v) => setOk({ ...ok, data: v })}
          >
            อนุญาตให้ Goodfill Care เก็บข้อมูลพื้นฐาน เช่น ชื่อ อีเมล เบอร์โทร
            เพื่อใช้ในการให้บริการตาม PDPA
          </Item>

          <Item
            icon={Heart}
            title="ข้อมูลสุขภาพ · Health Data"
            required
            checked={ok.health}
            onChange={(v) => setOk({ ...ok, health: v })}
          >
            อนุญาตให้ผู้เชี่ยวชาญใช้ข้อมูลสุขภาพของคุณในการออกแบบโปรแกรม wellness
            โดยข้อมูลจะถูกเข้ารหัสและจำกัดการเข้าถึง
          </Item>

          <Item
            icon={Lock}
            title="การตลาด · Marketing (ไม่บังคับ)"
            checked={ok.marketing}
            onChange={(v) => setOk({ ...ok, marketing: v })}
          >
            ยินยอมรับข้อเสนอพิเศษและจดหมายข่าวจาก Goodfill Care ยกเลิกได้ทุกเมื่อ
          </Item>
        </div>

        {/* Summary of consent */}
        <div className="mt-6 p-4 bg-pale-mint/30 rounded-xl border border-mint/40">
          <div className="flex items-center gap-2 text-xs text-emerald font-medium mb-2">
            <CheckCircle2 size={14} />
            สรุปความยินยอม
          </div>
          <div className="space-y-1 text-[11px] text-navy/70">
            <p>✓ {ok.data ? "อนุญาต" : "ยังไม่อนุญาต"} — การเก็บข้อมูลส่วนตัว</p>
            <p>✓ {ok.health ? "อนุญาต" : "ยังไม่อนุญาต"} — การใช้ข้อมูลสุขภาพ</p>
            <p>✓ {ok.marketing ? "อนุญาต" : "ไม่รับ"} — ข้อมูลการตลาด</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/channel"
            className="card-cream rounded-full px-6 py-3 text-sm md:text-base text-center font-medium hover:shadow-md transition-all"
          >
            ← ย้อนกลับ
          </Link>

          {canContinue ? (
            <Link
              to="/quest"
              className="btn-emerald rounded-full px-8 py-3 text-sm md:text-base inline-flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg transition-all flex-1"
            >
              เริ่มแบบประเมิน <ArrowRight size={16} />
            </Link>
          ) : (
            <button
              disabled
              className="rounded-full px-8 py-3 text-sm md:text-base bg-muted text-muted-foreground cursor-not-allowed font-medium flex-1"
            >
              เริ่มแบบประเมิน (ต้องยินยอมข้อมูลฯ)
            </button>
          )}
        </div>

        {/* Info note */}
        <p className="text-center text-[10px] md:text-xs text-muted-foreground mt-6">
          คุณสามารถเปลี่ยนแปลงความยินยอมได้ตลอดเวลาในหน้าโปรไฟล์
        </p>
      </div>
    </DashShell>
  );
}

function Item({
  icon: Icon,
  title,
  children,
  checked,
  onChange,
  required,
}: {
  icon: typeof Shield;
  title: string;
  children: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  required?: boolean;
}) {
  return (
    <label
      className={`flex gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl transition-all duration-200 cursor-pointer ${
        checked
          ? "bg-gradient-to-r from-emerald/5 to-transparent border-2 border-emerald shadow-md"
          : "bg-white/90 backdrop-blur-md border border-white/60 hover:bg-white/95 hover:shadow-sm"
      }`}
    >
      {/* Icon */}
      <div
        className={`size-10 md:size-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${
          checked ? "bg-emerald text-white shadow-md" : "bg-pale-mint text-emerald"
        }`}
      >
        <Icon size={18} className="md:size-5" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <div className="font-semibold text-navy text-sm md:text-base">{title}</div>
          {required && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/15 text-gold text-[9px] md:text-[10px] font-medium">
              จำเป็น
            </span>
          )}
        </div>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{children}</p>
      </div>

      {/* Checkbox */}
      <div className="shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="size-5 md:size-6 accent-emerald rounded-md cursor-pointer"
        />
      </div>
    </label>
  );
}
