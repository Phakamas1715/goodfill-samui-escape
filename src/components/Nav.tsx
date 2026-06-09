import { Link } from "@tanstack/react-router";
import { Menu, X, Home, ClipboardList, Sparkles, QrCode, HeartHandshake } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/goodfill-logo.png";

const links = [
  { to: "/", label: "หน้าแรก", en: "Home" },
  { to: "/quest", label: "แบบประเมิน", en: "Quest" },
  { to: "/programs", label: "แพ็คเกจ", en: "Programs" },
  { to: "/journey", label: "การเดินทาง", en: "Journey" },
  { to: "/care", label: "ดูแลต่อเนื่อง", en: "Care" },
] as const;

const bottomLinks = [
  { to: "/", label: "หน้าแรก", icon: Home },
  { to: "/quest", label: "ประเมิน", icon: ClipboardList },
  { to: "/programs", label: "แพ็คเกจ", icon: Sparkles },
  { to: "/journey", label: "QR Pass", icon: QrCode },
  { to: "/care", label: "ดูแล", icon: HeartHandshake },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <>
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-5 md:px-8 mt-4">
        <div className="glass rounded-full flex items-center justify-between px-3 md:px-5 py-2.5">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Goodfill Care" className="h-9 md:h-10 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-7 whitespace-nowrap">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-muted-foreground hover:text-emerald transition-colors whitespace-nowrap"
                activeProps={{ className: "text-emerald font-medium" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/quest"
            className="hidden md:inline-flex btn-emerald rounded-full px-5 py-2 text-sm whitespace-nowrap"
          >
            เริ่มแบบประเมิน
          </Link>
          <button
            className="md:hidden text-emerald-deep"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="glass md:hidden mt-2 rounded-3xl p-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm hover:bg-pale-mint flex items-center justify-between"
                activeProps={{ className: "text-emerald bg-pale-mint" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                <span>{l.label}</span>
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground">{l.en}</span>
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
        {bottomLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: l.to === "/" }}
            activeProps={{ className: "bg-emerald text-ivory" }}
            className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-full text-emerald-deep/70 text-[10px]"
          >
            <l.icon size={18} />
            <span>{l.label}</span>
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