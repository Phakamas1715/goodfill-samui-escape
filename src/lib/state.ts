import { useEffect, useState } from "react";
import type { PersonaId } from "./data";

const KEY = "goodfill-care-state-v1";

export interface AppState {
  questAnswers: Record<number, number>;
  persona: PersonaId | null;
  secondaryPersona: PersonaId | null;
  credits: number;
  bookedProgramId: string | null;
  bookingDate: string | null;
  checkins: { date: string; mood: number; note?: string }[];
  habits: { name: string; days: string[] }[];
  aiInsight?: {
    summary?: string;
    strengths?: string[];
    focusAreas?: string[];
    dailyRitual?: string[];
    avoid?: string[];
  } | null;
}

const initial: AppState = {
  questAnswers: {},
  persona: null,
  secondaryPersona: null,
  credits: 0,
  bookedProgramId: null,
  bookingDate: null,
  checkins: [],
  habits: [
    { name: "Morning meditation 5'", days: [] },
    { name: "Hydration 2L", days: [] },
    { name: "No screen after 10pm", days: [] },
  ],
  aiInsight: null,
};

function read(): AppState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

const listeners = new Set<() => void>();
let cached: AppState | null = null;

function getState() {
  if (cached) return cached;
  cached = read();
  return cached;
}

function setState(updater: (s: AppState) => AppState) {
  cached = updater(getState());
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(cached));
  }
  listeners.forEach((l) => l());
}

export function useAppState(): [AppState, typeof setState] {
  const [hydrated, setHydrated] = useState(false);
  const [, force] = useState(0);
  useEffect(() => {
    cached = read();
    setHydrated(true);
    const l = () => force((x) => x + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  // During SSR and the first client render, return the deterministic initial
  // state so server and client output match (prevents hydration mismatch).
  return [hydrated ? getState() : initial, setState];
}