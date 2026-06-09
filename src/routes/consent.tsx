import { createFileRoute, Link } from "@tanstack/react-router";
import { DashShell } from "@/components/DashShell";
import { Shield, Lock, Heart } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/consent")({
  head: () => ({ meta: [{ title: "Consent · ความยินยอม — Goodfill Care" }] }),
  component: ConsentPage,
});

function ConsentPage() {
  const [ok, setOk] = useState({ data: false, health: false, marketing: false });
  const canContinue = ok.data && ok.health;
  return (
    <DashShell bg="meditation" host="wai" kicker="Step 2 of 3" title="ความยินยอม · Consent" subtitle="เพื่อมอบประสบการณ์ wellness ที่เหมาะสมที่สุด">
      <div className="max-w-2xl mx-auto w-full">
        <div className="space-y-2">
          <Item icon={Shield} title="การเก็บข้อมูลส่วนตัว · Personal Data" required required2 checked={ok.data} onChange={(v) => setOk({ ...ok, data: v })}>
            อนุญาตให้ Goodfill Care เก็บข้อมูลพื้นฐาน เช่น ชื่อ อีเมล เบอร์โทร เพื่อใช้ในการให้บริการตาม PDPA
          </Item>
          <Item icon={Heart} title="ข้อมูลสุขภาพ · Health Data" required required2 checked={ok.health} onChange={(v) => setOk({ ...ok, health: v })}>
            อนุญาตให้ผู้เชี่ยวชาญใช้ข้อมูลสุขภาพของคุณในการออกแบบโปรแกรม wellness โดยข้อมูลจะถูกเข้ารหัสและจำกัดการเข้าถึง
          </Item>
          <Item icon={Lock} title="การตลาด · Marketing (ไม่บังคับ)" checked={ok.marketing} onChange={(v) => setOk({ ...ok, marketing: v })}>
            ยินยอมรับข้อเสนอพิเศษและจดหมายข่าวจาก Goodfill Care ยกเลิกได้ทุกเมื่อ
          </Item>
        </div>

        <div className="mt-4 flex gap-2">
          <Link to="/channel" className="card-cream rounded-full px-4 py-2.5 text-xs">ย้อนกลับ</Link>
          {canContinue ? (
            <Link to="/quest" className="rounded-full px-6 py-2.5 text-xs btn-emerald">เริ่มแบบประเมิน</Link>
          ) : (
            <button disabled className="rounded-full px-6 py-2.5 text-xs bg-muted text-muted-foreground cursor-not-allowed">เริ่มแบบประเมิน</button>
          )}
        </div>
      </div>
    </DashShell>
  );
}

function Item({
  icon: Icon, title, children, checked, onChange, required,
}: {
  icon: typeof Shield;
  title: string;
  children: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  required?: boolean;
  required2?: boolean;
}) {
  return (
    <label className={`bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl p-3 flex gap-3 cursor-pointer transition shadow-sm ${checked ? "ring-2 ring-emerald" : "hover:bg-white/95"}`}>
      <div className="size-9 rounded-xl bg-pale-mint grid place-items-center text-emerald shrink-0"><Icon size={16} /></div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <div className="font-medium text-navy text-sm">{title}</div>
          {required && <span className="pill bg-cream text-gold text-[9px]">จำเป็น</span>}
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{children}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-5 accent-emerald shrink-0 mt-1"
      />
    </label>
  );
}