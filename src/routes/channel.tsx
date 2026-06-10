import { createFileRoute, Link } from "@tanstack/react-router";
import { DashShell, DashCard } from "@/components/DashShell";
import { MessageCircle, Send, User, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/channel")({
  head: () => ({
    meta: [
      { title: "เลือกช่องทาง · Channel — Goodfill Care" },
      {
        name: "description",
        content: "เลือกช่องทางการติดต่อที่สะดวกสำหรับคุณ — LINE, Telegram หรือใช้งานแบบ Guest",
      },
    ],
  }),
  component: ChannelPage,
});

const channels = [
  {
    icon: MessageCircle,
    name: "LINE",
    desc: "เชื่อมต่อกับ LINE Official",
    note: "แนะนำสำหรับลูกค้าไทย",
    to: "/consent",
    tone: "bg-gradient-to-br from-emerald to-emerald-deep",
    textTone: "text-emerald",
    badge: "ยอดนิยมในไทย",
    features: ["แชท 24/7", "แจ้งเตือนโปรแกรม", "ยืนยันบริการ"],
  },
  {
    icon: Send,
    name: "Telegram",
    desc: "Connect via Telegram bot",
    note: "Best for international",
    to: "/consent",
    tone: "bg-gradient-to-br from-sky-500 to-blue-600",
    textTone: "text-sky-600",
    badge: "Fast & Global",
    features: ["Instant notifications", "Multi-language", "Quick replies"],
  },
  {
    icon: User,
    name: "Guest",
    desc: "ใช้งานแบบไม่ลงทะเบียน",
    note: "ข้อมูลจะถูกบันทึกในเครื่องนี้เท่านั้น",
    to: "/consent",
    tone: "bg-gradient-to-br from-gold to-gold-deep",
    textTone: "text-gold",
    badge: "ไม่ต้องลงทะเบียน",
    features: ["เริ่มได้ทันที", "ไม่ต้อง login", "ข้อมูลบนอุปกรณ์นี้"],
  },
];

function ChannelPage() {
  return (
    <DashShell
      bg="beach"
      kicker="Step 1 of 3"
      title="เลือกช่องทาง"
      subtitle="Choose your preferred channel for wellness journey updates"
    >
      <div className="max-w-5xl mx-auto w-full px-4 md:px-0">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-1 w-12 rounded-full bg-gold" />
          <div className="h-1 w-12 rounded-full bg-mint/30" />
          <div className="h-1 w-12 rounded-full bg-mint/30" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {channels.map((c, idx) => (
            <Link
              key={c.name}
              to={c.to}
              className="group block bg-white/95 backdrop-blur-md rounded-2xl border border-white/60 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Card Header with gradient */}
              <div className={`${c.tone} p-4 flex items-center justify-between`}>
                <div className="size-12 md:size-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <c.icon size={24} className="text-white" />
                </div>
                {c.badge && (
                  <span className="text-[10px] font-bold text-white bg-white/20 px-2 py-1 rounded-full">
                    {c.badge}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 md:p-6">
                <div className="flex items-baseline justify-between mb-1">
                  <div className="font-display text-2xl md:text-3xl text-navy">{c.name}</div>
                  <ArrowRight
                    size={18}
                    className="text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all"
                  />
                </div>
                <div className={`text-xs md:text-sm font-medium ${c.textTone} mt-0.5`}>
                  {c.desc}
                </div>

                {/* Features list */}
                <ul className="mt-4 space-y-1.5">
                  {c.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-[11px] md:text-xs text-navy/70"
                    >
                      <CheckCircle2 size={12} className="text-emerald shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Note divider */}
                <div className="mt-4 pt-3 border-t border-mint/30">
                  <p className="text-[10px] md:text-[11px] text-muted-foreground italic">
                    💡 {c.note}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info note */}
        <div className="mt-8 text-center p-4 bg-pale-mint/30 rounded-xl border border-mint/40">
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-navy/70">
            <Sparkles size={14} className="text-gold" />
            <span>
              ทุกช่องทางได้รับประสบการณ์ wellness เดียวกัน — เลือกช่องทางที่สะดวกที่สุดสำหรับคุณ
            </span>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-[10px] md:text-xs text-muted-foreground mt-6">
          สามารถเปลี่ยนช่องทางได้ภายหลังในหน้าโปรไฟล์
        </p>
      </div>
    </DashShell>
  );
}
