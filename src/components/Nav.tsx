import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/quest", label: "Wellness Quest" },
  { to: "/programs", label: "Programs" },
  { to: "/journey", label: "My Journey" },
  { to: "/care", label: "Care Plan" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-5 md:px-8 mt-4">
        <div className="glass rounded-full flex items-center justify-between px-4 md:px-6 py-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-full bg-gradient-to-br from-emerald to-emerald-deep grid place-items-center text-gold text-lg font-display">✦</div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg tracking-wide">Goodfill</span>
              <span className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase -mt-0.5">Care · Koh Samui</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 whitespace-nowrap">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/quest"
            className="hidden md:inline-flex btn-gold rounded-full px-5 py-2 text-sm whitespace-nowrap"
          >
            เริ่มแบบประเมิน
          </Link>
          <button
            className="md:hidden text-foreground"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="glass md:hidden mt-2 rounded-3xl p-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm hover:bg-white/5"
                activeProps={{ className: "text-gold bg-white/5" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/quest"
              onClick={() => setOpen(false)}
              className="btn-gold rounded-full px-5 py-3 text-sm text-center mt-2"
            >
              เริ่มแบบประเมิน
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/50">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-12 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="font-display text-2xl">Goodfill Care</div>
          <p className="text-muted-foreground mt-2 max-w-xs">
            แพลตฟอร์ม wellness แบบ end-to-end สำหรับการพักผ่อนระดับลักชัวรี่บนเกาะสมุย
          </p>
        </div>
        <div>
          <div className="text-gold tracking-widest text-xs uppercase mb-3">Experience</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>Pre-arrival Wellness Quest</li>
            <li>Personalized Programs</li>
            <li>Partner Service Network</li>
            <li>Final Wellness Report</li>
            <li>Long-term Care</li>
          </ul>
        </div>
        <div>
          <div className="text-gold tracking-widest text-xs uppercase mb-3">Contact</div>
          <p className="text-muted-foreground">care@goodfill.co</p>
          <p className="text-muted-foreground">+66 77 000 0000</p>
          <p className="text-muted-foreground mt-2">เกาะสมุย · สุราษฎร์ธานี · ประเทศไทย</p>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground pb-8">
        © {new Date().getFullYear()} Goodfill Wellness Solution
      </div>
    </footer>
  );
}