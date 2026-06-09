import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Compass, HeartPulse, Leaf, MoonStar, X, Building2, Phone, MapPin, ExternalLink, Handshake, ShieldCheck, Menu, Map as MapIcon, Users } from "lucide-react";
import { Nav } from "@/components/Nav";
import { images, personas, pick } from "@/lib/data";
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
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/65 to-emerald-deep/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-deep/90 via-emerald-deep/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(212,160,23,0.18),transparent_55%)]" />
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
        <div className="flex-1 grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-10 items-center max-w-7xl mx-auto w-full lg:px-[50px] lg:my-[50px] pb-[50px]">
          {/* LEFT — Brand + Headline + Actions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative z-10 min-w-0 max-w-[230px] sm:max-w-[380px] lg:max-w-none"
          >
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Goodfill Care"
                className="h-12 md:h-14 w-auto object-contain drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]"
              />
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl md:text-3xl text-white drop-shadow-md">
                  Goodfill <span className="text-gold italic">Care</span>
                </span>
                <span className="text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-gold-soft/95 mt-1.5">
                  {t("hero.kicker")}
                </span>
              </div>
            </div>

            {/* Editorial kicker rule */}
            <div className="hidden lg:flex items-center gap-3 mt-8">
              <span className="h-px w-12 bg-gold" />
              <span className="text-gold text-[11px] tracking-[0.4em] uppercase font-medium">
                Wellness Journey
              </span>
            </div>

          <h1 className="font-display font-normal text-[1.9rem] sm:text-[3rem] md:text-6xl lg:text-[4.5rem] leading-[1.08] mt-5 md:mt-6 text-white drop-shadow-[0_3px_24px_rgba(0,0,0,0.6)] lg:max-w-[640px]">
              {t("hero.title1")}<br />
              <em className="italic text-gold font-normal">{t("hero.title2")}</em>{" "}
              <span className="block">{t("hero.title3")}</span>
            </h1>
          <p className="mt-4 md:mt-6 max-w-md text-[15px] md:text-lg text-white font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
              {t("hero.desc")}
            </p>

            {/* Editorial proof points — green dot bullets */}
            <div className="hidden md:flex flex-wrap gap-x-7 gap-y-2 mt-6">
              {[
                "8 Wellness Quests",
                "6 Distinct Personas",
                "3 / 5 / 7 Day Programs",
              ].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-mint shadow-[0_0_8px_rgba(120,200,170,0.6)]" />
                  <span className="text-white/70 text-[10px] tracking-[0.22em] uppercase font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Action cluster — refined branded CTA */}
            <div className="mt-7 md:mt-8 flex flex-col gap-3 max-w-[22rem]">
              <Link
                to="/quest"
                className="btn-gold group relative overflow-hidden rounded-2xl px-7 py-4 inline-flex items-center justify-center gap-2.5 text-base md:text-[17px] font-semibold tracking-wide shadow-[0_18px_50px_-14px_rgba(201,168,76,0.7)] ring-1 ring-gold/40 hover:scale-[1.02] transition"
              >
                <Sparkles size={18} className="opacity-80" />
                <span>{t("hero.ctaStart")}</span>
                <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
              </Link>
              <button
                onClick={() => setMoreOpen(true)}
                className="rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 text-white py-3 px-5 inline-flex items-center justify-center gap-2 text-sm font-medium transition"
              >
                <Menu size={16} />
                <span>สำรวจเพิ่มเติม</span>
              </button>
              <div className="flex items-center justify-between gap-3 text-[12px] text-white/85 font-medium px-1 mt-1 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
                <span className="tracking-wide">~8 นาที · ตอบโดยไม่ต้องพิมพ์</span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-mint" /> ปลอดภัย
                </span>
              </div>
            </div>

            <div className="mt-6 md:mt-8 flex md:hidden items-center gap-5 md:gap-7 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
              {[
                { v: "8", k: "hero.stat.min" as TKey },
                { v: "6", k: "hero.stat.personas" as TKey },
                { v: "12+", k: "hero.stat.partners" as TKey },
              ].map((s, i) => (
                <div key={s.k} className="flex items-center gap-5 md:gap-7">
                  {i > 0 && <span className="h-8 w-px bg-white/30" />}
                  <div>
                    <div className="font-display text-2xl md:text-3xl font-semibold text-gold">{s.v}</div>
                    <div className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-white/85 font-medium mt-0.5">{t(s.k)}</div>
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
            className="relative z-20 hidden lg:block border-l border-white/15 pl-12 self-center text-white"
          >
            <div className="space-y-10 max-w-sm">
              <div>
                <div className="text-gold text-[10px] tracking-[0.35em] uppercase font-bold">
                  Refined Care
                </div>
                <p className="mt-3 text-white/65 text-sm font-light leading-relaxed">
                  Curated specifically for global travelers seeking deep restoration in the heart of Thailand —
                  ภายใต้การดูแลของผู้เชี่ยวชาญ Wellness และเชฟโภชนาการที่ออกแบบทุกขั้นตอนเฉพาะคุณ
                </p>
              </div>

              <div className="relative">
                <div
                  className="absolute -top-10 -left-5 text-7xl text-gold/25 select-none pointer-events-none"
                  aria-hidden
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  &ldquo;
                </div>
                <p className="relative font-display italic text-2xl leading-snug text-white/90">
                  A sanctuary where every breath is intentional,
                  and every moment is yours.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="h-px w-8 bg-gold/70" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">
                    Goodfill Promise
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-6 border-t border-white/10">
                <div>
                  <div className="font-display text-2xl text-gold">6</div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-white/55 mt-1">Personas</div>
                </div>
                <div>
                  <div className="font-display text-2xl text-gold">3·5·7</div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-white/55 mt-1">Day Plans</div>
                </div>
                <div>
                  <div className="font-display text-2xl text-gold">+300</div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-white/55 mt-1">Calm Credits</div>
                </div>
                <div>
                  <div className="font-display text-2xl text-gold">12+</div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-white/55 mt-1">Partners</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile host — bigger, transparent, sits behind content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.25 }}
            className="hidden"
          >
            {/* host hidden on desktop in editorial layout */}
          </motion.div>

          {/* Mobile host — bigger, transparent, sits behind content */}
          <motion.img
            initial={{ opacity: 0, x: 30, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            src={welcomeHost}
            alt=""
            className="lg:hidden absolute -right-6 bottom-[58px] h-[52vh] max-h-[500px] w-auto object-contain object-bottom pointer-events-none drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)] z-0"
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
                        <div className="font-display text-lg mt-1">{pick(p.name, lang)}</div>
                        <div className="text-xs text-muted-foreground">{pick(p.thaiName, lang)}</div>
                        <div className="text-xs mt-2 text-navy/70 line-clamp-2">{pick(p.tagline, lang)}</div>
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

      {/* MORE MENU (progressive disclosure for secondary actions) */}
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-4 bg-navy/60 backdrop-blur-md"
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
                className="absolute top-3 right-3 size-12 rounded-full bg-cream hover:bg-mint/50 grid place-items-center shadow-md ring-1 ring-mint/40 active:scale-95 transition"
                aria-label="ปิด"
              >
                <X size={22} />
              </button>
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold">Goodfill Care</div>
              <h3 className="font-display text-2xl mt-1">เมนูเพิ่มเติม</h3>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {moreItems.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => { setMoreOpen(false); setModal(m.key); }}
                    className="card-soft rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-pale-mint/60 active:scale-[0.99] transition"
                  >
                    <span className="size-10 rounded-xl bg-pale-mint border border-mint/60 grid place-items-center text-emerald">
                      <m.icon size={18} />
                    </span>
                    <span className="font-medium">{m.label}</span>
                    <ArrowRight size={16} className="ml-auto text-emerald" />
                  </button>
                ))}
                <Link
                  to="/partners"
                  onClick={() => setMoreOpen(false)}
                  className="card-soft rounded-2xl p-4 flex items-center gap-3 hover:bg-pale-mint/60 active:scale-[0.99] transition"
                >
                  <span className="size-10 rounded-xl bg-pale-mint border border-mint/60 grid place-items-center text-emerald">
                    <Handshake size={18} />
                  </span>
                  <span className="font-medium">{t("hero.btnPartners")}</span>
                  <ArrowRight size={16} className="ml-auto text-emerald" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
