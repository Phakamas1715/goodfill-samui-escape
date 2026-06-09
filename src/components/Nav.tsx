import { Link } from "@tanstack/react-router";
import { Menu, X, Home, ClipboardList, Sparkles, QrCode, HeartHandshake } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/goodfill-logo.png";
import { useI18n } from "@/lib/i18n";

const linkDefs = [
  { to: "/", key: "nav.home", icon: Home },
  { to: "/quest", key: "nav.quest", icon: ClipboardList },
  { to: "/programs", key: "nav.programs", icon: Sparkles },
  { to: "/journey", key: "nav.journey", icon: QrCode },
  { to: "/care", key: "nav.care", icon: HeartHandshake },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useI18n();

  const LangToggle = ({ className = "" }: { className?: string }) => (
    <div
      className={`flex items-center gap-0.5 rounded-full bg-white/80 backdrop-blur border border-mint/40 p-0.5 text-[11px] font-medium ${className}`}
    >
      {(["th", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-full transition ${lang === l ? "bg-emerald text-white shadow-sm" : "text-navy/60 hover:text-emerald"}`}
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-mint/20 shadow-[0_2px_18px_-10px_rgba(12,35,64,0.25)]">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex items-center justify-between gap-4 py-3 md:py-3.5">
            {/* Logo (left) - ขนาดใหญ่ขึ้น */}
            <Link to="/" className="flex items-center gap-3 group shrink-0 min-w-0">
              <div className="relative">
                {/* กล่องเรืองแสงรอบโลโก้ */}
                <div className="absolute inset-0 rounded-xl bg-gold/20 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                <img
                  src={logo}
                  alt="Goodfill Care"
                  className="h-14 md:h-18 w-auto object-contain shrink-0 drop-shadow-md relative z-10"
                />
              </div>
              <span className="hidden sm:flex flex-col leading-none min-w-0">
                <span className="font-display text-xl md:text-2xl text-navy whitespace-nowrap">
                  Goodfill <span className="text-emerald">Care</span>
                </span>
                <span className="text-[10px] tracking-[0.28em] uppercase text-emerald/60 mt-0.5 whitespace-nowrap">
                  Koh Samui
                </span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 whitespace-nowrap">
              {linkDefs.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-[15px] text-navy/70 hover:text-emerald transition-colors whitespace-nowrap"
                  activeProps={{ className: "text-emerald font-medium" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {t(l.key as never)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <LangToggle />
              <Link
                to="/quest"
                className="hidden md:inline-flex rounded-full px-5 py-2 text-[14px] whitespace-nowrap border border-emerald/40 text-emerald bg-white/70 hover:bg-emerald/10 transition"
              >
                {t("nav.cta")}
              </Link>
              <button
                className="lg:hidden text-emerald grid place-items-center size-10 rounded-full bg-pale-mint border border-mint/40"
                onClick={() => setOpen((o) => !o)}
                aria-label="Menu"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Drawer */}
          {open && (
            <div className="lg:hidden border-t border-mint/20 bg-white pb-4 pt-3 flex flex-col gap-1">
              {linkDefs.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-2xl text-base text-navy/80 hover:bg-pale-mint hover:text-emerald flex items-center justify-between transition"
                  activeProps={{ className: "text-emerald bg-pale-mint" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  <span>{t(l.key as never)}</span>
                  <l.icon size={18} className="text-emerald/60" />
                </Link>
              ))}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-mint/30">
                <Link
                  to="/partner"
                  onClick={() => setOpen(false)}
                  className="bg-cream text-center text-sm py-2.5 rounded-xl text-navy/70 hover:text-emerald hover:bg-pale-mint transition"
                >
                  Partner
                </Link>
                <Link
                  to="/expert"
                  onClick={() => setOpen(false)}
                  className="bg-cream text-center text-sm py-2.5 rounded-xl text-navy/70 hover:text-emerald hover:bg-pale-mint transition"
                >
                  Expert
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="bg-cream text-center text-sm py-2.5 rounded-xl text-navy/70 hover:text-emerald hover:bg-pale-mint transition"
                >
                  Admin
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50">
        <div className="bg-white/95 backdrop-blur-sm border-t border-mint/20 px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between shadow-[0_-4px_20px_-10px_rgba(12,35,64,0.25)]">
          {linkDefs.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-emerald" }}
              className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl text-navy/60 text-[11px] transition-colors hover:text-emerald"
            >
              <l.icon size={22} strokeWidth={1.75} className="text-navy/60 group-hover:text-emerald" />
              <span className="font-medium text-[10px]">{t(l.key as never)}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

export function Footer() {
  const { t, lang } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-32 bg-gradient-to-b from-cream/80 to-cream/40 border-t border-mint/30">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-12">
        {/* Top Section - Logo + Description */}
        <div className="grid md:grid-cols-4 gap-8 pb-8 border-b border-mint/30">
          {/* Brand Column - โลโก้ใหญ่ขึ้น */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gold/20 blur-lg opacity-60" />
                <img
                  src={logo}
                  alt="Goodfill Care"
                  className="h-20 md:h-24 w-auto object-contain drop-shadow-md relative z-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl text-navy font-semibold">
                  Goodfill <span className="text-emerald">Care</span>
                </span>
                <span className="text-[9px] tracking-[0.25em] uppercase text-emerald/60">Koh Samui</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{t("footer.tagline")}</p>
          </div>

          {/* Experience Links */}
          <div>
            <div className="text-emerald tracking-widest text-xs uppercase mb-3 font-semibold flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald" />
              {t("footer.experience")}
            </div>
            <ul className="space-y-2">
              <li>
                <Link to="/quest" className="text-sm text-muted-foreground hover:text-emerald transition-colors">
                  Wellness Quest
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-sm text-muted-foreground hover:text-emerald transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/journey" className="text-sm text-muted-foreground hover:text-emerald transition-colors">
                  QR Wellness Pass
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-sm text-muted-foreground hover:text-emerald transition-colors">
                  Wellness Report
                </Link>
              </li>
              <li>
                <Link to="/care" className="text-sm text-muted-foreground hover:text-emerald transition-colors">
                  Calm Credits
                </Link>
              </li>
            </ul>
          </div>

          {/* For Teams Links */}
          <div>
            <div className="text-emerald tracking-widest text-xs uppercase mb-3 font-semibold flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald" />
              {t("footer.forTeams")}
            </div>
            <ul className="space-y-2">
              <li>
                <Link to="/partner" className="text-sm text-muted-foreground hover:text-emerald transition-colors">
                  Partner LIFF
                </Link>
              </li>
              <li>
                <Link to="/expert" className="text-sm text-muted-foreground hover:text-emerald transition-colors">
                  Expert Board
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sm text-muted-foreground hover:text-emerald transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <div className="text-emerald tracking-widest text-xs uppercase mb-3 font-semibold flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald" />
              {t("footer.contact")}
            </div>
            <ul className="space-y-2">
              <li className="text-sm">
                <a
                  href="mailto:care@goodfill.co"
                  className="text-muted-foreground hover:text-emerald transition-colors"
                >
                  care@goodfill.co
                </a>
              </li>
              <li className="text-sm">
                <a href="tel:+66770000000" className="text-muted-foreground hover:text-emerald transition-colors">
                  +66 77 000 0000
                </a>
              </li>
              <li className="text-sm text-muted-foreground mt-3 pt-1">{t("footer.location")}</li>
            </ul>

            {/* Social Links Placeholder */}
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="size-8 rounded-full bg-white/50 flex items-center justify-center text-muted-foreground hover:text-emerald hover:bg-white transition-colors"
              >
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="#"
                className="size-8 rounded-full bg-white/50 flex items-center justify-center text-muted-foreground hover:text-emerald hover:bg-white transition-colors"
              >
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </a>
              <a
                href="#"
                className="size-8 rounded-full bg-white/50 flex items-center justify-center text-muted-foreground hover:text-emerald hover:bg-white transition-colors"
              >
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="text-center text-xs text-muted-foreground pt-6">
          <p>
            © {currentYear} Goodfill Care · {t("footer.rights")}
          </p>
          <div className="flex items-center justify-center gap-4 mt-2 text-[10px]">
            <Link to="/privacy" className="text-muted-foreground hover:text-emerald transition-colors">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground/30">|</span>
            <Link to="/terms" className="text-muted-foreground hover:text-emerald transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
