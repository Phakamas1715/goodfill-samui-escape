import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Compass,
  HeartPulse,
  Leaf,
  MoonStar,
  X,
  Building2,
  Phone,
  MapPin,
  ExternalLink,
  Handshake,
  ShieldCheck,
  Menu,
  Map as MapIcon,
  Users,
} from "lucide-react";
import { Nav } from "@/components/Nav";
import { images, personas, pick } from "@/lib/data";
import welcomeHost from "@/assets/welcome-host.png";
import heroSamuiUrl from "@/assets/hero-samui.jpg";
import { useI18n, type TKey } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Goodfill Care — Koh Samui Wellness Journey" },
      {
        name: "description",
        content: "เริ่มจากแบบประเมิน 8 ข้อ ค้นพบโปรแกรมพักผ่อนแบบลักชัวรี่ที่เกาะสมุย เหมาะกับร่างกายและจิตใจของคุณ",
      },
      { property: "og:title", content: "Goodfill Care — Koh Samui Wellness" },
      {
        property: "og:description",
        content: "Pre-arrival Quest · Personalized Program · Final Report · Long-term Care",
      },
      { property: "og:image", content: "https://goodfillcare-samui.com/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:url", content: "https://goodfillcare-samui.com/" },
      { name: "twitter:image", content: "https://goodfillcare-samui.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#142C25" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "msapplication-TileColor", content: "#142C25" },
    ],
    links: [
      { rel: "canonical", href: "https://goodfillcare-samui.com/" },
      { rel: "preload", as: "image", href: heroSamuiUrl, fetchPriority: "high" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  component: Landing,
});

