import { type ReactNode } from "react";
import { motion } from "framer-motion";
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
}: DashShellProps) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-navy text-foreground">
      {/* SAMUI BACKGROUND */}
      <div className="absolute inset-0">
        <img src={bgs[bg]} alt="" className="size-full object-cover" />
        {/* Premium tonal contrast — image shows through, content stays legible via cards */}
        <div className="absolute inset-0 bg-gradient-to-br from-ivory/55 via-ivory/35 to-ivory/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-ivory/85 via-ivory/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-deep/25 via-transparent to-gold/10 mix-blend-multiply" />
      </div>

      <Nav />

      <main className="relative h-full pt-20 md:pt-24 pb-24 md:pb-6 px-3 md:px-6 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0">
          {/* HEADER — compact */}
          <div className="flex items-end justify-between gap-3 mb-3 md:mb-4">
            <div className="min-w-0">
              {kicker && (
                <div className="text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-gold font-medium">
                  {kicker}
                </div>
              )}
              <h1 className="font-display text-2xl md:text-3xl text-navy leading-tight truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
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
                alt="host"
                className="h-16 md:h-24 w-auto object-contain shrink-0 drop-shadow-[0_8px_18px_rgba(11,86,79,0.35)]"
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
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white/85 backdrop-blur-md rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(8,42,67,0.08)] p-4 md:p-5 ${className}`}
    >
      {children}
    </div>
  );
}