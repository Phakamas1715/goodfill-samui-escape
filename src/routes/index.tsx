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
        content:
          "เริ่มจากแบบประเมิน 8 ข้อ ค้นพบโปรแกรมพักผ่อนแบบลักชัวรี่ที่เกาะสมุย เหมาะกับร่างกายและจิตใจของคุณ",
      },
      { property: "og:title", content: "Goodfill Care — Koh Samui Wellness" },
      {
        property: "og:description",
        content: "Pre-arrival Quest · Personalized Program · Final Report · Long-term Care",
      },
      { property: "og:image", content: "https://goodfillcare-samui.com/icon-512.png" },
      { property: "og:url", content: "https://goodfillcare-samui.com/" },
      { name: "twitter:image", content: "https://goodfillcare-samui.com/icon-512.png" },
    ],
    links: [
      { rel: "canonical", href: "https://goodfillcare-samui.com/" },
      { rel: "preload", as: "image", href: heroSamuiUrl, fetchPriority: "high" },
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
  {
    num: "01",
    titleKey: "phase.01.title" as TKey,
    descKey: "phase.01.desc" as TKey,
    icon: Sparkles,
  },
  {
    num: "02",
    titleKey: "phase.02.title" as TKey,
    descKey: "phase.02.desc" as TKey,
    icon: Compass,
  },
  { num: "03", titleKey: "phase.03.title" as TKey, descKey: "phase.03.desc" as TKey, icon: Leaf },
  {
    num: "04",
    titleKey: "phase.04.title" as TKey,
    descKey: "phase.04.desc" as TKey,
    icon: HeartPulse,
  },
  {
    num: "05",
    titleKey: "phase.05.title" as TKey,
    descKey: "phase.05.desc" as TKey,
    icon: MoonStar,
  },
];

