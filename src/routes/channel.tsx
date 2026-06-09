import { createFileRoute, Link } from "@tanstack/react-router";
import { DashShell, DashCard } from "@/components/DashShell";
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
    <DashShell bg="beach" host="welcome" kicker="Step 1 of 3" title="เลือกช่องทาง" subtitle="Choose your preferred channel">
      <div className="grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto w-full">
          {channels.map((c) => (
            <Link key={c.name} to={c.to} className="bg-white/85 backdrop-blur-md rounded-2xl border border-white/60 shadow-md p-5 hover:-translate-y-1 hover:shadow-xl transition group block">
              <div className={`size-11 rounded-2xl grid place-items-center ${c.tone}`}><c.icon size={20} /></div>
              <div className="font-display text-xl mt-3 text-navy">{c.name}</div>
              <div className="text-xs text-emerald mt-0.5">{c.desc}</div>
              <div className="text-[10px] text-muted-foreground mt-2">{c.note}</div>
            </Link>
          ))}
      </div>
    </DashShell>
  );
}