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
    <div className={`flex items-center gap-0.5 rounded-full bg-white/80 backdrop-blur border border-mint/40 p-0.5 text-[11px] font-medium ${className}`}>
      {(["th", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-full transition ${lang === l ? "bg-emerald text-ivory shadow-sm" : "text-emerald-deep/70 hover:text-emerald"}`}
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <>
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-navy/10 shadow-[0_2px_18px_-10px_rgba(12,35,64,0.25)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex items-center justify-between gap-4 py-3 md:py-3.5">
          {/* Logo (left) */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 min-w-0">
            <img src={logo} alt="Goodfill Care" className="h-9 md:h-11 w-auto object-contain shrink-0 text-6xl" />
            <span className="hidden sm:flex flex-col leading-none min-w-0">
              <span className="font-display text-xl md:text-2xl text-navy whitespace-nowrap">Goodfill <span className="text-emerald">Care</span></span>
              <span className="text-[10px] tracking-[0.28em] uppercase text-emerald-deep/60 mt-0.5 whitespace-nowrap">Koh Samui</span>
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
          <div className="flex items-center gap-2 shrink-0">
            <LangToggle />
            <Link
              to="/quest"
              className="hidden md:inline-flex btn-emerald rounded-full px-5 py-2 text-[15px] whitespace-nowrap"
            >
              {t("nav.cta")}
            </Link>
            <button
              className="lg:hidden text-emerald-deep grid place-items-center size-10 rounded-full bg-pale-mint border border-mint/40"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t border-navy/10 bg-white pb-3 pt-2 flex flex-col gap-1">
            {linkDefs.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-2xl text-base hover:bg-pale-mint flex items-center justify-between"
                activeProps={{ className: "text-emerald bg-pale-mint" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                <span>{t(l.key as never)}</span>
                <l.icon size={18} className="text-emerald/60" />
              </Link>
            ))}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Link to="/partner" onClick={() => setOpen(false)} className="card-cream text-center text-sm py-2 rounded-xl">Partner</Link>
              <Link to="/expert" onClick={() => setOpen(false)} className="card-cream text-center text-sm py-2 rounded-xl">Expert</Link>
              <Link to="/admin" onClick={() => setOpen(false)} className="card-cream text-center text-sm py-2 rounded-xl">Admin</Link>
            </div>
          </div>
        )}
      </div>
    </header>
    {/* Mobile bottom navigation */}
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50">
      <div className="bg-white border-t border-navy/10 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-between shadow-[0_-4px_20px_-10px_rgba(12,35,64,0.25)]">
        {linkDefs.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: l.to === "/" }}
            activeProps={{ className: "text-emerald" }}
            className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl text-navy/65 text-[11px]"
          >
            <l.icon size={22} />
            <span className="font-medium">{t(l.key as never)}</span>
          </Link>
        ))}
      </div>
    </nav>
    </>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-32 bg-cream/60 border-t border-mint/40">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-12 grid md:grid-cols-4 gap-8 text-sm pb-28 md:pb-12">
        <div>
          <img src={logo} alt="Goodfill Care" className="h-12 w-auto" />
          <p className="text-muted-foreground mt-2 max-w-xs">
            {t("footer.tagline")}
          </p>
        </div>
        <div>
          <div className="text-emerald tracking-widest text-xs uppercase mb-3 font-medium">{t("footer.experience")}</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/quest">Wellness Quest</Link></li>
            <li><Link to="/programs">Programs</Link></li>
            <li><Link to="/journey">QR Wellness Pass</Link></li>
            <li><Link to="/report">Wellness Report</Link></li>
            <li><Link to="/care">Calm Credits</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-emerald tracking-widest text-xs uppercase mb-3 font-medium">{t("footer.forTeams")}</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/partner">Partner LIFF</Link></li>
            <li><Link to="/expert">Expert Board</Link></li>
            <li><Link to="/admin">Admin Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-emerald tracking-widest text-xs uppercase mb-3 font-medium">{t("footer.contact")}</div>
          <p className="text-muted-foreground">care@goodfill.co</p>
          <p className="text-muted-foreground">+66 77 000 0000</p>
          <p className="text-muted-foreground mt-2">{t("footer.location")}</p>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground pb-8">
        © {new Date().getFullYear()} Goodfill Care · {t("footer.rights")}
      </div>
    </footer>
  );
}