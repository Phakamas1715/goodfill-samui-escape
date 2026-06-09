import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User, ArrowRight, Sparkles, ShieldCheck, HeartPulse, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import liff from "@line/liff";

export const Route = createFileRoute("/login/customer")({
  ssr: false,
  component: CustomerLoginPage,
  head: () => ({
    meta: [
      { title: "ลูกค้าเข้าสู่ระบบ — Goodfill Care" },
      {
        name: "description",
        content: "สำหรับลูกค้า Goodfill Care เข้าสู่ระบบเพื่อทำแบบประเมิน wellness และเลือกโปรแกรมพักผ่อนที่เกาะสมุย",
      },
    ],
  }),
});

function CustomerLoginPage() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [liffReady, setLiffReady] = useState(false);
  const liffId = import.meta.env.VITE_LIFF_ID as string;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!liffId) {
          console.warn("VITE_LIFF_ID not configured");
          setIsChecking(false);
          return;
        }
        await liff.init({ liffId });
        if (cancelled) return;
        setLiffReady(true);

        // Check if already logged in
        if (liff.isLoggedIn()) {
          // Redirect to login flow
          navigate({ to: "/login", search: { channel: "customer" }, replace: true });
        }
      } catch (e) {
        console.error("LIFF init error:", e);
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [liffId, navigate]);

  const handleLogin = () => {
    if (!liffReady && liffId) {
      // Fallback: direct navigation
      navigate({ to: "/login", search: { channel: "customer" }, replace: true });
    } else {
      navigate({ to: "/login", search: { channel: "customer" }, replace: true });
    }
  };

  const benefits = [
    { icon: HeartPulse, title: "ค้นพบ Persona", desc: "แบบประเมิน 8 ข้อ รู้จักสุขภาพคุณ" },
    { icon: Star, title: "โปรแกรมส่วนตัว", desc: "3/5/7 วัน ออกแบบเฉพาะคุณ" },
    { icon: MapPin, title: "สถานที่ระดับโลก", desc: "เกาะสมุย แหล่ง wellness ชั้นนำ" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-emerald-400 to-teal-500">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center p-5 md:p-8">
        {/* Decorative blur */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gold/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl w-full">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl md:rounded-4xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 md:p-10 lg:p-12">
              {/* Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald/15 border border-emerald/30">
                  <User size={16} className="text-emerald" />
                  <span className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-emerald font-bold">
                    Customer Portal
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-center text-navy mb-4 leading-tight">
                เริ่มต้น <span className="text-emerald">Wellness Journey</span>
                <br />
                ของคุณวันนี้
              </h1>

              <p className="text-center text-base md:text-lg text-navy/70 max-w-md mx-auto mb-8 leading-relaxed">
                เข้าสู่ระบบเพื่อทำแบบประเมิน wellness รับ 300 Calm Credits และเลือกโปรแกรมพักผ่อนที่เหมาะกับคุณที่สุด
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                    className="bg-white rounded-xl p-4 text-center shadow-md border border-mint/30 hover:shadow-lg transition-all"
                  >
                    <div className="size-10 md:size-12 rounded-full bg-emerald/10 flex items-center justify-center mx-auto mb-3">
                      <benefit.icon size={20} className="text-emerald" />
                    </div>
                    <div className="font-semibold text-navy text-sm md:text-base">{benefit.title}</div>
                    <div className="text-[11px] md:text-xs text-muted-foreground mt-1">{benefit.desc}</div>
                  </motion.div>
                ))}
              </div>

              {/* Stats Row */}
              <div className="flex justify-center gap-6 md:gap-10 mb-8">
                <div className="text-center">
                  <div className="font-display text-2xl md:text-3xl text-gold font-bold">8</div>
                  <div className="text-[10px] md:text-[11px] text-navy/60 uppercase tracking-wide">แบบประเมิน</div>
                </div>
                <div className="w-px h-10 bg-mint/40 self-center" />
                <div className="text-center">
                  <div className="font-display text-2xl md:text-3xl text-gold font-bold">6</div>
                  <div className="text-[10px] md:text-[11px] text-navy/60 uppercase tracking-wide">
                    Wellness Persona
                  </div>
                </div>
                <div className="w-px h-10 bg-mint/40 self-center" />
                <div className="text-center">
                  <div className="font-display text-2xl md:text-3xl text-gold font-bold">300</div>
                  <div className="text-[10px] md:text-[11px] text-navy/60 uppercase tracking-wide">Calm Credits</div>
                </div>
              </div>

              {/* Login Button */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  disabled={isChecking}
                  className="btn-emerald rounded-full px-8 py-4 md:px-10 md:py-5 inline-flex items-center gap-2 text-base md:text-lg font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                >
                  <Sparkles size={20} />
                  {isChecking ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบด้วย LINE"}
                  <ArrowRight size={20} />
                </motion.button>
              </div>

              {/* Info Note */}
              <div className="mt-8 p-4 bg-emerald/5 rounded-xl border border-emerald/20">
                <div className="flex items-start gap-2 text-[11px] md:text-xs text-navy/60 text-center justify-center">
                  <ShieldCheck size={14} className="shrink-0 mt-0.5 text-emerald" />
                  <span>
                    ระบบใช้ LINE Official Account ในการยืนยันตัวตน <br className="hidden sm:inline" />
                    เข้าสู่ระบบครั้งเดียว ทำแบบประเมินและเลือกโปรแกรมได้ทันที
                  </span>
                </div>
              </div>

              {/* Back to main */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate({ to: "/" })}
                  className="text-xs md:text-sm text-navy/50 hover:text-navy transition"
                >
                  ← กลับหน้าหลัก
                </button>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="text-center mt-8 text-white/70 text-[10px] md:text-xs tracking-wide">
            © 2024 Goodfill Care — Wellness Journey on Koh Samui
          </div>
        </div>
      </div>
    </div>
  );
}