const slides = [
  images.heroSamui,
  images.samuiAerial,
  images.villa,
  images.samuiInfinity,
  images.yoga,
  images.samuiLongtail,
  images.spa,
  images.samuiSpaRitual,
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
  const { t, lang } = useI18n();

  useEffect(() => {
    const interval = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(interval);
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
      if (e.key === "Escape") {
        setModal(null);
        setMoreOpen(false);
      }
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
        <AnimatePresence mode="wait">
          <motion.img
            key={slide}
            src={slides[slide]}
            alt=""
            width={1920}
            height={1080}
            fetchPriority={slide === 0 ? "high" : "auto"}
            decoding="async"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 size-full object-cover will-change-transform"
          />
        </AnimatePresence>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/70 via-emerald-deep/40 to-emerald-deep/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-deep/70 via-emerald-deep/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(212,160,23,0.1),transparent_60%)]" />
      </div>

      {/* Slide indicator */}
      <div className="absolute top-24 md:top-28 right-5 md:right-8 z-30 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1 rounded-full transition-all ${i === slide ? "w-7 bg-gold/90" : "w-3 bg-ivory/40"}`}
          />
        ))}
      </div>

      <Nav />

      {/* MAIN CONTENT */}
      <main className="absolute inset-0 pt-24 md:pt-28 pb-24 md:pb-10 px-5 md:px-10 flex flex-col overflow-y-auto z-10">
        <div className="flex-1 grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-10 items-center max-w-7xl mx-auto w-full lg:px-[50px] lg:my-[50px] pb-[50px] lg:pr-[50px] mt-[50px]">
          {/* LEFT — Brand + Headline + Actions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative z-20 min-w-0 max-w-full sm:max-w-[85%] md:max-w-[75%] lg:max-w-none"
          >
            {/* Kicker */}
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-navy/55 backdrop-blur-md ring-1 ring-gold/30">
              <span className="h-px w-6 bg-gold" />
              <span className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-gold font-semibold">
                {t("hero.kicker")}
              </span>
            </div>

            {/* Editorial kicker rule */}
            <div className="hidden lg:inline-flex items-center gap-3 mt-6 px-3 py-1.5 rounded-full bg-navy/55 backdrop-blur-md ring-1 ring-gold/30">
              <span className="h-px w-8 bg-gold" />
              <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-semibold">Wellness Journey</span>
            </div>

            {/* H1 */}
            <h1 className="font-display font-normal text-[1.55rem] sm:text-[2.1rem] md:text-[2.6rem] lg:text-[3.2rem] leading-[1.08] tracking-tight mt-3 md:mt-5 text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] lg:max-w-[560px]">
              Experience <em className="italic text-gold font-normal">Koh Samui</em>
              <span className="block">designed just for you</span>
            </h1>
            <p className="mt-2 md:mt-3 max-w-md text-[12px] md:text-[14px] text-white/85 font-normal leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
              สัมผัสบรรยากาศเกาะสมุย ที่ออกแบบเพื่อคุณคนเดียว
            </p>
            <p className="mt-3 max-w-md text-[12px] md:text-[13px] uppercase tracking-[0.18em] text-gold-soft/90 font-semibold drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
              Luxury Personalized Wellness Companion
            </p>

            {/* Editorial proof points */}
            <div className="hidden md:flex flex-wrap gap-x-6 gap-y-2 mt-5">
              {["8 Wellness Quests", "6 Distinct Personas", "3 / 5 / 7 Day Programs"].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-mint shadow-[0_0_6px_rgba(120,200,170,0.5)]" />
                  <span className="text-white/70 text-[9px] tracking-[0.2em] uppercase font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Action cluster */}
            <div className="relative z-30 mt-5 md:mt-6 flex flex-col gap-2.5 w-full max-w-[20rem]">
              <Link
                to="/quest"
                className="btn-gold group relative overflow-hidden rounded-xl px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm md:text-[14px] font-bold tracking-wide shadow-[0_12px_32px_-12px_rgba(201,168,76,0.6)] ring-1 ring-gold/40 hover:scale-[1.02] transition"
              >
                <Sparkles size={14} className="opacity-80" />
                <span>{t("hero.ctaStart")}</span>
                <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
              </Link>
              <button
                onClick={() => setMoreOpen(true)}
                className="rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-lg border border-white/30 text-white/95 py-2 px-4 inline-flex items-center justify-center gap-2 text-[13px] font-semibold transition"
              >
                <Menu size={14} />
                <span>สำรวจเพิ่มเติม</span>
              </button>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-white/90 font-semibold px-1 mt-0.5">
                <span className="tracking-wide">~8 นาที · ไม่ต้องพิมพ์</span>
                <span className="h-3 w-px bg-white/30" />
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={11} className="text-mint" /> ปลอดภัย
                </span>
              </div>
            </div>

            <div className="mt-4 hidden md:flex items-center gap-5 text-white/85">
              {[
                { v: "8", k: "hero.stat.min" as TKey },
                { v: "6", k: "hero.stat.personas" as TKey },
                { v: "12+", k: "hero.stat.partners" as TKey },
              ].map((s, i) => (
                <div key={s.k} className="flex items-center gap-5">
                  {i > 0 && <span className="h-6 w-px bg-white/25" />}
                  <div>
                    <div className="font-display text-lg md:text-xl font-semibold text-gold">{s.v}</div>
                    <div className="text-[8px] md:text-[9px] tracking-[0.2em] uppercase text-white/75 font-medium mt-0.5">
                      {t(s.k)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Editorial pull-quote sidebar (desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.25 }}
            className="relative z-20 hidden lg:block border-l border-white/15 pl-10 self-center text-white/95"
          >
            <div className="space-y-8 max-w-sm">
              <div>
                <div className="text-gold/85 text-[10px] tracking-[0.35em] uppercase font-bold">Refined Care</div>
                <p className="mt-3 text-white/95 text-[13px] font-medium leading-relaxed">
                  Curated specifically for global travelers seeking deep restoration in the heart of Thailand —
                  ภายใต้การดูแลของผู้เชี่ยวชาญ Wellness และเชฟโภชนาการที่ออกแบบทุกขั้นตอนเฉพาะคุณ
                </p>
              </div>

              <div className="relative">
                <div
                  className="absolute -top-8 -left-4 text-6xl text-gold/20 select-none pointer-events-none"
                  aria-hidden
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  &ldquo;
                </div>
                <p className="relative font-display italic text-lg leading-snug text-white/95">
                  A sanctuary where every breath is intentional, and every moment is yours.
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="h-px w-6 bg-gold/60" />
                  <span className="text-[9px] tracking-[0.3em] uppercase text-white/75 font-medium">
                    Goodfill Promise
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-5 gap-y-3 pt-5 border-t border-white/20">
                <div>
                  <div className="font-display text-lg text-gold/90">6</div>
                  <div className="text-[9px] tracking-[0.25em] uppercase text-white/80 mt-0.5 font-medium">
                    Personas
                  </div>
                </div>
                <div>
                  <div className="font-display text-lg text-gold/90">3·5·7</div>
                  <div className="text-[9px] tracking-[0.25em] uppercase text-white/80 mt-0.5 font-medium">
                    Day Plans
                  </div>
                </div>
                <div>
                  <div className="font-display text-lg text-gold/90">+300</div>
                  <div className="text-[9px] tracking-[0.25em] uppercase text-white/80 mt-0.5 font-medium">
                    Calm Credits
                  </div>
                </div>
                <div>
                  <div className="font-display text-lg text-gold/90">12+</div>
                  <div className="text-[9px] tracking-[0.25em] uppercase text-white/80 mt-0.5 font-medium">
                    Partners
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* MOBILE HOST */}
      <motion.img
        initial={{ opacity: 0, x: 40, scale: 0.92 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.9 }}
        src={welcomeHost}
        alt="Goodfill Care wellness host"
        decoding="async"
        className="lg:hidden fixed -right-16 bottom-20 h-[34vh] max-h-[300px] w-auto object-contain object-bottom pointer-events-none drop-shadow-[0_24px_50px_rgba(0,0,0,0.55)] z-40"
      />

      {/* MODAL POPUPS */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md"
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
                className="absolute top-3 right-3 size-10 rounded-full bg-cream hover:bg-mint/40 grid place-items-center shadow-md ring-1 ring-mint/30 active:scale-95 transition"
                aria-label="ปิด"
              >
                <X size={20} />
              </button>

              {modal === "journey" && (
                <>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold/80">{t("modal.journey.kicker")}</div>
                  <h2 className="font-display text-3xl md:text-4xl mt-2">{t("modal.journey.title")}</h2>
                  <div className="mt-6 grid sm:grid-cols-2 gap-3">
                    {phases.map((p) => (
                      <div key={p.num} className="card-soft p-5 rounded-2xl bg-white/80">
                        <div className="flex items-center justify-between">
                          <div className="size-10 rounded-xl bg-pale-mint/70 border border-mint/40 grid place-items-center text-emerald/80">
                            <p.icon size={18} />
                          </div>
                          <span className="font-display text-2xl text-mint/70">{p.num}</span>
                        </div>
                        <div className="font-display text-lg mt-3">{t(p.titleKey)}</div>
                        <p className="text-xs text-muted-foreground/80 mt-1.5 leading-relaxed">{t(p.descKey)}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {modal === "personas" && (
                <>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold/80">
                    {t("modal.personas.kicker")}
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl mt-2">{t("modal.personas.title")}</h2>
                  <p className="text-sm text-muted-foreground/80 mt-2">{t("modal.personas.sub")}</p>
                  <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.values(personas).map((p) => (
                      <div
                        key={p.id}
                        className={`relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br ${p.color} ring-1 ring-white/30 shadow-md`}
                      >
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]" />
                        <div className="relative">
                          <div className="text-[9px] tracking-widest uppercase text-emerald/90 font-bold">{p.id}</div>
                          <div className="font-display text-lg mt-1 text-navy/90">{pick(p.name, lang)}</div>
                          <div className="text-xs text-emerald-deep/70 font-medium">{pick(p.thaiName, lang)}</div>
                          <div className="text-xs mt-2 text-navy/70 line-clamp-2">{pick(p.tagline, lang)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/quest"
                    onClick={() => setModal(null)}
                    className="btn-emerald rounded-full px-5 py-2.5 inline-flex items-center gap-2 text-sm mt-6"
                  >
                    {t("modal.personas.cta")} <ArrowRight size={15} />
                  </Link>
                </>
              )}

              {modal === "samui" && (
                <>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold/80">{t("modal.samui.kicker")}</div>
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
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 to-transparent p-3">
                          <div className="text-ivory text-xs tracking-wider">{t(it.k)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {modal === "company" && (
                <>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold/80">{t("modal.company.kicker")}</div>
                  <h2 className="font-display text-3xl md:text-4xl mt-2">{t("modal.company.title")}</h2>
                  <p className="text-sm text-muted-foreground/80 mt-3 leading-relaxed">{t("modal.company.intro")}</p>
                  <div className="mt-5 grid sm:grid-cols-2 gap-2.5">
                    {(
                      [
                        "modal.company.s1",
                        "modal.company.s2",
                        "modal.company.s3",
                        "modal.company.s4",
                        "modal.company.s5",
                        "modal.company.s6",
                      ] as TKey[]
                    ).map((k, i) => (
                      <div key={k} className="card-soft p-3.5 rounded-xl flex items-center gap-3 bg-white/70">
                        <span className="size-8 rounded-lg bg-pale-mint/60 border border-mint/40 grid place-items-center text-emerald/80 font-display text-sm">
                          0{i + 1}
                        </span>
                        <span className="text-sm text-navy/80">{t(k)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid sm:grid-cols-2 gap-3">
                    <div className="card-soft p-4 rounded-2xl bg-white/80">
                      <div className="text-[9px] tracking-[0.25em] uppercase text-emerald/80">
                        {t("modal.company.contact")}
                      </div>
                      <a href="tel:+66945958741" className="mt-2 flex items-center gap-2 text-sm hover:text-emerald/80">
                        <Phone size={13} /> 094-595-8741
                      </a>
                      <a
                        href="mailto:admin@samui741.com"
                        className="mt-1.5 flex items-center gap-2 text-sm hover:text-emerald/80"
                      >
                        <ExternalLink size={13} /> admin@samui741.com
                      </a>
                      <div className="mt-1.5 flex items-center gap-2 text-sm text-navy/70">
                        <span className="text-emerald/80">LINE</span> @samui741
                      </div>
                    </div>
                    <div className="card-soft p-4 rounded-2xl bg-white/80">
                      <div className="text-[9px] tracking-[0.25em] uppercase text-emerald/80">HQ</div>
                      <div className="mt-2 flex items-start gap-2 text-sm text-navy/70">
                        <MapPin size={13} className="mt-0.5 shrink-0" />
                        <span>{t("modal.company.addr")}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href="https://samui-741.com/?lang=th"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-emerald rounded-full px-5 py-2.5 inline-flex items-center gap-2 text-sm mt-6"
                  >
                    {t("modal.company.visit")} <ArrowRight size={15} />
                  </a>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MORE MENU */}
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-4 bg-navy/60 backdrop-blur-md"
            onClick={() => setMoreOpen(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ivory text-navy rounded-[1.75rem] w-full max-w-md p-5 relative shadow-2xl"
            >
              <button
                onClick={() => setMoreOpen(false)}
                className="absolute top-3 right-3 size-10 rounded-full bg-cream hover:bg-mint/40 grid place-items-center shadow-md ring-1 ring-mint/30 active:scale-95 transition"
                aria-label="ปิด"
              >
                <X size={20} />
              </button>
              <div className="text-[9px] tracking-[0.3em] uppercase text-gold/80">Goodfill Care</div>
              <h3 className="font-display text-2xl mt-1">เมนูเพิ่มเติม</h3>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {moreItems.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => {
                      setMoreOpen(false);
                      setModal(m.key);
                    }}
                    className="card-soft rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-pale-mint/40 active:scale-[0.99] transition bg-white/70"
                  >
                    <span className="size-10 rounded-xl bg-pale-mint/60 border border-mint/30 grid place-items-center text-emerald/80">
                      <m.icon size={17} />
                    </span>
                    <span className="font-medium">{m.label}</span>
                    <ArrowRight size={15} className="ml-auto text-emerald/70" />
                  </button>
                ))}
                <Link
                  to="/partners"
                  onClick={() => setMoreOpen(false)}
                  className="card-soft rounded-2xl p-4 flex items-center gap-3 hover:bg-pale-mint/40 active:scale-[0.99] transition bg-white/70"
                >
                  <span className="size-10 rounded-xl bg-pale-mint/60 border border-mint/30 grid place-items-center text-emerald/80">
                    <Handshake size={17} />
                  </span>
                  <span className="font-medium">{t("hero.btnPartners")}</span>
                  <ArrowRight size={15} className="ml-auto text-emerald/70" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
