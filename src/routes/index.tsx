import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Compass, HeartPulse, Leaf, MoonStar, X } from "lucide-react";
import { Nav } from "@/components/Nav";
import { images, personas } from "@/lib/data";
import welcomeHost from "@/assets/welcome-host.png";
import logo from "@/assets/goodfill-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Goodfill Care — Koh Samui Wellness Journey" },
      { name: "description", content: "เริ่มจากแบบประเมิน 8 ข้อ ค้นพบโปรแกรมพักผ่อนแบบลักชัวรี่ที่เกาะสมุย เหมาะกับร่างกายและจิตใจของคุณ" },
      { property: "og:title", content: "Goodfill Care — Koh Samui Wellness" },
      { property: "og:description", content: "Pre-arrival Quest · Personalized Program · Final Report · Long-term Care" },
      { property: "og:image", content: "/icon-512.png" },
    ],
  }),
  component: Landing,
});

const slides = [
  images.heroSamui,
  images.villa,
  images.yoga,
  images.spa,
  images.meditation,
  images.food,
];

const phases = [
  { num: "01", title: "Pre-arrival Wellness Quest", desc: "ตอบ 8 ข้อ ค้นพบ Wellness Persona ของคุณ พร้อมรับ 300 Calm Credits", icon: Sparkles },
  { num: "02", title: "Personalized Program", desc: "AI จับคู่แพ็คเกจที่เหมาะกับร่างกาย ไลฟ์สไตล์ และเป้าหมายของคุณ", icon: Compass },
  { num: "03", title: "Partner Service Experience", desc: "เครือข่ายรีสอร์ท สปา และผู้เชี่ยวชาญที่ผ่านการคัดสรรบนเกาะสมุย", icon: Leaf },
  { num: "04", title: "Final Wellness Report", desc: "สรุปผล Before/After พร้อมแผน 90 วันต่อจากนี้", icon: HeartPulse },
  { num: "05", title: "Long-term Goodfill Care", desc: "ติดตาม habit · สะสม Calm Credits · กลับมาทุกฤดูที่คุณต้องการ", icon: MoonStar },
];

