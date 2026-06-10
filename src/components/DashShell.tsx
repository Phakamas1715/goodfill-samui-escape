import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Nav } from "./Nav";
import { images } from "@/lib/data";

export const bgs = {
  beach: images.heroSamui,
  villa: images.villa,
  yoga: images.yoga,
  spa: images.spa,
  food: images.food,
  meditation: images.meditation,
} as const;

export type BgKey = keyof typeof bgs;

interface DashShellProps {
  bg?: BgKey;
  title: string;
  subtitle?: string;
  kicker?: string;
  children: ReactNode;
  /** Optional gold highlight ribbon shown under the title (e.g. "Best for Sleep Seekers"). */
  highlight?: string;
  /** Compact header — smaller title/spacing so the route fits one mobile viewport. */
  compact?: boolean;
  /** Optional host/brand label shown in the header. */
  host?: string;
}

/**
 * Compact, single-screen dashboard layout with Samui background + glass panels.
 * Used across all internal dashboards/forms.
 */
export function DashShell({
  bg = "beach",
  title,
  subtitle,
  kicker,
  children,
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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length, isPaused]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      {/* SAMUI BACKGROUND */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide}
            src={slides[slide]}
            alt="Samui wellness background"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute inset-0 size-full object-cover"
          />
        </AnimatePresence>

        {/* Deep ocean readability wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-deep/55 via-emerald-deep/45 to-emerald-deep/70" />
        <div className="absolute inset-0 bg-gradient-to-tr from-sea/35 via-transparent to-emerald-deep/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_10%_-5%,rgba(244,166,74,0.22),transparent_65%),radial-gradient(ellipse_50%_40%_at_95%_100%,rgba(30,136,168,0.35),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />

        {/* Tropical leaf silhouettes — subtle corner accents */}
        <svg
          className="absolute -top-10 -left-10 w-72 h-72 opacity-[0.08] text-emerald-deep pointer-events-none rotate-12"
          viewBox="0 0 100 100"
          fill="currentColor"
          aria-hidden
        >
          <path d="M50 5 C60 25 80 35 95 40 C80 45 70 65 65 95 C60 75 40 65 5 60 C20 55 30 35 35 5 Z" />
        </svg>
        <svg
          className="absolute -bottom-8 -right-8 w-80 h-80 opacity-[0.08] text-sea pointer-events-none -rotate-12"
          viewBox="0 0 100 100"
          fill="currentColor"
          aria-hidden
        >
          <path d="M50 5 C60 25 80 35 95 40 C80 45 70 65 65 95 C60 75 40 65 5 60 C20 55 30 35 35 5 Z" />
        </svg>

        {/* Slide indicators */}
        <div className="absolute top-20 right-4 md:right-6 z-10 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slide
                  ? "w-8 bg-gradient-to-r from-gold via-gold-soft to-coral shadow-[0_0_12px_rgba(244,166,74,0.6)]"
                  : "w-2.5 bg-emerald-deep/30 hover:bg-emerald-deep/50"
              }`}
            />
          ))}
        </div>

        {/* Pause button for slideshow */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="absolute bottom-20 right-4 md:right-6 z-10 size-7 rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:text-white transition-colors flex items-center justify-center text-[10px]"
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {isPaused ? "▶" : "⏸"}
        </button>
      </div>

      <Nav />

      <main
        className={`relative h-full ${compact ? "pt-16 md:pt-20" : "pt-20 md:pt-24"} pb-20 md:pb-6 px-3 md:px-6 flex flex-col overflow-y-auto`}
      >
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col min-h-0">
          {/* HEADER */}
          <div
            className={`flex items-end justify-between gap-3 ${compact ? "mb-2 md:mb-3" : "mb-5 md:mb-6"} sun-glow`}
          >
            <div className="min-w-0 w-full">
              {kicker && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[11px] md:text-[12px] tracking-[0.32em] uppercase font-semibold flex items-center gap-2 gold-text"
                >
                  <span className="inline-block h-px w-8 bg-gradient-to-r from-gold to-coral" />
                  {kicker}
                </motion.div>
              )}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`font-display ${compact ? "text-xl md:text-3xl lg:text-4xl" : "text-2xl md:text-4xl lg:text-5xl"} text-ivory leading-[1.1] mt-1.5 tracking-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]`}
              >
                {title}
              </motion.h1>
              {highlight && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-gold-soft to-coral text-emerald-deep text-[11px] md:text-xs font-bold tracking-wider uppercase px-3 py-1 shadow-[0_8px_24px_-8px_rgba(244,166,74,0.65)] ring-1 ring-gold/40"
                >
                  <span className="size-1.5 rounded-full bg-emerald-deep animate-pulse" />
                  {highlight}
                </motion.div>
              )}
              {subtitle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-sm md:text-base text-ivory/85 mt-2 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] max-w-2xl"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          </div>

          {/* CONTENT with fade-in animation */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

/** Compact glass card for dashboard panels. */
interface DashCardProps {
  children: ReactNode;
  className?: string;
  /** "deep" = dark navy card with light text (default). "light" = white card. */
  variant?: "deep" | "light";
  /** Optional hover effect */
  hover?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

export function DashCard({
  children,
  className = "",
  variant = "deep",
  hover = false,
  onClick,
}: DashCardProps) {
  const baseClasses =
    variant === "deep" ? "card-deep p-4 md:p-5 rounded-2xl" : "card-glass p-5 md:p-6 rounded-2xl";

  const hoverClasses = hover
    ? "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
    : "";
  const clickableClasses = onClick ? "cursor-pointer" : "";

  const Component = onClick ? "button" : "div";

  return (
    <Component
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}

// ============================================================================
// Additional Helper Components
// ============================================================================

/**
 * Stats card for dashboard metrics
 */
export function StatsCard({
  label,
  value,
  icon,
  trend,
  className = "",
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; direction: "up" | "down" };
  className?: string;
}) {
  return (
    <DashCard variant="light" className={`text-center ${className}`}>
      {icon && <div className="text-gold mb-2">{icon}</div>}
      <div className="font-display text-3xl md:text-4xl text-navy font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
      {trend && (
        <div
          className={`text-[10px] mt-1 ${trend.direction === "up" ? "text-emerald" : "text-coral"}`}
        >
          {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
        </div>
      )}
    </DashCard>
  );
}

/**
 * Loading skeleton for dashboard
 */
export function DashSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-deep p-5 animate-pulse">
          <div className="h-4 w-24 bg-emerald/30 rounded mb-3" />
          <div className="h-8 w-32 bg-emerald/20 rounded mb-2" />
          <div className="h-3 w-full bg-emerald/15 rounded" />
        </div>
      ))}
    </div>
  );
}