function Landing() {
  const [slide, setSlide] = useState(0);
  const [modal, setModal] = useState<null | "journey" | "personas" | "samui" | "company">(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const { t, lang } = useI18n();

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

  const heroModules = [
    { title: "Wellness Quest", subtitle: "แบบประเมิน 8 คำถาม", icon: Sparkles },
    { title: "QR Wellness Pass", subtitle: "เช็กอินและสิทธิพิเศษ", icon: Compass },
    { title: "Continuous Care", subtitle: "ติดตามหลังทริป", icon: HeartPulse },
    { title: "Expert Review", subtitle: "แผนที่ผ่านการคัดกรอง", icon: Leaf },
  ];

  const heroHighlights = [
    "English-first headlines with Thai support",
    "Ocean teal surfaces and softened sand-gold accent",
    "Customer journey from quest to ongoing care",
  ];

  const heroStats = [
    { value: "8", label: "Quest prompts" },
    { value: "6", label: "Wellness personas" },
    { value: "12+", label: "Trusted partners" },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden bg-navy text-ivory">
      {/* SLIDESHOW BACKGROUND */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={slide}
            src={slides[slide]}
            alt=""
            width={1920}
            height={1080}
            fetchPriority={slide === 0 ? "high" : "auto"}
            decoding="async"
            initial={{ opacity: 0, x: "8%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "-8%" }}
            transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 size-full object-cover will-change-transform"
          />
        </AnimatePresence>
        {/* Gradient เบา ๆ ให้ภาพเด่น ไม่มืดทึบ */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/65 via-emerald-deep/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-deep/55 via-emerald-deep/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(212,160,23,0.08),transparent_60%)]" />
      </div>

      {/* Slide indicator — desktop only เพื่อไม่ทับ kicker บนมือถือ */}
      <div className="hidden md:flex absolute top-28 right-8 z-30 gap-1.5">
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
      <main className="absolute inset-0 pt-32 md:pt-36 pb-24 md:pb-10 px-4 md:px-8 flex flex-col overflow-hidden lg:overflow-y-auto z-[60]">
        <div className="flex-1 grid lg:grid-cols-[minmax(0,0.88fr)_minmax(320px,0.78fr)_minmax(0,0.84fr)] gap-8 xl:gap-10 items-center max-w-7xl mx-auto w-full lg:px-6 lg:my-10 lg:pb-10">
          {/* LEFT — Brand + Headline + Actions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative z-10 min-w-0 max-w-none order-1"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold/70" />
              <span className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-gold-soft font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                {t("hero.kicker")}
              </span>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
              <span className="size-2 rounded-full bg-mint shadow-[0_0_10px_rgba(143,179,155,0.7)]" />
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-white/82 font-semibold">
                Premium wellness interface system
              </span>
            </div>

            <h1 className="font-display font-normal text-[1.8rem] sm:text-[2.35rem] md:text-[2.9rem] lg:text-[3.45rem] leading-[1.02] tracking-tight mt-5 text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] max-w-[11ch]">
              Samui wellness
              <br />
              <em className="italic text-gold font-normal">designed as</em>
              <span className="block">a premium journey</span>
            </h1>
            <p
              lang="th"
              className="mt-3 max-w-md text-[13px] md:text-[14px] text-white/84 font-normal leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]"
            >
              ประสบการณ์ดูแลสุขภาพที่อ่านง่าย สงบ หรู และพาผู้ใช้ไหลจากการประเมินสู่การดูแลต่อเนื่องอย่างเป็นธรรมชาติ
            </p>
            <p className="mt-3 max-w-md text-[11px] md:text-[12px] uppercase tracking-[0.22em] text-gold-soft/90 font-semibold drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
              Ocean teal · sand gold · clearer call to action
            </p>

            <div className="mt-5 space-y-2.5 max-w-md">
              {heroHighlights.map((item) => (
                <div key={item} className="flex items-start gap-3 text-white/82">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-soft" />
                  <span className="text-[12px] md:text-[13px] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
              <Link
                to="/quest"
                className="btn-gold group relative overflow-hidden rounded-xl px-5 py-3 inline-flex items-center justify-center gap-2 text-sm md:text-[14px] font-bold tracking-wide whitespace-nowrap shadow-[0_12px_32px_-12px_rgba(201,168,76,0.6)] ring-1 ring-gold/40 hover:scale-[1.02] transition"
              >
                <Sparkles size={15} className="opacity-80" />
                <span>{t("hero.ctaStart")}</span>
                <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
              </Link>
              <button
                onClick={() => setMoreOpen(true)}
                className="rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-lg border border-white/30 text-white/95 px-5 py-3 inline-flex items-center justify-center gap-2 text-[13px] font-semibold transition"
              >
                <Menu size={15} />
                <span>Preview modules</span>
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-[10px] text-white/85 font-semibold max-w-[22rem]">
              <span className="tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
                ~8 นาที · tap-first flow · mobile readable
              </span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <ShieldCheck size={11} className="text-mint" /> Trusted
              </span>
            </div>

            <div className="mt-5 hidden md:flex items-center gap-5 text-white/85">
              {heroStats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-5">
                  {i > 0 && <span className="h-6 w-px bg-white/25" />}
                  <div>
                    <div className="font-display text-lg md:text-xl font-semibold text-gold drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
                      {s.value}
                    </div>
                    <div className="text-[8px] md:text-[9px] tracking-[0.2em] uppercase text-white/75 font-medium mt-0.5">
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CENTER — Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.25 }}
            className="relative z-20 order-2 flex justify-center"
          >
            <div className="relative mx-auto w-full max-w-[290px] sm:max-w-[330px]">
              <div className="absolute inset-x-10 -top-4 h-16 rounded-full bg-gold/30 blur-3xl" />
              <div className="absolute inset-x-8 bottom-2 h-24 rounded-full bg-mint/25 blur-3xl" />
              <div className="relative rounded-[2.7rem] border border-white/25 bg-[#0e1417]/85 p-2 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                <div className="overflow-hidden rounded-[2.15rem] bg-ivory shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  <div className="relative h-[640px] sm:h-[680px] bg-ivory">
                    <div className="absolute left-1/2 top-3 z-30 h-7 w-32 -translate-x-1/2 rounded-full bg-black/90" />
                    <div className="absolute inset-x-0 top-0 h-[46%] overflow-hidden">
                      <img
                        src={images.heroSamui}
                        alt="Koh Samui premium wellness preview"
                        className="size-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-emerald-deep/90" />
                    </div>

                    <div className="relative z-20 px-5 pt-10">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-display text-[1.45rem] leading-none text-navy">
                            Goodfill <span className="text-emerald">Care</span>
                          </div>
                          <div className="mt-1 text-[9px] uppercase tracking-[0.32em] text-gold">
                            Koh Samui · Wellness Journey
                          </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-mint/30 bg-white/75 p-1 shadow-sm backdrop-blur-md">
                          <span className="rounded-full bg-emerald px-2.5 py-1 text-[10px] font-semibold text-ivory">
                            TH
                          </span>
                          <span className="px-2 text-[10px] font-semibold text-navy/60">EN</span>
                        </div>
                      </div>

                      <div className="mt-28 max-w-[66%]">
                        <div className="text-[10px] uppercase tracking-[0.28em] text-gold-soft">
                          Customer wellness app
                        </div>
                        <h2 className="mt-3 font-display text-[2rem] leading-[0.96] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                          Start your
                          <span className="block text-gold-soft">wellness story</span>
                        </h2>
                        <p lang="th" className="mt-3 text-[12px] leading-relaxed text-white/86">
                          ค้นหาแผนดูแลที่เหมาะกับคุณ พร้อมการเดินทางที่เรียบง่ายและอ่านสบายตา
                        </p>
                        <Link
                          to="/quest"
                          className="mt-4 inline-flex items-center gap-2 rounded-[1.1rem] bg-white/18 px-4 py-3 text-[12px] font-semibold text-white backdrop-blur-md ring-1 ring-white/30"
                        >
                          <Sparkles size={14} className="text-gold-soft" />
                          Begin Wellness Quest
                          <ArrowRight size={14} />
                        </Link>
                      </div>

                      <img
                        src={welcomeHost}
                        alt="Goodfill Care assistant"
                        className="pointer-events-none absolute right-3 top-36 h-[230px] w-auto object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.28)]"
                      />

                      <div className="absolute inset-x-0 bottom-0 rounded-t-[1.8rem] bg-[linear-gradient(180deg,rgba(250,247,242,0.96),rgba(240,237,233,1))] px-4 pb-5 pt-4 shadow-[0_-18px_40px_-20px_rgba(20,44,37,0.25)]">
                        <div className="grid grid-cols-2 gap-3">
                          {heroModules.map((module) => (
                            <div
                              key={module.title}
                              className="rounded-[1.15rem] border border-mint/20 bg-white/88 p-3 shadow-[0_14px_24px_-18px_rgba(20,44,37,0.22)]"
                            >
                              <div className="flex size-9 items-center justify-center rounded-full bg-pale-mint text-emerald">
                                <module.icon size={17} />
                              </div>
                              <div className="mt-2 text-[12px] font-semibold leading-tight text-navy">
                                {module.title}
                              </div>
                              <div lang="th" className="mt-1 text-[10px] leading-relaxed text-navy/60">
                                {module.subtitle}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 rounded-[1.15rem] border border-mint/20 bg-[linear-gradient(135deg,rgba(31,92,73,0.92),rgba(143,179,155,0.9))] p-3 text-white shadow-[0_18px_32px_-18px_rgba(15,74,56,0.45)]">
                          <div className="text-[9px] uppercase tracking-[0.24em] text-gold-soft/90">
                            Curated for you
                          </div>
                          <div className="mt-1 text-[14px] font-semibold">QR Wellness Pass · Check-ins · Ongoing Care</div>
                        </div>

                        <div className="mt-3 flex items-center justify-around border-t border-mint/15 pt-3 text-[10px] text-navy/60">
                          {['Home', 'Quest', 'Pass', 'Care'].map((item) => (
                            <div key={item} className="flex flex-col items-center gap-1">
                              <span className={`size-2 rounded-full ${item === 'Home' ? 'bg-emerald' : 'bg-mint/40'}`} />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Supporting system summary */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.32 }}
            className="relative z-10 order-3"
          >
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 md:p-6 backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)]">
              <div className="text-gold-soft text-[10px] tracking-[0.32em] uppercase font-semibold">
                Design system direction
              </div>
              <h3 className="mt-3 font-display text-[1.8rem] leading-[1.05] text-white">
                Clearer brand expression across the current index page
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-white/80">
                The new composition moves the experience away from a text-heavy landing panel and closer to a premium product preview—more balanced, more scannable, and closer to the attached wellness app references.
              </p>

              <div className="mt-5 space-y-3">
                {heroModules.map((module, index) => (
                  <div
                    key={module.title}
                    className="flex items-start gap-3 rounded-[1.15rem] border border-white/12 bg-white/8 px-4 py-3"
                  >
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-white/14 text-gold-soft">
                      <module.icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[13px] font-semibold text-white">{module.title}</div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                          0{index + 1}
                        </span>
                      </div>
                      <div lang="th" className="mt-1 text-[11px] leading-relaxed text-white/62">
                        {module.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-[1.1rem] border border-white/12 bg-white/8 px-3 py-4 text-center">
                    <div className="font-display text-[1.35rem] text-gold">{stat.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/55">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[1.25rem] border border-gold/25 bg-[linear-gradient(135deg,rgba(201,184,155,0.18),rgba(255,255,255,0.06))] p-4">
                <div className="text-[10px] uppercase tracking-[0.24em] text-gold-soft">Why this works better</div>
                <p lang="th" className="mt-2 text-[12px] leading-relaxed text-white/78">
                  โลโก้ยังเป็นจุดนำสายตาบนแถบนำทาง แต่ hero มีศูนย์กลางชัดขึ้นด้วย phone mockup ทำให้ภาพรวมสมดุลและสื่อว่าแพลตฟอร์มนี้เป็น “product experience” ไม่ใช่แค่หน้าโปรโมต
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* MODAL POPUPS — same as before */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/50 backdrop-blur-md"
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
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold/80">
                    {t("modal.journey.kicker")}
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl mt-2">
                    {t("modal.journey.title")}
                  </h2>
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
                        <p className="text-xs text-muted-foreground/80 mt-1.5 leading-relaxed">
                          {t(p.descKey)}
                        </p>
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
                  <h2 className="font-display text-3xl md:text-4xl mt-2">
                    {t("modal.personas.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground/80 mt-2">{t("modal.personas.sub")}</p>
                  <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.values(personas).map((p) => (
                      <div
                        key={p.id}
                        className={`relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br ${p.color} ring-1 ring-white/30 shadow-md`}
                      >
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]" />
                        <div className="relative">
                          <div className="text-[9px] tracking-widest uppercase text-emerald/90 font-bold">
                            {p.id}
                          </div>
                          <div className="font-display text-lg mt-1 text-navy/90">
                            {pick(p.name, lang)}
                          </div>
                          <div className="text-xs text-emerald-deep/70 font-medium">
                            {pick(p.thaiName, lang)}
                          </div>
                          <div className="text-xs mt-2 text-navy/70 line-clamp-2">
                            {pick(p.tagline, lang)}
                          </div>
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
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold/80">
                    {t("modal.samui.kicker")}
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl mt-2">
                    {t("modal.samui.title")}
                  </h2>
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
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold/80">
                    {t("modal.company.kicker")}
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl mt-2">
                    {t("modal.company.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground/80 mt-3 leading-relaxed">
                    {t("modal.company.intro")}
                  </p>
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
                      <div
                        key={k}
                        className="card-soft p-3.5 rounded-xl flex items-center gap-3 bg-white/70"
                      >
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
                      <a
                        href="tel:+66945958741"
                        className="mt-2 flex items-center gap-2 text-sm hover:text-emerald/80"
                      >
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
                      <div className="text-[9px] tracking-[0.25em] uppercase text-emerald/80">
                        HQ
                      </div>
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
            className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-4 bg-navy/50 backdrop-blur-md"
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
              <div className="text-[9px] tracking-[0.3em] uppercase text-gold/80">
                Goodfill Care
              </div>
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
