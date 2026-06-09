import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Compass, HeartPulse, Leaf, MoonStar, X, Building2, Phone, MapPin, ExternalLink, Handshake, ShieldCheck, Menu, Map as MapIcon, Users } from "lucide-react";
import { Nav } from "@/components/Nav";
import { images, personas } from "@/lib/data";
import welcomeHost from "@/assets/welcome-host.png";
import logo from "@/assets/goodfill-logo.png";
import { useI18n, type TKey } from "@/lib/i18n";

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
  { num: "01", titleKey: "phase.01.title" as TKey, descKey: "phase.01.desc" as TKey, icon: Sparkles },
  { num: "02", titleKey: "phase.02.title" as TKey, descKey: "phase.02.desc" as TKey, icon: Compass },
  { num: "03", titleKey: "phase.03.title" as TKey, descKey: "phase.03.desc" as TKey, icon: Leaf },
  { num: "04", titleKey: "phase.04.title" as TKey, descKey: "phase.04.desc" as TKey, icon: HeartPulse },
  { num: "05", titleKey: "phase.05.title" as TKey, descKey: "phase.05.desc" as TKey, icon: MoonStar },
];

function Landing() {
  const [slide, setSlide] = useState(0);
  const [modal, setModal] = useState<null | "journey" | "personas" | "samui" | "company">(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  // Android back button → close popup instead of exiting app
  useEffect(() => {
    if (!modal && !moreOpen) return;
    window.history.pushState({ gfModal: true }, "");
    const onPop = () => {
      setModal(null);
      setMoreOpen(false);
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      if (window.history.state && (window.history.state as { gfModal?: boolean }).gfModal) {
        window.history.back();
      }
    };
  }, [modal, moreOpen]);

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setModal(null); setMoreOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const moreItems = [
    { key: "journey" as const, label: t("hero.btnJourney"), icon: Compass },
    { key: "personas" as const, label: t("hero.btnPersonas"), icon: Users },
    { key: "samui" as const, label: t("hero.btnSamui"), icon: MapIcon },
    { key: "company" as const, label: t("hero.btnCompany"), icon: Building2 },
  ];

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
              <div className="relative size-16 md:size-20 rounded-3xl bg-white grid place-items-center shadow-2xl ring-1 ring-white/60">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white to-mint/30" />
                <img src={logo} alt="Goodfill Care" className="relative h-10 md:h-12 w-auto object-contain" />
              </div>
              <div>
                <div className="font-display text-2xl md:text-3xl leading-none text-white drop-shadow-md">
                  Goodfill <span className="text-gold">Care</span>
                </div>
                <div className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-gold-soft/95 mt-1">
                  {t("hero.kicker")}
                </div>
              </div>
            </div>

            <h1 className="font-display text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02] mt-6 md:mt-8 text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.4)]">
              {t("hero.title1")}<br />
              <em className="not-italic text-gold">{t("hero.title2")}</em>{" "}
              <span className="block">{t("hero.title3")}</span>
            </h1>
            <p className="mt-4 md:mt-6 max-w-md text-sm md:text-base text-ivory/85 leading-relaxed">
              {t("hero.desc")}
            </p>

            {/* Primary CTA — dominant, the main funnel entry */}
            <div className="mt-6 md:mt-8 flex items-center gap-3">
              <Link
                to="/quest"
                className="btn-gold rounded-full px-8 py-5 md:px-10 md:py-6 inline-flex items-center gap-3 text-base md:text-lg font-semibold shadow-[0_18px_50px_-12px_rgba(201,168,76,0.55)] ring-1 ring-gold/30 hover:scale-[1.02] transition"
              >
                {t("hero.ctaStart")} <ArrowRight size={20} />
              </Link>
              <button
                onClick={() => setMoreOpen(true)}
                aria-label="More"
                className="size-14 rounded-full bg-white/10 backdrop-blur border border-white/25 hover:bg-white/20 transition text-white grid place-items-center shrink-0"
              >
                <Menu size={22} />
              </button>
            </div>
            <div className="mt-2 text-[11px] text-ivory/60 tracking-wide">
              ใช้เวลา ~8 นาที · กดเมนูเพื่อดูข้อมูลเพิ่ม
            </div>

            <div className="mt-3 max-w-md flex items-start gap-2 text-[11px] text-ivory/70 leading-snug">
              <ShieldCheck size={14} className="text-mint mt-0.5 shrink-0" />
              <span>{t("hero.note")}</span>
            </div>

            <div className="mt-6 md:mt-10 flex gap-5 md:gap-8 text-ivory">
              {[
                { v: "8", k: "hero.stat.min" as TKey },
                { v: "+300", k: "hero.stat.credits" as TKey },
                { v: "6", k: "hero.stat.personas" as TKey },
                { v: "12+", k: "hero.stat.partners" as TKey },
              ].map((s) => (
                <div key={s.k}>
                  <div className="font-display text-xl md:text-2xl text-gold">{s.v}</div>
                  <div className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-ivory/70 mt-0.5">{t(s.k)}</div>
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
              className="absolute top-16 left-2 bg-white rounded-3xl px-5 py-3 text-navy text-sm max-w-[240px] shadow-xl ring-1 ring-mint/40"
            >
              <div className="text-[10px] tracking-widest uppercase text-emerald">{t("hero.greeting1")}</div>
              <div className="mt-1">{t("hero.greeting2")}</div>
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
                className="absolute top-3 right-3 size-12 rounded-full bg-cream hover:bg-mint/50 grid place-items-center shadow-md ring-1 ring-mint/40 active:scale-95 transition"
                aria-label="ปิด"
              >
                <X size={22} />
              </button>

              {modal === "journey" && (
                <>
                  <div className="text-[11px] tracking-[0.3em] uppercase text-gold">{t("modal.journey.kicker")}</div>
                  <h2 className="font-display text-3xl md:text-4xl mt-2">{t("modal.journey.title")}</h2>
                  <div className="mt-6 grid sm:grid-cols-2 gap-3">
                    {phases.map((p) => (
                      <div key={p.num} className="card-soft p-5 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <div className="size-10 rounded-xl bg-pale-mint border border-mint/60 grid place-items-center text-emerald">
                            <p.icon size={18} />
                          </div>
                          <span className="font-display text-2xl text-mint">{p.num}</span>
                        </div>
                        <div className="font-display text-lg mt-3">{t(p.titleKey)}</div>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{t(p.descKey)}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {modal === "personas" && (
                <>
                  <div className="text-[11px] tracking-[0.3em] uppercase text-gold">{t("modal.personas.kicker")}</div>
                  <h2 className="font-display text-3xl md:text-4xl mt-2">{t("modal.personas.title")}</h2>
                  <p className="text-sm text-muted-foreground mt-2">{t("modal.personas.sub")}</p>
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
                    {t("modal.personas.cta")} <ArrowRight size={16} />
                  </Link>
                </>
              )}

              {modal === "samui" && (
                <>
                  <div className="text-[11px] tracking-[0.3em] uppercase text-gold">{t("modal.samui.kicker")}</div>
                  <h2 className="font-display text-3xl md:text-4xl mt-2">{t("modal.samui.title")}</h2>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { src: images.yoga, k: "samui.yoga" as TKey },
                      { src: images.spa, k: "samui.spa" as TKey },
                      { src: images.villa, k: "samui.villa" as TKey },
                      { src: images.food, k: "samui.food" as TKey },
                      { src: images.meditation, k: "samui.med" as TKey },
                      { src: images.heroSamui, k: "samui.sunrise" as TKey },
                    ].map((it) => (
                      <div key={it.k} className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                        <img src={it.src} alt={t(it.k)} className="size-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-3">
                          <div className="text-ivory text-xs tracking-wider">{t(it.k)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {modal === "company" && (
                <>
                  <div className="text-[11px] tracking-[0.3em] uppercase text-gold">{t("modal.company.kicker")}</div>
                  <h2 className="font-display text-3xl md:text-4xl mt-2">{t("modal.company.title")}</h2>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{t("modal.company.intro")}</p>
                  <div className="mt-5 grid sm:grid-cols-2 gap-2.5">
                    {(["modal.company.s1","modal.company.s2","modal.company.s3","modal.company.s4","modal.company.s5","modal.company.s6"] as TKey[]).map((k, i) => (
                      <div key={k} className="card-soft p-3.5 rounded-xl flex items-center gap-3">
                        <span className="size-8 rounded-lg bg-pale-mint border border-mint/60 grid place-items-center text-emerald font-display text-sm">0{i+1}</span>
                        <span className="text-sm">{t(k)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid sm:grid-cols-2 gap-3">
                    <div className="card-soft p-4 rounded-2xl">
                      <div className="text-[10px] tracking-[0.25em] uppercase text-emerald">{t("modal.company.contact")}</div>
                      <a href="tel:+66945958741" className="mt-2 flex items-center gap-2 text-sm hover:text-emerald"><Phone size={14}/> 094-595-8741</a>
                      <a href="mailto:admin@samui741.com" className="mt-1.5 flex items-center gap-2 text-sm hover:text-emerald"><ExternalLink size={14}/> admin@samui741.com</a>
                      <div className="mt-1.5 flex items-center gap-2 text-sm text-navy/70"><span className="text-emerald">LINE</span> @samui741</div>
                    </div>
                    <div className="card-soft p-4 rounded-2xl">
                      <div className="text-[10px] tracking-[0.25em] uppercase text-emerald">HQ</div>
                      <div className="mt-2 flex items-start gap-2 text-sm text-navy/80"><MapPin size={14} className="mt-0.5 shrink-0"/><span>{t("modal.company.addr")}</span></div>
                    </div>
                  </div>
                  <a href="https://samui-741.com/?lang=th" target="_blank" rel="noreferrer" className="btn-emerald rounded-full px-6 py-3 inline-flex items-center gap-2 text-sm mt-6">
                    {t("modal.company.visit")} <ArrowRight size={16} />
                  </a>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
