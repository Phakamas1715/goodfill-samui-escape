import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Nav } from "./Nav";
import { images } from "@/lib/data";
import hostWelcome from "@/assets/host-welcome.png.asset.json";
import hostFitness from "@/assets/host-fitness.png.asset.json";
import hostWai from "@/assets/host-wai.png.asset.json";
import hostGift from "@/assets/host-gift.png.asset.json";

export const hosts = {
  welcome: hostWelcome.url,
  fitness: hostFitness.url,
  wai: hostWai.url,
  gift: hostGift.url,
} as const;

export const bgs = {
  beach: images.heroSamui,
  villa: images.villa,
  yoga: images.yoga,
  spa: images.spa,
  food: images.food,
  meditation: images.meditation,
} as const;

export type HostKey = keyof typeof hosts;
export type BgKey = keyof typeof bgs;

interface DashShellProps {
  bg?: BgKey;
  host?: HostKey | null;
  title: string;
  subtitle?: string;
  kicker?: string;
  children: ReactNode;
  /** show host as small floating bubble (true) vs large side image */
  hostFloating?: boolean;
  /** Optional gold highlight ribbon shown under the title (e.g. "Best for Sleep Seekers"). */
  highlight?: string;
  /** Compact header — smaller title/spacing so the route fits one mobile viewport. */
  compact?: boolean;
}

/**
 * Compact, single-screen dashboard layout with Samui background + glass panels.
 * Used across all internal dashboards/forms.
 */
export function DashShell({
  bg = "beach",
  host = "welcome",
  title,
  subtitle,
  kicker,
  children,
  hostFloating = true,
  highlight,
  compact = false,
}: DashShellProps) {
  // Rotating background slideshow — keeps internal pages visually alive.
  const slides = [
    bgs[bg],
    images.samuiAerial,
    images.villa,
    images.samuiInfinity,
    images.spa,
    images.samuiLongtail,
    images.yoga,
    images.samuiSpaRitual,
    images.meditation,
    images.food,
  ];
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);
  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      {/* SAMUI BACKGROUND */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.img
            key={slide}
            src={slides[slide]}
            alt=""
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute inset-0 size-full object-cover"
          />
        </AnimatePresence>
        {/* Deep ocean readability wash — richer, more intense backdrop so
            white glass cards pop with clear contrast over the imagery. */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-deep/55 via-emerald-deep/45 to-emerald-deep/70" />
        <div className="absolute inset-0 bg-gradient-to-tr from-sea/35 via-transparent to-emerald-deep/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_10%_-5%,rgba(244,166,74,0.22),transparent_65%),radial-gradient(ellipse_50%_40%_at_95%_100%,rgba(30,136,168,0.35),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        {/* Tropical leaf silhouettes — subtle corner accents */}
        <svg className="absolute -top-10 -left-10 w-72 h-72 opacity-[0.10] text-emerald-deep pointer-events-none rotate-12" viewBox="0 0 100 100" fill="currentColor" aria-hidden>
          <path d="M50 5 C60 25 80 35 95 40 C80 45 70 65 65 95 C60 75 40 65 5 60 C20 55 30 35 35 5 Z" />
        </svg>
        <svg className="absolute -bottom-8 -right-8 w-80 h-80 opacity-[0.10] text-sea pointer-events-none -rotate-12" viewBox="0 0 100 100" fill="currentColor" aria-hidden>
          <path d="M50 5 C60 25 80 35 95 40 C80 45 70 65 65 95 C60 75 40 65 5 60 C20 55 30 35 35 5 Z" />
        </svg>
        {/* Slide indicators */}
        <div className="absolute top-20 right-4 md:right-6 z-10 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-gradient-to-r from-gold via-gold-soft to-coral shadow-[0_0_12px_rgba(244,166,74,0.6)]" : "w-2.5 bg-emerald-deep/25"}`}
            />
          ))}
        </div>
      </div>

      <Nav />

      {/* Goodfill host illustration — anchored to bottom-right of the viewport,
          full body with hem touching the bottom edge. Hidden on small screens. */}
      {host && (
        <motion.img
          key={host}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          src={hosts[host]}
          alt="Goodfill Care wellness host"
          className="hidden lg:block pointer-events-none select-none absolute bottom-0 right-2 xl:right-6 h-[70vh] max-h-[640px] w-auto object-contain object-bottom z-[1] drop-shadow-[0_18px_40px_rgba(6,78,59,0.55)]"
        />
      )}

      <main className={`relative h-full ${compact ? "pt-16 md:pt-20" : "pt-20 md:pt-24"} pb-20 md:pb-6 px-3 md:px-6 flex flex-col`}>
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0 lg:pr-[22rem] xl:pr-[26rem]">
          {/* HEADER — compact */}
          <div className={`flex items-end justify-between gap-3 ${compact ? "mb-2 md:mb-3" : "mb-5 md:mb-6"} sun-glow`}>
            <div className="min-w-0">
              {kicker && (
                <div className="text-[11px] md:text-[12px] tracking-[0.32em] uppercase font-semibold flex items-center gap-2 gold-text">
                  <span className="inline-block h-px w-8 bg-gradient-to-r from-gold to-coral" />
                  {kicker}
                </div>
              )}
              <h1 className={`font-display ${compact ? "text-xl md:text-3xl lg:text-4xl" : "text-2xl md:text-4xl lg:text-5xl"} text-ivory leading-[1.1] mt-1.5 tracking-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)] line-clamp-2`}>
                {title}
              </h1>
              {highlight && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-gold-soft to-coral text-emerald-deep text-[11px] md:text-xs font-bold tracking-wider uppercase px-3 py-1 shadow-[0_8px_24px_-8px_rgba(244,166,74,0.65)] ring-1 ring-gold/40">
                  <span className="size-1.5 rounded-full bg-emerald-deep animate-pulse" />
                  {highlight}
                </div>
              )}
              {subtitle && (
                <p className="text-base md:text-lg text-ivory/85 line-clamp-1 mt-2 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
                  {subtitle}
                </p>
              )}
            </div>
            {host && hostFloating && (
              <motion.img
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                src={hosts[host]}
                alt="Goodfill Care wellness host illustration"
                className="lg:hidden h-16 md:h-24 w-auto object-contain shrink-0 drop-shadow-[0_10px_24px_rgba(6,78,59,0.4)] my-[100px] font-extrabold"
              />
            )}
          </div>

          {/* CONTENT */}
          <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

/** Compact glass card for dashboard panels. */
export function DashCard({
  children,
  className = "",
  variant = "light",
}: {
  children: ReactNode;
  className?: string;
  /** "deep" = dark navy card with light text (default). "light" = white card. */
  variant?: "deep" | "light";
}) {
  const base =
    variant === "deep"
      ? "card-deep p-4 md:p-5"
      : "card-glass p-5 md:p-6";
  return (
    <div className={`${base} ${className}`}>{children}</div>
  );
}