function Landing() {
  const [slide, setSlide] = useState(0);
  const [modal, setModal] = useState<null | "journey" | "personas" | "samui">(null);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-navy text-ivory">
      {/* SLIDESHOW BACKGROUND */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.img
            key={slide}
            src={slides[slide]}
            alt=""
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute inset-0 size-full object-cover"
          />
        </AnimatePresence>
        {/* readability overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/30 to-transparent" />
      </div>

      {/* Slide indicator */}
      <div className="absolute top-24 md:top-28 right-5 md:right-8 z-30 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1 rounded-full transition-all ${i === slide ? "w-7 bg-gold" : "w-3 bg-ivory/40"}`}
          />
        ))}
      </div>

      <Nav />

      {/* MAIN CONTENT */}
      <main className="absolute inset-0 pt-24 md:pt-28 pb-24 md:pb-10 px-5 md:px-10 flex flex-col">
        <div className="flex-1 grid lg:grid-cols-[1.1fr,0.9fr] gap-4 items-center max-w-7xl mx-auto w-full">
          {/* LEFT — Brand + Headline + Actions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3">
              <div className="size-16 md:size-20 rounded-3xl bg-ivory/95 backdrop-blur grid place-items-center shadow-2xl">
                <img src={logo} alt="Goodfill Care" className="h-10 md:h-12 w-auto" />
              </div>
              <div>
                <div className="font-display text-2xl md:text-3xl leading-none">Goodfill <span className="text-gold">Care</span></div>
                <div className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-gold-soft/90 mt-1">Koh Samui · Wellness Journey</div>
              </div>
            </div>

            <h1 className="font-display text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02] mt-6 md:mt-8">
              สัมผัสบรรยากาศ<br />
              <em className="not-italic text-gold">เกาะสมุย</em> ที่ออกแบบ<br />
              เพื่อคุณคนเดียว
            </h1>
            <p className="mt-4 md:mt-6 max-w-md text-sm md:text-base text-ivory/80 leading-relaxed">
              แบบประเมิน 8 ข้อ · 6 Wellness Personas · จับคู่โปรแกรมพักผ่อนระดับลักชัวรี่
              กับพาร์ทเนอร์รีสอร์ทและสปาบนเกาะสมุย
            </p>

            <div className="mt-6 md:mt-8 flex flex-wrap gap-2.5">
              <Link to="/quest" className="btn-gold rounded-full px-6 py-3 inline-flex items-center gap-2 text-sm shadow-xl">
                เริ่มแบบประเมิน · 8 นาที <ArrowRight size={16} />
              </Link>
              <button onClick={() => setModal("journey")} className="rounded-full px-5 py-3 text-sm bg-ivory/10 backdrop-blur border border-ivory/25 hover:bg-ivory/20 transition">
                การเดินทาง 5 ขั้น
              </button>
              <button onClick={() => setModal("personas")} className="rounded-full px-5 py-3 text-sm bg-ivory/10 backdrop-blur border border-ivory/25 hover:bg-ivory/20 transition">
                6 Personas
              </button>
              <button onClick={() => setModal("samui")} className="rounded-full px-5 py-3 text-sm bg-ivory/10 backdrop-blur border border-ivory/25 hover:bg-ivory/20 transition">
                บรรยากาศสมุย
              </button>
            </div>

            <div className="mt-6 md:mt-10 flex gap-5 md:gap-8 text-ivory">
              {[
                { v: "8", l: "Min Quest" },
                { v: "+300", l: "Calm Credits" },
                { v: "6", l: "Personas" },
                { v: "12+", l: "Partners" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-xl md:text-2xl text-gold">{s.v}</div>
                  <div className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-ivory/60 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Host character */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.25 }}
            className="relative hidden lg:flex items-end justify-center h-full"
          >
            <div className="absolute bottom-10 size-[420px] rounded-full bg-gradient-radial from-gold/30 via-mint/15 to-transparent blur-2xl" />
            <img
              src={welcomeHost}
              alt="Wellness host"
              className="relative max-h-[78vh] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
            />
            {/* Floating greeting bubble */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-16 left-2 glass rounded-3xl px-5 py-3 text-navy text-sm max-w-[240px] shadow-xl"
            >
              <div className="text-[10px] tracking-widest uppercase text-emerald">สวัสดีค่ะ</div>
              <div className="mt-1">พร้อมพาคุณค้นพบโปรแกรมที่ใช่<br />บนเกาะสมุยแล้วค่ะ ✨</div>
            </motion.div>
          </motion.div>

          {/* Mobile host - small floating */}
          <motion.img
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            src={welcomeHost}
            alt=""
            className="lg:hidden absolute right-0 bottom-24 h-[42vh] w-auto object-contain pointer-events-none drop-shadow-2xl opacity-95"
          />
        </div>
      </main>

      {/* MODAL POPUPS */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 22 }}
              className="bg-ivory text-navy rounded-[2rem] w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 md:p-10 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 size-9 rounded-full bg-cream hover:bg-mint/40 grid place-items-center"
                aria-label="ปิด"
              >
                <X size={18} />
              </button>

              {modal === "journey" && (
                <>
                  <div className="text-[11px] tracking-[0.3em] uppercase text-gold">Goodfill Journey</div>
                  <h2 className="font-display text-3xl md:text-4xl mt-2">การเดินทาง 5 ขั้นตอน</h2>
                  <div className="mt-6 grid sm:grid-cols-2 gap-3">
                    {phases.map((p) => (
                      <div key={p.num} className="card-soft p-5 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <div className="size-10 rounded-xl bg-pale-mint border border-mint/60 grid place-items-center text-emerald">
                            <p.icon size={18} />
                          </div>
                          <span className="font-display text-2xl text-mint">{p.num}</span>
                        </div>
                        <div className="font-display text-lg mt-3">{p.title}</div>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {modal === "personas" && (
                <>
                  <div className="text-[11px] tracking-[0.3em] uppercase text-gold">Wellness Personas</div>
                  <h2 className="font-display text-3xl md:text-4xl mt-2">คุณอยู่ในกลุ่มไหน?</h2>
                  <p className="text-sm text-muted-foreground mt-2">แบบประเมินจะค้นพบบุคลิกด้าน wellness และจับคู่โปรแกรมที่ใช่</p>
                  <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.values(personas).map((p) => (
                      <div key={p.id} className="card-soft p-4 rounded-2xl">
                        <div className="text-[10px] tracking-widest uppercase text-emerald">{p.id}</div>
                        <div className="font-display text-lg mt-1">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.thaiName}</div>
                        <div className="text-xs mt-2 text-navy/70 line-clamp-2">{p.tagline}</div>
                      </div>
                    ))}
                  </div>
                  <Link to="/quest" onClick={() => setModal(null)} className="btn-emerald rounded-full px-6 py-3 inline-flex items-center gap-2 text-sm mt-6">
                    เริ่มค้นหา Persona <ArrowRight size={16} />
                  </Link>
                </>
              )}

              {modal === "samui" && (
                <>
                  <div className="text-[11px] tracking-[0.3em] uppercase text-gold">Koh Samui</div>
                  <h2 className="font-display text-3xl md:text-4xl mt-2">บรรยากาศที่ทำให้ทุกอย่างช้าลง</h2>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { src: images.yoga, label: "Sunrise Yoga" },
                      { src: images.spa, label: "Signature Spa" },
                      { src: images.villa, label: "Private Villa" },
                      { src: images.food, label: "Wellness Cuisine" },
                      { src: images.meditation, label: "Meditation" },
                      { src: images.heroSamui, label: "Samui Sunrise" },
                    ].map((it) => (
                      <div key={it.label} className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                        <img src={it.src} alt={it.label} className="size-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-3">
                          <div className="text-ivory text-xs tracking-wider">{it.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
