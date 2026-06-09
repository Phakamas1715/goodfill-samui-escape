import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Section, Eyebrow } from "@/components/Shell";
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
    <Shell>
      <Section className="max-w-2xl">
        <Eyebrow>Step 2 of 3</Eyebrow>
        <h1 className="font-display text-4xl mt-3">ความยินยอม · Consent</h1>
        <p className="text-muted-foreground text-sm mt-2">เพื่อมอบประสบการณ์ wellness ที่เหมาะสมที่สุดสำหรับคุณ</p>

        <div className="space-y-4 mt-8">
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

        <div className="mt-8 flex gap-3">
          <Link to="/channel" className="card-cream rounded-full px-5 py-3 text-sm">ย้อนกลับ</Link>
          {canContinue ? (
            <Link to="/quest" className="rounded-full px-7 py-3 text-sm btn-emerald">เริ่มแบบประเมิน</Link>
          ) : (
            <button disabled className="rounded-full px-7 py-3 text-sm bg-muted text-muted-foreground cursor-not-allowed">เริ่มแบบประเมิน</button>
          )}
        </div>
      </Section>
    </Shell>
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
    <label className={`card-soft p-5 flex gap-4 cursor-pointer transition ${checked ? "ring-2 ring-emerald" : ""}`}>
      <div className="size-10 rounded-xl bg-pale-mint grid place-items-center text-emerald shrink-0"><Icon size={18} /></div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="font-medium text-navy">{title}</div>
          {required && <span className="pill bg-cream text-gold text-[10px]">จำเป็น</span>}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{children}</p>
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