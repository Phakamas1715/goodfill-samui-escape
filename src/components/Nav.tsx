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
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-5 md:px-8 mt-4">
        <div className="glass rounded-full flex items-center justify-between px-2 md:px-3 py-2">
          <Link to="/" className="flex items-center gap-2.5 group pl-1">
            <span className="size-10 md:size-11 rounded-full bg-white grid place-items-center shadow-md ring-1 ring-mint/40 group-hover:scale-105 transition">
              <img src={logo} alt="Goodfill Care" className="h-7 md:h-8 w-auto object-contain" />
            </span>
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-lg md:text-xl text-navy">Goodfill <span className="text-emerald">Care</span></span>
              <span className="text-[9px] tracking-[0.28em] uppercase text-emerald-deep/60 mt-0.5">Koh Samui</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 whitespace-nowrap">
            {linkDefs.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-muted-foreground hover:text-emerald transition-colors whitespace-nowrap"
                activeProps={{ className: "text-emerald font-medium" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {t(l.key as never)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LangToggle />
            <Link
              to="/quest"
              className="hidden md:inline-flex btn-emerald rounded-full px-5 py-2 text-sm whitespace-nowrap"
            >
              {t("nav.cta")}
            </Link>
            <button
              className="md:hidden text-emerald-deep grid place-items-center size-9 rounded-full bg-white/80 border border-mint/40"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="glass md:hidden mt-2 rounded-3xl p-3 flex flex-col gap-1">
            {linkDefs.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm hover:bg-pale-mint flex items-center justify-between"
                activeProps={{ className: "text-emerald bg-pale-mint" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                <span>{t(l.key as never)}</span>
                <l.icon size={16} className="text-emerald/60" />
              </Link>
            ))}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Link to="/partner" onClick={() => setOpen(false)} className="card-cream text-center text-xs py-2 rounded-xl">Partner</Link>
              <Link to="/expert" onClick={() => setOpen(false)} className="card-cream text-center text-xs py-2 rounded-xl">Expert</Link>
              <Link to="/admin" onClick={() => setOpen(false)} className="card-cream text-center text-xs py-2 rounded-xl">Admin</Link>
            </div>
          </div>
        )}
      </div>
    </header>
    {/* Mobile bottom navigation */}
    <nav className="md:hidden fixed bottom-3 inset-x-3 z-50">
      <div className="glass rounded-full px-2 py-1.5 flex items-center justify-between">
        {linkDefs.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: l.to === "/" }}
            activeProps={{ className: "bg-emerald text-ivory" }}
            className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-full text-emerald-deep/70 text-[10px]"
          >
            <l.icon size={18} />
            <span>{t(l.key as never)}</span>
          </Link>
        ))}
      </div>
    </nav>
    </>
  );
}

export function Footer() {
  return (
    <footer className="mt-32 bg-cream/60 border-t border-mint/40">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-12 grid md:grid-cols-4 gap-8 text-sm pb-28 md:pb-12">
        <div>
          <img src={logo} alt="Goodfill Care" className="h-12 w-auto" />
          <p className="text-muted-foreground mt-2 max-w-xs">
            แพลตฟอร์มดูแลสุขภาพแบบครบวงจร สำหรับการพักผ่อนระดับพรีเมียมที่เกาะสมุย
          </p>
        </div>
        <div>
          <div className="text-emerald tracking-widest text-xs uppercase mb-3 font-medium">Experience</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/quest">Wellness Quest</Link></li>
            <li><Link to="/programs">Programs</Link></li>
            <li><Link to="/journey">QR Wellness Pass</Link></li>
            <li><Link to="/report">Wellness Report</Link></li>
            <li><Link to="/care">Calm Credits</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-emerald tracking-widest text-xs uppercase mb-3 font-medium">For Teams</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/partner">Partner LIFF</Link></li>
            <li><Link to="/expert">Expert Board</Link></li>
            <li><Link to="/admin">Admin Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-emerald tracking-widest text-xs uppercase mb-3 font-medium">Contact</div>
          <p className="text-muted-foreground">care@goodfill.co</p>
          <p className="text-muted-foreground">+66 77 000 0000</p>
          <p className="text-muted-foreground mt-2">เกาะสมุย · สุราษฎร์ธานี · ประเทศไทย</p>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground pb-8">
        © {new Date().getFullYear()} Goodfill Care · Create your best version
      </div>
    </footer>
  );
}