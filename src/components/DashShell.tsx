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
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      {/* SAMUI BACKGROUND */}
      <div className="absolute inset-0">
        <img src={bgs[bg]} alt="" className="size-full object-cover opacity-90" />
        {/* Magazine-style readability wash — bright page tone over imagery so
            dark navy data cards pop with crisp contrast above it. */}
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/75 via-ivory/85 to-ivory/95" />
        <div className="absolute inset-0 bg-gradient-to-tr from-sea/15 via-transparent to-mint/10 mix-blend-multiply" />
      </div>

      <Nav />

      <main className="relative h-full pt-20 md:pt-24 pb-24 md:pb-6 px-3 md:px-6 flex flex-col">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0">
          {/* HEADER — compact */}
          <div className="flex items-end justify-between gap-3 mb-4 md:mb-5">
            <div className="min-w-0">
              {kicker && (
                <div className="text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-sea font-semibold flex items-center gap-2">
                  <span className="inline-block h-px w-6 bg-sea/60" />
                  {kicker}
                </div>
              )}
              <h1 className="font-display text-3xl md:text-4xl text-navy leading-[1.1] truncate mt-1">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-1 mt-1">
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
                className="h-16 md:h-24 w-auto object-contain shrink-0 drop-shadow-[0_10px_22px_rgba(12,35,64,0.4)]"
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
      : "bg-white rounded-2xl border border-[rgba(12,35,64,0.08)] shadow-[0_10px_30px_-16px_rgba(12,35,64,0.18)] p-4 md:p-5";
  return (
    <div className={`${base} ${className}`}>{children}</div>
  );
}