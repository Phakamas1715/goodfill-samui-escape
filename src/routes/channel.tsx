import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Section, Eyebrow } from "@/components/Shell";
import { MessageCircle, Send, User } from "lucide-react";

export const Route = createFileRoute("/channel")({
  head: () => ({ meta: [{ title: "เลือกช่องทาง · Channel — Goodfill Care" }] }),
  component: ChannelPage,
});

const channels = [
  { icon: MessageCircle, name: "LINE", desc: "เชื่อมต่อกับ LINE Official", note: "แนะนำสำหรับลูกค้าไทย", to: "/consent", tone: "bg-emerald text-ivory" },
  { icon: Send, name: "Telegram", desc: "Connect via Telegram bot", note: "Best for international", to: "/consent", tone: "bg-deep-teal text-ivory" },
  { icon: User, name: "Guest", desc: "ใช้งานแบบไม่ลงทะเบียน", note: "ข้อมูลจะถูกบันทึกในเครื่องนี้", to: "/consent", tone: "bg-cream text-emerald-deep" },
];

function ChannelPage() {
  return (
    <Shell>
      <Section className="max-w-3xl">
        <Eyebrow>Step 1 of 3</Eyebrow>
        <h1 className="font-display text-4xl mt-3">เลือกช่องทางที่สะดวก</h1>
        <p className="text-muted-foreground text-sm mt-2">Choose your preferred channel · เราจะส่งสรุปและการแจ้งเตือนผ่านช่องทางนี้</p>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {channels.map((c) => (
            <Link key={c.name} to={c.to} className="card-soft p-6 hover:-translate-y-1 transition group block">
              <div className={`size-12 rounded-2xl grid place-items-center ${c.tone}`}><c.icon size={22} /></div>
              <div className="font-display text-2xl mt-4 text-navy">{c.name}</div>
              <div className="text-sm text-emerald mt-1">{c.desc}</div>
              <div className="text-xs text-muted-foreground mt-3">{c.note}</div>
            </Link>
          ))}
        </div>
      </Section>
    </Shell>
  );
}