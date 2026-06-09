import { type ReactNode } from "react";
import { Nav, Footer } from "./Nav";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main className="pt-28 md:pt-32">{children}</main>
      <Footer />
    </>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24 ${className}`}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-gold ${className}`}>
      <span className="size-1 rounded-full bg-gold" />
      {children}
    </span>
  );
}